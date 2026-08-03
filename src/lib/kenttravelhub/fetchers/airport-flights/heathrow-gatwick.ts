import {
  delayMinutesBetween,
  enrichFlightFlags,
  isCancelledStatus,
  londonWallClockToDate,
  prioritizeUpcomingFlights,
  type KthAirportFlight,
  type KthFlightDirection,
} from "@/lib/kenttravelhub/airport-live";
import { fetchText } from "@/lib/kenttravelhub/fetchers/http";

const HEATHROW_HEADERS = {
  Origin: "https://www.heathrow.com",
  Referer: "https://www.heathrow.com/arrivals",
  Accept: "application/json",
  "Accept-Encoding": "gzip, deflate, br",
  "User-Agent": "KentTravelHub/1.0",
};

const GATWICK_FETCH_BASE =
  "https://www.gatwickairport.com/on/demandware.store/Sites-Gatwick-Site/en_GB/LiveFlights-FetchFlights";

type HeathrowPort = {
  portOfCallType?: string;
  airportFacility?: {
    iataIdentifier?: string;
    name?: string;
    airportCityLocation?: { name?: string };
    terminalFacility?: { code?: string; gateFacility?: { identifier?: string } };
  };
  operatingTimes?: {
    scheduled?: { local?: string; utc?: string };
    estimated?: { local?: string; utc?: string };
    actual?: { local?: string; utc?: string };
  };
};

type HeathrowFlight = {
  flightService?: {
    iataFlightIdentifier?: string;
    arrivalOrDeparture?: "A" | "D";
    airlineParty?: { iataIdentifier?: string; name?: string };
    aircraftMovement?: {
      aircraftMovementStatus?: Array<{
        message?: string;
        statusCode?: string;
      }>;
      route?: { portsOfCall?: HeathrowPort[] };
    };
  };
};

function portByType(ports: HeathrowPort[] | undefined, type: string): HeathrowPort | undefined {
  return ports?.find((p) => p.portOfCallType === type);
}

function parseHeathrowFlight(
  item: HeathrowFlight,
  direction: KthFlightDirection,
): KthAirportFlight | null {
  const svc = item.flightService;
  if (!svc?.iataFlightIdentifier) return null;

  const ports = svc.aircraftMovement?.route?.portsOfCall ?? [];
  const origin = portByType(ports, "ORIGIN");
  const destination = portByType(ports, "DESTINATION");
  const relevant = direction === "arrival" ? destination : origin;
  const other = direction === "arrival" ? origin : destination;

  const scheduled =
    relevant?.operatingTimes?.scheduled?.local ??
    relevant?.operatingTimes?.scheduled?.utc ??
    "";
  const estimated =
    relevant?.operatingTimes?.estimated?.local ??
    relevant?.operatingTimes?.estimated?.utc;

  const statusMsg =
    svc.aircraftMovement?.aircraftMovementStatus?.[0]?.message ?? "Scheduled";
  const statusCode =
    svc.aircraftMovement?.aircraftMovementStatus?.[0]?.statusCode ?? "";

  const routeLabel =
    other?.airportFacility?.airportCityLocation?.name ??
    other?.airportFacility?.name ??
    other?.airportFacility?.iataIdentifier ??
    "—";

  const terminal = relevant?.airportFacility?.terminalFacility?.code;
  const gate = relevant?.airportFacility?.terminalFacility?.gateFacility?.identifier;

  const cancelled = /cancel/i.test(statusMsg) || statusCode === "CX";
  const delayMinutes = delayMinutesBetween(scheduled, estimated);

  return enrichFlightFlags({
    id: `lhr-${svc.iataFlightIdentifier}-${direction}`,
    flightNumber: svc.iataFlightIdentifier.replace(/\s+/g, ""),
    airline: svc.airlineParty?.name ?? svc.airlineParty?.iataIdentifier ?? "—",
    airlineCode: svc.airlineParty?.iataIdentifier,
    direction,
    routeLabel,
    scheduledTime: scheduled,
    estimatedTime: estimated,
    status: statusMsg,
    terminal: terminal ? `T${terminal}` : undefined,
    gate: gate || undefined,
    delayed: false,
    cancelled,
    delayMinutes,
  });
}

async function fetchHeathrowDirection(
  direction: KthFlightDirection,
): Promise<KthAirportFlight[]> {
  const path = direction === "arrival" ? "arrivals" : "departures";
  const referer =
    direction === "arrival"
      ? "https://www.heathrow.com/arrivals"
      : "https://www.heathrow.com/departures";

  const res = await fetch(
    `https://api-dp-prod.dp.heathrow.com/pihub/flights/${path}`,
    {
      headers: { ...HEATHROW_HEADERS, Referer: referer },
      cache: "no-store",
    },
  );
  if (!res.ok) return [];

  const data = (await res.json()) as HeathrowFlight[];
  if (!Array.isArray(data)) return [];

  const parsed = data
    .map((item) => parseHeathrowFlight(item, direction))
    .filter((f): f is KthAirportFlight => f !== null);

  return prioritizeUpcomingFlights(parsed, 12);
}

export async function fetchHeathrowFlights(): Promise<{
  arrivals: KthAirportFlight[];
  departures: KthAirportFlight[];
  source: string;
}> {
  const [arrivals, departures] = await Promise.all([
    fetchHeathrowDirection("arrival"),
    fetchHeathrowDirection("departure"),
  ]);
  return { arrivals, departures, source: "heathrow.com/pihub" };
}

export async function lookupHeathrowFlight(
  query: string,
): Promise<KthAirportFlight | null> {
  const normalized = query.replace(/\s+/g, "").toUpperCase();
  const { arrivals, departures } = await fetchHeathrowFlights();
  const all = [...arrivals, ...departures];
  return (
    all.find(
      (f) =>
        f.flightNumber.toUpperCase() === normalized ||
        f.flightNumber.toUpperCase().replace(/^([A-Z]{2})0+/, "$1") ===
          normalized.replace(/^([A-Z]{2})0+/, "$1"),
    ) ?? null
  );
}

function gatwickRowSuffix(direction: KthFlightDirection): string {
  return direction === "arrival" ? "_A" : "_D";
}

/** Parse Gatwick LiveFlights HTML fragment. */
export function parseGatwickFlightsHtml(
  html: string,
  direction: KthFlightDirection,
): KthAirportFlight[] {
  const suffix = gatwickRowSuffix(direction);
  const flights: KthAirportFlight[] = [];
  const rowRe =
    /<tr class="flight-line[^"]*"[^>]*id="([^"]+)"[\s\S]*?<td class="time">\s*([\d:]+)\s*<\/td>[\s\S]*?<td class="destination">\s*([\s\S]*?)<\/td>[\s\S]*?<td class="d-none d-md-table-cell">([^<]+)<\/td>[\s\S]*?<td class="d-none d-md-table-cell">([^<]*)<\/td>[\s\S]*?<td class="d-none d-md-table-cell">\s*([\s\S]*?)\s*<\/td>/gi;

  let match: RegExpExecArray | null;
  while ((match = rowRe.exec(html)) !== null) {
    const [, rowId, time, destinationRaw, flightNo, status, terminalRaw] = match;
    if (!rowId.endsWith(suffix)) continue;

    const destination = destinationRaw.replace(/<[^>]+>/g, "").trim();
    const terminal = terminalRaw.replace(/<[^>]+>/g, "").trim();
    const statusText = status.trim();
    const flightNumber = flightNo.trim().replace(/\s+/g, "");
    const dateMatch = rowId.match(/_(\d{4}-\d{2}-\d{2})_[AD]$/);
    const datePart = dateMatch?.[1];
    const timePart = time.trim();
    const [hour, minute] = timePart.split(":").map(Number);
    const scheduledTime =
      datePart && Number.isFinite(hour) && Number.isFinite(minute)
        ? londonWallClockToDate(
            ...datePart.split("-").map(Number) as [number, number, number],
            hour,
            minute,
          ).toISOString()
        : timePart;
    const expectedMatch = statusText.match(/expected\s+(\d{1,2}:\d{2})/i);
    const estimatedTime =
      expectedMatch && datePart
        ? londonWallClockToDate(
            ...datePart.split("-").map(Number) as [number, number, number],
            ...expectedMatch[1].split(":").map(Number) as [number, number],
          ).toISOString()
        : expectedMatch
          ? expectedMatch[1]
          : undefined;

    flights.push(
      enrichFlightFlags({
        id: `lgw-${rowId}`,
        flightNumber,
        airline: flightNumber.replace(/\d+/g, "") || "—",
        direction,
        routeLabel: destination || "—",
        scheduledTime,
        estimatedTime,
        status: statusText || "Scheduled",
        terminal: terminal ? `${terminal} Terminal` : undefined,
        delayed: false,
        cancelled: isCancelledStatus(statusText),
      }),
    );
  }

  return flights;
}

async function fetchGatwickDirection(
  destination: "A" | "D",
  direction: KthFlightDirection,
): Promise<KthAirportFlight[]> {
  const seen = new Set<string>();
  const flights: KthAirportFlight[] = [];
  let emptyStreak = 0;

  for (let page = 1; page <= 8; page++) {
    const html = await fetchText(
      `${GATWICK_FETCH_BASE}?page=${page}&terminal=all&destination=${destination}&search=`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Referer: `https://www.gatwickairport.com/flights?destination=${destination}`,
        },
      },
    );

    if (!html) {
      emptyStreak++;
      if (emptyStreak >= 2 && page > 2) break;
      continue;
    }

    const batch = parseGatwickFlightsHtml(html, direction);
    const fresh = batch.filter((f) => !seen.has(f.id));
    if (!fresh.length) {
      emptyStreak++;
      if (emptyStreak >= 2 && page > 2) break;
      continue;
    }

    emptyStreak = 0;
    for (const f of fresh) {
      seen.add(f.id);
      flights.push(f);
    }
  }

  return prioritizeUpcomingFlights(flights, 12);
}

export async function fetchGatwickFlights(): Promise<{
  arrivals: KthAirportFlight[];
  departures: KthAirportFlight[];
  source: string;
}> {
  const [arrivals, departures] = await Promise.all([
    fetchGatwickDirection("A", "arrival"),
    fetchGatwickDirection("D", "departure"),
  ]);

  return {
    arrivals,
    departures,
    source: "gatwickairport.com",
  };
}

export async function lookupGatwickFlight(
  query: string,
): Promise<KthAirportFlight | null> {
  const normalized = query.replace(/\s+/g, "").toUpperCase();
  const { arrivals, departures } = await fetchGatwickFlights();
  return (
    [...arrivals, ...departures].find((f) =>
      f.flightNumber.toUpperCase().includes(normalized),
    ) ?? null
  );
}
