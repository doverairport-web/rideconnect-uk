import type { LiveSeverity } from "@/lib/kenttravelhub/content";
import { fetchJson } from "@/lib/kenttravelhub/fetchers/http";
import { isValidGoogleMapsKey } from "@/lib/maps-config";

/** M20 junction 11A — Channel Tunnel / Dover approach (Hythe). */
const M20_J11A = { lat: 51.0938, lng: 1.1029 };
/** Dover Eastern Docks ferry/cruise approach. */
const DOVER_DOCKS = { lat: 51.127, lng: 1.334 };

export type M20JourneyResult = {
  journeyMinutes: number;
  normalMinutes?: number;
  delayMinutes?: number;
  source: string;
};

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

function severityFromJourney(
  journeyMinutes: number,
  delayMinutes: number,
): LiveSeverity {
  if (delayMinutes >= 20 || journeyMinutes >= 50) return "alert";
  if (delayMinutes >= 8 || journeyMinutes >= 38) return "warn";
  return "ok";
}

function parseDurationSeconds(duration: string | undefined): number | null {
  if (!duration) return null;
  const match = duration.match(/^(\d+)s$/);
  return match ? Number(match[1]) : null;
}

async function fetchGoogleRoutesM20(): Promise<M20JourneyResult | null> {
  const apiKey = resolveGoogleKey();
  if (!apiKey) return null;

  const departureTime = new Date().toISOString();

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
              latitude: M20_J11A.lat,
              longitude: M20_J11A.lng,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: DOVER_DOCKS.lat,
              longitude: DOVER_DOCKS.lng,
            },
          },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE_OPTIMAL",
        departureTime,
        computeAlternativeRoutes: false,
      }),
      next: { revalidate: 60 },
    },
  );

  if (!response.ok) return null;

  const data = (await response.json()) as {
    routes?: Array<{
      duration?: string;
      staticDuration?: string;
    }>;
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

async function fetchGoogleDirectionsM20(): Promise<M20JourneyResult | null> {
  const apiKey = resolveGoogleKey();
  if (!apiKey) return null;

  const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
  url.searchParams.set("origin", `${M20_J11A.lat},${M20_J11A.lng}`);
  url.searchParams.set("destination", `${DOVER_DOCKS.lat},${DOVER_DOCKS.lng}`);
  url.searchParams.set("region", "uk");
  url.searchParams.set("mode", "driving");
  url.searchParams.set("departure_time", "now");
  url.searchParams.set("traffic_model", "best_guess");
  url.searchParams.set("key", apiKey);

  const data = await fetchJson<{
    status: string;
    routes?: Array<{
      legs?: Array<{
        duration?: { value: number };
        duration_in_traffic?: { value: number };
      }>;
    }>;
  }>(url.toString());

  const leg = data?.routes?.[0]?.legs?.[0];
  if (!leg?.duration?.value) return null;

  const normalMinutes = Math.round(leg.duration.value / 60);
  const journeyMinutes = Math.round(
    (leg.duration_in_traffic?.value ?? leg.duration.value) / 60,
  );

  return {
    journeyMinutes,
    normalMinutes,
    delayMinutes: Math.max(0, journeyMinutes - normalMinutes),
    source: "google.com/maps-live",
  };
}

async function fetchTomTomM20(): Promise<M20JourneyResult | null> {
  const apiKey = process.env.TOMTOM_API_KEY?.trim();
  if (!apiKey) return null;

  const path = `${M20_J11A.lat},${M20_J11A.lng}:${DOVER_DOCKS.lat},${DOVER_DOCKS.lng}`;
  const url = new URL(
    `https://api.tomtom.com/routing/1/calculateRoute/${path}/json`,
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("traffic", "true");
  url.searchParams.set("travelMode", "car");

  const data = await fetchJson<{
    routes?: Array<{
      summary?: {
        travelTimeInSeconds?: number;
        noTrafficTravelTimeInSeconds?: number;
      };
    }>;
  }>(url.toString());

  const summary = data?.routes?.[0]?.summary;
  if (!summary?.travelTimeInSeconds) return null;

  const journeyMinutes = Math.round(summary.travelTimeInSeconds / 60);
  const normalMinutes = summary.noTrafficTravelTimeInSeconds
    ? Math.round(summary.noTrafficTravelTimeInSeconds / 60)
    : undefined;

  return {
    journeyMinutes,
    normalMinutes,
    delayMinutes:
      normalMinutes !== undefined
        ? Math.max(0, journeyMinutes - normalMinutes)
        : undefined,
    source: "tomtom.com/live",
  };
}

async function fetchOsrmM20Baseline(): Promise<number | null> {
  const coords = `${M20_J11A.lng},${M20_J11A.lat};${DOVER_DOCKS.lng},${DOVER_DOCKS.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`;

  const data = await fetchJson<{
    routes?: Array<{ duration?: number }>;
  }>(url);

  const seconds = data?.routes?.[0]?.duration;
  return seconds ? Math.round(seconds / 60) : null;
}

function incidentDelayMultiplier(incidents: string[]): number {
  if (incidents.length === 0) return 1;
  const text = incidents.join(" ").toLowerCase();
  if (/closure|closed|accident|severe|stationary/.test(text)) return 1.45;
  if (/delay|queue|congest|slow/.test(text)) return 1.25;
  return 1.15;
}

async function fetchOsrmM20Estimate(
  incidents: string[],
): Promise<M20JourneyResult | null> {
  const baseline = await fetchOsrmM20Baseline();
  if (!baseline) return null;

  const hour = new Date().getHours();
  const peakFactor = hour >= 7 && hour <= 10 ? 1.12 : hour >= 16 && hour <= 19 ? 1.1 : 1;
  const incidentFactor = incidentDelayMultiplier(incidents);
  const journeyMinutes = Math.round(baseline * peakFactor * incidentFactor);
  const normalMinutes = baseline;
  const delayMinutes = Math.max(0, journeyMinutes - normalMinutes);

  return {
    journeyMinutes,
    normalMinutes,
    delayMinutes,
    source: incidents.length > 0 ? "osrm + nh-incidents" : "osrm-estimate",
  };
}

export async function fetchM20JourneyLive(
  incidents: string[] = [],
): Promise<M20JourneyResult | null> {
  return (
    (await fetchGoogleRoutesM20()) ??
    (await fetchGoogleDirectionsM20()) ??
    (await fetchTomTomM20()) ??
    (await fetchOsrmM20Estimate(incidents))
  );
}

export function buildM20Detail(
  journey: M20JourneyResult,
  incidents: string[],
): { detail: string; severity: LiveSeverity } {
  const delay = journey.delayMinutes ?? 0;
  const severity =
    incidents.length > 0
      ? "alert"
      : severityFromJourney(journey.journeyMinutes, delay);

  if (incidents.length > 0) {
    const summary = incidents[0].slice(0, 90);
    return {
      severity,
      detail: `Live ${journey.journeyMinutes} min J11A→Dover · NH alert: ${summary}`,
    };
  }

  if (severity === "ok") {
    return {
      severity,
      detail: `Live journey ${journey.journeyMinutes} min J11A→Dover — flowing normally`,
    };
  }

  if (severity === "warn") {
    return {
      severity,
      detail: `Live journey ${journey.journeyMinutes} min J11A→Dover — ${delay} min slower than usual`,
    };
  }

  return {
    severity,
    detail: `Live journey ${journey.journeyMinutes} min J11A→Dover — heavy delays, allow extra time`,
  };
}
