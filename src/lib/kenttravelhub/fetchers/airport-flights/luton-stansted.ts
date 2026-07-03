import {
  enrichFlightFlags,
  isCancelledStatus,
  prioritizeUpcomingFlights,
  type KthAirportFlight,
  type KthFlightDirection,
} from "@/lib/kenttravelhub/airport-live";
import { fetchJson } from "@/lib/kenttravelhub/fetchers/http";

type LutonFlight = {
  airlineCode?: string;
  flightNumber?: string;
  airline?: string;
  originalDestination?: string;
  airportCode?: string;
  scheduledTime?: string;
  estimatedTime?: string;
  actualTime?: string;
  status?: string;
  message?: string;
  gateCode?: string;
  cancelled?: boolean;
  diverted?: boolean;
  isArrival?: boolean;
};

function parseLutonFlight(item: LutonFlight): KthAirportFlight | null {
  if (!item.flightNumber) return null;

  const direction: KthFlightDirection = item.isArrival ? "arrival" : "departure";
  const status = item.message?.trim() || item.status || "Scheduled";
  const scheduled = item.scheduledTime ?? "";
  const estimated = item.estimatedTime;

  return enrichFlightFlags({
    id: `ltn-${item.flightNumber}-${direction}`,
    flightNumber: item.flightNumber.replace(/\s+/g, ""),
    airline: item.airline ?? item.airlineCode ?? "—",
    airlineCode: item.airlineCode,
    direction,
    routeLabel: item.originalDestination ?? item.airportCode ?? "—",
    scheduledTime: scheduled,
    estimatedTime: estimated,
    status,
    gate: item.gateCode || undefined,
    delayed: false,
    cancelled: isCancelledStatus(status, item.cancelled),
  });
}

const LUTON_SEARCH_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

async function fetchLutonSearch(term: string): Promise<LutonFlight[]> {
  const url = `https://www.london-luton.co.uk/api/flights/flightarrivalsanddepartures?searchTerm=${encodeURIComponent(term)}&exactflight=false`;
  const data = await fetchJson<LutonFlight[]>(url);
  return Array.isArray(data) ? data : [];
}

export async function fetchLutonFlights(): Promise<{
  arrivals: KthAirportFlight[];
  departures: KthAirportFlight[];
  source: string;
}> {
  const batches = await Promise.all(
    LUTON_SEARCH_CHARS.map((term) => fetchLutonSearch(term)),
  );

  const byNumber = new Map<string, KthAirportFlight>();
  for (const batch of batches) {
    for (const item of batch) {
      const parsed = parseLutonFlight(item);
      if (parsed) byNumber.set(parsed.flightNumber, parsed);
    }
  }

  const all = [...byNumber.values()];
  return {
    arrivals: prioritizeUpcomingFlights(
      all.filter((f) => f.direction === "arrival"),
      12,
    ),
    departures: prioritizeUpcomingFlights(
      all.filter((f) => f.direction === "departure"),
      12,
    ),
    source: "london-luton.co.uk",
  };
}

export async function lookupLutonFlight(
  query: string,
): Promise<KthAirportFlight | null> {
  const normalized = query.replace(/\s+/g, "").toUpperCase();
  const url = `https://www.london-luton.co.uk/api/flights/flightarrivalsanddepartures?searchTerm=${encodeURIComponent(normalized)}&exactflight=true`;
  const data = await fetchJson<LutonFlight[]>(url);
  if (!Array.isArray(data) || data.length === 0) return null;
  return parseLutonFlight(data[0]);
}

type AerodataboxFlight = {
  number?: string;
  airline?: { name?: string; iata?: string };
  status?: string;
  departure?: {
    scheduledTime?: { local?: string };
    revisedTime?: { local?: string };
    terminal?: string;
    gate?: string;
  };
  arrival?: {
    scheduledTime?: { local?: string };
    revisedTime?: { local?: string };
    terminal?: string;
    gate?: string;
  };
};

function parseAerodataboxFlight(
  item: AerodataboxFlight,
  direction: KthFlightDirection,
  airportIata: string,
): KthAirportFlight | null {
  const leg = direction === "arrival" ? item.arrival : item.departure;
  const other = direction === "arrival" ? item.departure : item.arrival;
  if (!item.number || !leg) return null;

  const scheduled = leg.scheduledTime?.local ?? "";
  const estimated = leg.revisedTime?.local;
  const status = item.status ?? "Scheduled";

  return enrichFlightFlags({
    id: `${airportIata}-${item.number}-${direction}`,
    flightNumber: item.number.replace(/\s+/g, ""),
    airline: item.airline?.name ?? item.airline?.iata ?? "—",
    airlineCode: item.airline?.iata,
    direction,
    routeLabel: other?.scheduledTime ? airportIata : "—",
    scheduledTime: scheduled,
    estimatedTime: estimated,
    status,
    terminal: leg.terminal,
    gate: leg.gate,
    delayed: false,
    cancelled: isCancelledStatus(status),
  });
}

async function fetchAerodataboxAirport(
  iata: string,
  direction: "Arrival" | "Departure",
): Promise<AerodataboxFlight[]> {
  const key = process.env.AERODATABOX_RAPIDAPI_KEY?.trim();
  if (!key) return [];

  const url = new URL(
    `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${iata}`,
  );
  url.searchParams.set("offsetMinutes", "-120");
  url.searchParams.set("durationMinutes", "720");
  url.searchParams.set("withLeg", "true");
  url.searchParams.set("direction", direction);

  const res = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
      "x-rapidapi-key": key,
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];

  const data = (await res.json()) as { arrivals?: AerodataboxFlight[]; departures?: AerodataboxFlight[] };
  return direction === "Arrival" ? (data.arrivals ?? []) : (data.departures ?? []);
}

export async function fetchStanstedFlights(): Promise<{
  arrivals: KthAirportFlight[];
  departures: KthAirportFlight[];
  source: string;
}> {
  const key = process.env.AERODATABOX_RAPIDAPI_KEY?.trim();
  if (!key) {
    return { arrivals: [], departures: [], source: "stanstedairport.com" };
  }

  const [arr, dep] = await Promise.all([
    fetchAerodataboxAirport("STN", "Arrival"),
    fetchAerodataboxAirport("STN", "Departure"),
  ]);

  return {
    arrivals: prioritizeUpcomingFlights(
      arr
        .map((f) => parseAerodataboxFlight(f, "arrival", "STN"))
        .filter((f): f is KthAirportFlight => f !== null),
      12,
    ),
    departures: prioritizeUpcomingFlights(
      dep
        .map((f) => parseAerodataboxFlight(f, "departure", "STN"))
        .filter((f): f is KthAirportFlight => f !== null),
      12,
    ),
    source: "aerodatabox.com",
  };
}

export async function lookupStanstedFlight(
  query: string,
): Promise<KthAirportFlight | null> {
  const key = process.env.AERODATABOX_RAPIDAPI_KEY?.trim();
  if (!key) return null;

  const normalized = query.replace(/\s+/g, "").toUpperCase();
  const url = `https://aerodatabox.p.rapidapi.com/flights/number/${encodeURIComponent(normalized)}?withAircraftImage=false&withLocation=false&dateLocal=${new Date().toISOString().slice(0, 10)}`;

  const res = await fetch(url, {
    headers: {
      "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
      "x-rapidapi-key": key,
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as AerodataboxFlight[];
  if (!Array.isArray(data) || data.length === 0) return null;

  const hit = data.find(
    (f) =>
      f.arrival?.scheduledTime?.local &&
      (f.arrival as { airport?: { iata?: string } }).airport?.iata === "STN",
  ) ?? data[0];

  const direction: KthFlightDirection =
    (hit.arrival as { airport?: { iata?: string } } | undefined)?.airport?.iata === "STN"
      ? "arrival"
      : "departure";

  return parseAerodataboxFlight(hit, direction, "STN");
}
