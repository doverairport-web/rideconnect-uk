import type { AirportCode } from "@/lib/pricing";

export type KthAirportId = Exclude<AirportCode, "city">;

export type KthFlightDirection = "arrival" | "departure";

export type KthAirportFlight = {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode?: string;
  direction: KthFlightDirection;
  /** Origin (arrivals) or destination (departures). */
  routeLabel: string;
  scheduledTime: string;
  estimatedTime?: string;
  status: string;
  terminal?: string;
  gate?: string;
  delayed: boolean;
  cancelled: boolean;
  delayMinutes?: number;
};

export type KthAirportWeather = {
  tempC: number;
  label: string;
};

export type KthAirportJourney = {
  journeyMinutes: number;
  normalMinutes?: number;
  delayMinutes?: number;
  source: string;
  /** Leave Dover by this time for a typical midday international flight. */
  recommendedDeparture?: string;
};

export type KthAirportLiveBoard = {
  id: KthAirportId;
  name: string;
  iata: string;
  officialFlightsUrl: string;
  arrivals: KthAirportFlight[];
  departures: KthAirportFlight[];
  weather: KthAirportWeather;
  journey: KthAirportJourney;
  terminals?: string[];
  source: string;
  updatedAt: string;
};

export type KthAirportLiveDashboard = {
  updatedAt: string;
  flightsToday: number;
  arrivals: number;
  departures: number;
  delayed: number;
  cancelled: number;
  weatherLabel: string;
  doverTravelMinutes: number | null;
  airports: KthAirportLiveBoard[];
  m20: {
    label: string;
    detail: string;
    severity: "ok" | "warn" | "alert";
    journeyMinutes?: number;
    delayMinutes?: number;
  };
  brock: {
    label: string;
    active: boolean;
    detail: string;
    severity: "ok" | "warn" | "alert";
  };
  weatherImpacts: string[];
  busiestAirport: { id: KthAirportId; name: string; flights: number } | null;
  averageDoverMinutes: number | null;
};

export const KTH_AIRPORT_LIVE_INTRO =
  "Live arrivals, departures and delays for Heathrow, Gatwick, Stansted and Luton — with Dover travel times, M20 status and weather that affects your airport run. Bookmark this before every cruise transfer or flight connection.";

export const KTH_AIRPORTS: Record<
  KthAirportId,
  {
    name: string;
    shortName: string;
    iata: string;
    icao: string;
    lat: number;
    lon: number;
    officialFlightsUrl: string;
    terminals: string[];
    staticJourneyMinutes: number;
    journeyLabel: string;
  }
> = {
  heathrow: {
    name: "London Heathrow",
    shortName: "Heathrow",
    iata: "LHR",
    icao: "EGLL",
    lat: 51.47,
    lon: -0.4543,
    officialFlightsUrl: "https://www.heathrow.com/arrivals",
    terminals: ["T2", "T3", "T4", "T5"],
    staticJourneyMinutes: 135,
    journeyLabel: "2 hr – 2 hr 45 min",
  },
  gatwick: {
    name: "London Gatwick",
    shortName: "Gatwick",
    iata: "LGW",
    icao: "EGKK",
    lat: 51.1537,
    lon: -0.1821,
    officialFlightsUrl: "https://www.gatwickairport.com/flights",
    terminals: ["North", "South"],
    staticJourneyMinutes: 105,
    journeyLabel: "1 hr 30 min – 2 hr",
  },
  stansted: {
    name: "London Stansted",
    shortName: "Stansted",
    iata: "STN",
    icao: "EGSS",
    lat: 51.886,
    lon: 0.2389,
    officialFlightsUrl: "https://www.stanstedairport.com/arrivals/",
    terminals: ["Main"],
    staticJourneyMinutes: 135,
    journeyLabel: "2 hr – 2 hr 45 min",
  },
  luton: {
    name: "London Luton",
    shortName: "Luton",
    iata: "LTN",
    icao: "EGGW",
    lat: 51.8747,
    lon: -0.3683,
    officialFlightsUrl: "https://www.london-luton.co.uk/flight-info",
    terminals: ["Main"],
    staticJourneyMinutes: 150,
    journeyLabel: "2 hr 30 min – 3 hr",
  },
};

export const KTH_AIRPORT_ORDER: KthAirportId[] = [
  "heathrow",
  "gatwick",
  "stansted",
  "luton",
];

/** Dover Eastern Docks — cruise & ferry reference point. */
export const DOVER_PORT = { lat: 51.127, lng: 1.334 };

export function normalizeFlightQuery(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export function formatFlightTime(isoOrLocal: string): string {
  if (!isoOrLocal) return "—";
  if (/^\d{1,2}:\d{2}$/.test(isoOrLocal)) return isoOrLocal;
  const d = new Date(isoOrLocal);
  if (Number.isNaN(d.getTime())) return isoOrLocal;
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  });
}

export function recommendedDoverDeparture(
  journeyMinutes: number,
  flightScheduledIso: string,
  bufferMinutes = 90,
): string | undefined {
  const flight = new Date(flightScheduledIso);
  if (Number.isNaN(flight.getTime())) return undefined;
  const leave = new Date(
    flight.getTime() - (journeyMinutes + bufferMinutes) * 60_000,
  );
  return leave.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  });
}

export function parseFlightInstant(value: string, ref = new Date()): Date | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
    const [hour, minute] = trimmed.split(":").map(Number);
    const londonNow = new Date(
      ref.toLocaleString("en-US", { timeZone: "Europe/London" }),
    );
    const d = new Date(londonNow);
    d.setHours(hour, minute, 0, 0);
    // Times just after midnight when ref is late evening belong to the next day.
    if (hour < 12 && ref.getTime() - d.getTime() > 6 * 60 * 60 * 1000) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{1,2}:\d{2}/.test(trimmed)) {
    const d = new Date(trimmed);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(trimmed);
  return Number.isNaN(d.getTime()) ? null : d;
}

const DELAY_THRESHOLD_MINUTES = 10;

export function delayMinutesBetween(
  scheduled: string,
  estimated?: string,
): number | undefined {
  const s = parseFlightInstant(scheduled);
  const e = estimated ? parseFlightInstant(estimated) : null;
  if (!s || !e) return undefined;
  const diff = Math.round((e.getTime() - s.getTime()) / 60_000);
  return diff >= DELAY_THRESHOLD_MINUTES ? diff : undefined;
}

export function isCompletedFlightStatus(status: string): boolean {
  return /landed|arrived|bags delivered|baggage in hall|departed|gate closed|cancelled/i.test(
    status,
  );
}

export function isFlightDelayed(flight: {
  scheduledTime: string;
  estimatedTime?: string;
  status: string;
  delayMinutes?: number;
}): boolean {
  const fromTimes = delayMinutesBetween(flight.scheduledTime, flight.estimatedTime);
  if (fromTimes !== undefined) return true;
  if ((flight.delayMinutes ?? 0) >= DELAY_THRESHOLD_MINUTES) return true;
  const status = flight.status.trim();
  if (/^expected\b/i.test(status)) return false;
  return /\bdelayed?\b|\blate\b|\brevised\b|\bdivert/i.test(status);
}

export function enrichFlightFlags(flight: KthAirportFlight): KthAirportFlight {
  const delayMinutes =
    flight.delayMinutes ?? delayMinutesBetween(flight.scheduledTime, flight.estimatedTime);
  return {
    ...flight,
    delayMinutes,
    delayed: isFlightDelayed({ ...flight, delayMinutes }),
  };
}

/** Show current and upcoming flights — drop stale completed rows from hours ago. */
export function prioritizeUpcomingFlights(
  flights: KthAirportFlight[],
  limit = 12,
  ref = new Date(),
): KthAirportFlight[] {
  const now = ref.getTime();
  const windowStart = now - 60 * 60 * 1000;
  const windowEnd = now + 18 * 60 * 60 * 1000;

  const ranked = flights
    .map((f) => ({
      f,
      t:
        parseFlightInstant(f.scheduledTime, ref) ??
        parseFlightInstant(f.estimatedTime ?? "", ref),
    }))
    .filter(({ f, t }) => {
      if (f.cancelled || isCancelledStatus(f.status, f.cancelled)) return true;
      if (isCompletedFlightStatus(f.status)) {
        if (!t) return false;
        return t.getTime() >= now - 90 * 60 * 1000;
      }
      if (!t) return true;
      return t.getTime() >= windowStart && t.getTime() <= windowEnd;
    });

  ranked.sort((a, b) => {
    const aDone = isCompletedFlightStatus(a.f.status);
    const bDone = isCompletedFlightStatus(b.f.status);
    if (aDone !== bDone) return aDone ? 1 : -1;
    const ta = a.t?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const tb = b.t?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return ta - tb;
  });

  return ranked.slice(0, limit).map(({ f }) => f);
}

export function isDelayedStatus(status: string): boolean {
  const trimmed = status.trim();
  if (/^expected\b/i.test(trimmed)) return false;
  return /\bdelayed?\b|\blate\b/i.test(trimmed);
}

export function isCancelledStatus(status: string, cancelled?: boolean): boolean {
  return cancelled === true || /cancel/i.test(status);
}
