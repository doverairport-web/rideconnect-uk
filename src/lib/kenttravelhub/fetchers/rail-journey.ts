import { DOVER_PORT } from "@/lib/kenttravelhub/airport-live";
import {
  DOVER_PRIORY,
  type KthStationTransfer,
} from "@/lib/kenttravelhub/train-live";
import { isValidGoogleMapsKey } from "@/lib/maps-config";

const TRANSFER_DESTINATIONS: Array<{
  id: string;
  label: string;
  lat: number;
  lng: number;
  staticMinutes: number;
  staticLabel: string;
}> = [
  {
    id: "cruise-terminal",
    label: "Dover Priory → Cruise Terminal (CT1 & CT2)",
    lat: 51.1195,
    lng: 1.314,
    staticMinutes: 8,
    staticLabel: "5–10 min taxi",
  },
  {
    id: "ferry-terminal",
    label: "Dover Priory → Ferry Terminal",
    lat: DOVER_PORT.lat,
    lng: DOVER_PORT.lng,
    staticMinutes: 10,
    staticLabel: "8–12 min taxi",
  },
  {
    id: "dover-castle",
    label: "Dover Priory → Dover Castle",
    lat: 51.1297,
    lng: 1.3214,
    staticMinutes: 12,
    staticLabel: "10–15 min taxi",
  },
];

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
): Promise<Pick<KthStationTransfer, "journeyMinutes" | "normalMinutes" | "delayMinutes" | "source"> | null> {
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
              latitude: DOVER_PRIORY.lat,
              longitude: DOVER_PRIORY.lng,
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

export async function fetchStationTransfers(): Promise<KthStationTransfer[]> {
  return Promise.all(
    TRANSFER_DESTINATIONS.map(async (dest) => {
      const live = await fetchGoogleRoute(dest.lat, dest.lng);
      return {
        id: dest.id,
        label: dest.label,
        journeyMinutes: live?.journeyMinutes ?? dest.staticMinutes,
        normalMinutes: live?.normalMinutes,
        delayMinutes: live?.delayMinutes,
        source: live?.source ?? "static-estimate",
        staticEstimate: dest.staticLabel,
      };
    }),
  );
}
