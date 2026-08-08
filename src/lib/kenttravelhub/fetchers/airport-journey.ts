import {
  DOVER_PORT,
  KTH_AIRPORTS,
  nextTypicalFlightIso,
  recommendedDoverDeparture,
  typicalFlightDepartureNote,
  type KthAirportId,
  type KthAirportJourney,
} from "@/lib/kenttravelhub/airport-live";
import { fetchJson } from "@/lib/kenttravelhub/fetchers/http";
import { isValidGoogleMapsKey } from "@/lib/maps-config";

function resolveGoogleKey(): string | null {
  for (const key of [
    process.env.GOOGLE_MAPS_API_KEY,
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  ]) {
    const trimmed = key?.trim() ?? "";
    if (isValidGoogleMapsKey(trimmed)) return trimmed;
  }
  return null;
}

function parseDurationSeconds(duration: string | undefined): number | null {
  if (!duration) return null;
  const match = duration.match(/^(\d+)s$/);
  return match ? Number(match[1]) : null;
}

async function fetchGoogleRoute(
  destLat: number,
  destLng: number,
): Promise<KthAirportJourney | null> {
  const apiKey = resolveGoogleKey();
  if (!apiKey) return null;

  const response = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "routes.duration,routes.staticDuration,routes.distanceMeters",
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: DOVER_PORT.lat,
              longitude: DOVER_PORT.lng,
            },
          },
        },
        destination: {
          location: {
            latLng: { latitude: destLat, longitude: destLng },
          },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE_OPTIMAL",
        departureTime: new Date().toISOString(),
      }),
      next: { revalidate: 60 },
    },
  );

  if (!response.ok) return null;

  const data = (await response.json()) as {
    routes?: Array<{ duration?: string; staticDuration?: string }>;
  };
  const route = data.routes?.[0];
  const trafficSeconds = parseDurationSeconds(route?.duration);
  const staticSeconds = parseDurationSeconds(route?.staticDuration);
  if (!trafficSeconds) return null;

  const journeyMinutes = Math.round(trafficSeconds / 60);
  const normalMinutes = staticSeconds
    ? Math.round(staticSeconds / 60)
    : undefined;
  const delayMinutes =
    normalMinutes !== undefined
      ? Math.max(0, journeyMinutes - normalMinutes)
      : undefined;

  return {
    journeyMinutes,
    normalMinutes,
    delayMinutes,
    source: "google.com/routes-live",
  };
}

export async function fetchAirportJourney(
  airportId: KthAirportId,
): Promise<KthAirportJourney> {
  const airport = KTH_AIRPORTS[airportId];
  const live = await fetchGoogleRoute(airport.lat, airport.lon);

  const journeyMinutes =
    live?.journeyMinutes ?? airport.staticJourneyMinutes;

  const exampleFlightIso = nextTypicalFlightIso();

  return {
    journeyMinutes,
    normalMinutes: live?.normalMinutes,
    delayMinutes: live?.delayMinutes,
    source: live?.source ?? "static-estimate",
    recommendedDeparture: recommendedDoverDeparture(
      journeyMinutes,
      exampleFlightIso,
      90,
    ),
    recommendedDepartureNote: typicalFlightDepartureNote(),
  };
}

export async function fetchOsrmAirportBaseline(
  airportId: KthAirportId,
): Promise<number | null> {
  const airport = KTH_AIRPORTS[airportId];
  const coords = `${DOVER_PORT.lng},${DOVER_PORT.lat};${airport.lon},${airport.lat}`;
  const data = await fetchJson<{ routes?: Array<{ duration?: number }> }>(
    `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`,
  );
  const seconds = data?.routes?.[0]?.duration;
  return seconds ? Math.round(seconds / 60) : null;
}
