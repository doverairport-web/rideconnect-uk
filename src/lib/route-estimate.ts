import { hasGoogleMapsServer } from "@/lib/maps-config";
import { geocodeBestMatch } from "@/lib/nominatim";

const NOMINATIM_UA = "RideConnectUk-DoverTaxi/1.0 (fare-estimate)";

export type RouteMapData = {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  polyline: string;
};

export type RouteEstimate = {
  distanceMeters: number;
  durationSeconds: number;
  source: "google" | "osrm";
  map?: RouteMapData;
};

async function resolveCoord(
  query: string,
  coord?: { lat: number; lng: number } | null,
): Promise<{ lat: number; lon: number } | null> {
  return geocodeBestMatch(query, NOMINATIM_UA, coord ?? null);
}

async function routeOsrm(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
): Promise<RouteEstimate | null> {
  const coords = `${from.lon},${from.lat};${to.lon},${to.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=polyline`;

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) return null;

  const data = (await response.json()) as {
    routes?: Array<{ distance: number; duration: number; geometry?: string }>;
  };

  const route = data.routes?.[0];
  if (!route?.geometry) return null;

  return {
    distanceMeters: Math.round(route.distance),
    durationSeconds: Math.round(route.duration),
    source: "osrm",
    map: {
      polyline: route.geometry,
      origin: { lat: from.lat, lng: from.lon },
      destination: { lat: to.lat, lng: to.lon },
    },
  };
}

async function routeGoogle(
  pickup: string,
  destination: string,
  departureTime?: number,
): Promise<RouteEstimate | null> {
  if (!hasGoogleMapsServer()) return null;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY!.trim();

  const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
  url.searchParams.set("origin", pickup);
  url.searchParams.set("destination", destination);
  url.searchParams.set("region", "uk");
  url.searchParams.set("mode", "driving");
  url.searchParams.set("key", apiKey);
  if (departureTime) {
    url.searchParams.set("departure_time", String(departureTime));
    url.searchParams.set("traffic_model", "best_guess");
  }

  const response = await fetch(url.toString(), { next: { revalidate: 600 } });
  if (!response.ok) return null;

  const data = (await response.json()) as {
    status: string;
    routes?: Array<{
      overview_polyline?: { points: string };
      legs?: Array<{
        distance?: { value: number };
        duration?: { value: number };
        duration_in_traffic?: { value: number };
        start_location?: { lat: number; lng: number };
        end_location?: { lat: number; lng: number };
      }>;
    }>;
  };

  if (data.status !== "OK") return null;

  const route = data.routes?.[0];
  const leg = route?.legs?.[0];
  if (!leg?.distance?.value) return null;

  const durationSeconds =
    leg.duration_in_traffic?.value ?? leg.duration?.value ?? 0;

  const polyline = route?.overview_polyline?.points;
  const start = leg.start_location;
  const end = leg.end_location;

  return {
    distanceMeters: leg.distance.value,
    durationSeconds,
    source: "google",
    map:
      polyline && start && end
        ? {
            polyline,
            origin: { lat: start.lat, lng: start.lng },
            destination: { lat: end.lat, lng: end.lng },
          }
        : undefined,
  };
}

/** Add ~12% to duration for local Dover traffic / lights when OSRM has no traffic data. */
function applyTrafficBuffer(estimate: RouteEstimate): RouteEstimate {
  if (estimate.source === "google") return estimate;

  return {
    ...estimate,
    durationSeconds: Math.round(estimate.durationSeconds * 1.12),
  };
}

export async function estimateRoute(
  pickup: string,
  destination: string,
  pickupAt?: Date | null,
  pickupCoord?: { lat: number; lng: number } | null,
  destinationCoord?: { lat: number; lng: number } | null,
): Promise<RouteEstimate | null> {
  const fromCoord = pickupCoord
    ? { lat: pickupCoord.lat, lon: pickupCoord.lng }
    : null;
  const toCoord = destinationCoord
    ? { lat: destinationCoord.lat, lon: destinationCoord.lng }
    : null;

  if (fromCoord && toCoord) {
    const directOsrm = await routeOsrm(fromCoord, toCoord);
    if (directOsrm) return applyTrafficBuffer(directOsrm);
  }

  const departureTime = pickupAt
    ? Math.floor(pickupAt.getTime() / 1000)
    : undefined;

  if (hasGoogleMapsServer()) {
    const google = await routeGoogle(pickup, destination, departureTime);
    if (google) return google;
  }

  const from = fromCoord ?? (await resolveCoord(pickup, pickupCoord ?? null));
  const to = toCoord ?? (await resolveCoord(destination, destinationCoord ?? null));
  if (!from || !to) return null;

  const osrm = await routeOsrm(from, to);
  if (!osrm) return null;

  return applyTrafficBuffer(osrm);
}
