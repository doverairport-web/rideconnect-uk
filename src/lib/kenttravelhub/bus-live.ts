export type KthBusStopId =
  | "dover-priory"
  | "dover-town-centre"
  | "dover-london-coach"
  | "ferry-terminal"
  | "cruise-terminal"
  | "dover-castle"
  | "white-cliffs"
  | "folkestone"
  | "folkestone-london-coach"
  | "canterbury"
  | "canterbury-london-coach";

export type KthBusDeparture = {
  id: string;
  routeNumber: string;
  destination: string;
  scheduledTime: string;
  expectedTime?: string;
  status: string;
  operator: string;
  delayed: boolean;
  cancelled: boolean;
  delayMinutes?: number;
};

export type KthBusDisruption = {
  id: string;
  title: string;
  detail: string;
  severity: "ok" | "warn" | "alert";
  url?: string;
};

export type KthBusLiveBoard = {
  id: KthBusStopId;
  name: string;
  areaLabel: string;
  atcoCode: string;
  officialBoardUrl: string;
  officialTimetableUrl: string;
  departures: KthBusDeparture[];
  source: string;
  updatedAt: string;
  liveAvailable: boolean;
  featuredRoutes: string[];
};

export type KthBusLiveDashboard = {
  updatedAt: string;
  nextDeparture: KthBusDeparture | null;
  toPriory: KthBusDeparture[];
  toCruiseTerminal: KthBusDeparture[];
  toFerryTerminal: KthBusDeparture[];
  toLondon: KthBusDeparture[];
  nextLondonDeparture: KthBusDeparture | null;
  delayed: number;
  cancelled: number;
  disruptions: KthBusDisruption[];
  stops: KthBusLiveBoard[];
  mainStopId: KthBusStopId;
  guides: Array<{
    id: string;
    label: string;
    detail: string;
    href: string;
    external?: boolean;
  }>;
  officialLinks: Array<{
    id: string;
    label: string;
    href: string;
  }>;
};

export const KTH_BUS_LIVE_INTRO =
  "Live Stagecoach departures for Dover town centre, Priory station, the ferry and cruise docks, plus National Express coaches to London Victoria — and local routes to Canterbury, Folkestone and the White Cliffs. Buy Stagecoach tickets online for Dover routes — usually cheaper than paying on the bus. Taxi booking is here if buses are delayed.";

/** Stagecoach ticket shop — online fares are typically below on-bus cash price. */
export const KTH_STAGECOACH_TICKETS_URL = "https://www.stagecoachbus.com/tickets";
export const KTH_STAGECOACH_HOME_URL = "https://www.stagecoachbus.com/";

/** National Express coach tickets — advance online fares vs station/on-board. */
export const KTH_NATIONAL_EXPRESS_HOME_URL = "https://www.nationalexpress.com/en";
export const KTH_NATIONAL_EXPRESS_TICKETS_URL = "https://www.nationalexpress.com/en/coach";

export const KTH_BUS_STOPS: Record<
  KthBusStopId,
  {
    name: string;
    areaLabel: string;
    atcoCode: string;
    featuredRoutes: string[];
    bustimesSlug?: string;
  }
> = {
  "dover-priory": {
    name: "Dover Priory Station",
    areaLabel: "Priory Street & railway station",
    atcoCode: "2400A060290R",
    featuredRoutes: ["66", "63", "15", "D"],
  },
  "dover-town-centre": {
    name: "Dover Town Centre",
    areaLabel: "Pencester Road",
    atcoCode: "2400A070210A",
    featuredRoutes: ["15", "63", "88", "91"],
  },
  "dover-london-coach": {
    name: "Dover → London (coaches)",
    areaLabel: "Pencester Road Stop Y · National Express",
    atcoCode: "2400A070180A",
    featuredRoutes: ["007"],
  },
  "ferry-terminal": {
    name: "Dover Ferry Terminal",
    areaLabel: "Eastern Docks",
    atcoCode: "2400A073930A",
    featuredRoutes: ["66"],
  },
  "cruise-terminal": {
    name: "Dover Cruise Terminal",
    areaLabel: "Western Docks / Gateway",
    atcoCode: "240097548",
    featuredRoutes: ["66", "63"],
  },
  "dover-castle": {
    name: "Dover Castle",
    areaLabel: "Castle Hill",
    atcoCode: "2400103200",
    featuredRoutes: ["93", "D"],
  },
  "white-cliffs": {
    name: "White Cliffs of Dover",
    areaLabel: "St Margaret's & cliffs coast",
    atcoCode: "2400A032120A",
    featuredRoutes: ["93", "102"],
  },
  folkestone: {
    name: "Folkestone",
    areaLabel: "Central & harbour",
    atcoCode: "2400A029430A",
    featuredRoutes: ["91", "10", "102"],
  },
  "folkestone-london-coach": {
    name: "Folkestone → London (coaches)",
    areaLabel: "Bouverie Road West · National Express",
    atcoCode: "2400A028920A",
    featuredRoutes: ["007"],
  },
  canterbury: {
    name: "Canterbury",
    areaLabel: "Bus station",
    atcoCode: "240098898",
    featuredRoutes: ["15", "12", "88"],
  },
  "canterbury-london-coach": {
    name: "Canterbury → London (coaches)",
    areaLabel: "Bus station · National Express",
    atcoCode: "2400A039650A",
    featuredRoutes: ["007", "022"],
  },
};

export const KTH_BUS_STOP_ORDER: KthBusStopId[] = [
  "dover-town-centre",
  "dover-london-coach",
  "dover-priory",
  "ferry-terminal",
  "cruise-terminal",
  "dover-castle",
  "white-cliffs",
  "folkestone",
  "folkestone-london-coach",
  "canterbury",
  "canterbury-london-coach",
];

export const KTH_BUS_GUIDES: KthBusLiveDashboard["guides"] = [
  {
    id: "town-priory",
    label: "Dover town centre ↔ Dover Priory",
    detail: "Routes 63, D and 66 link Pencester Road with Priory station — allow 5–10 minutes.",
    href: "/buses#dover-priory",
  },
  {
    id: "priory-cruise",
    label: "Dover Priory ↔ Cruise Terminal",
    detail:
      "Route 66 serves Eastern Docks; Western Docks cruise berths are a short taxi from Gateway Flats.",
    href: "/cruise-terminal",
  },
  {
    id: "priory-ferry",
    label: "Dover Priory ↔ Ferry Terminal",
    detail: "Route 66 runs Priory → Eastern Docks — check live times before foot-passenger sailings.",
    href: "/ferries",
  },
  {
    id: "dover-london",
    label: "Dover ↔ London Victoria",
    detail:
      "National Express 007 from Pencester Road Stop Y — about 2½–3 hours to Victoria Coach Station via Canterbury and Folkestone.",
    href: "/buses#dover-london-coach",
  },
  {
    id: "dover-canterbury",
    label: "Dover ↔ Canterbury",
    detail: "Stagecoach 15 runs Dover Pencester Road to Canterbury Bus Station — about 50–70 minutes.",
    href: "/news/canterbury-day-trip-from-dover",
  },
  {
    id: "dover-folkestone",
    label: "Dover ↔ Folkestone",
    detail: "Routes 91 and 10 link Dover and Folkestone — useful for Channel Tunnel connections.",
    href: "/news/folkestone-channel-tunnel-guide",
  },
  {
    id: "dover-deal",
    label: "Dover ↔ Deal",
    detail: "Route 93 and 12 connect Dover, Deal and the coast — handy for an extra night ashore.",
    href: "/news/deal-kent-visitor-guide",
  },
  {
    id: "dover-cliffs",
    label: "Dover ↔ White Cliffs",
    detail:
      "Buses towards St Margaret's and the cliffs coast — pair with a taxi for South Foreland Lighthouse.",
    href: "/news/white-cliffs-dover-visitor-guide",
  },
  {
    id: "dover-castle",
    label: "Dover ↔ Dover Castle",
    detail: "Route 93 stops at Dover Castle — uphill walk or short taxi from Priory if you have luggage.",
    href: "/news/dover-castle-visitor-guide",
  },
];

export const KTH_BUS_OFFICIAL_LINKS: KthBusLiveDashboard["officialLinks"] = [
  {
    id: "stagecoach-tickets",
    label: "Buy Stagecoach tickets (online discount)",
    href: KTH_STAGECOACH_TICKETS_URL,
  },
  {
    id: "national-express-tickets",
    label: "Buy National Express tickets (advance fares)",
    href: KTH_NATIONAL_EXPRESS_TICKETS_URL,
  },
  {
    id: "national-express-007",
    label: "National Express 007 Dover–London",
    href: "https://timetables.nationalexpress.com/routes/NX/007/Dover_Town_Centre-London/I",
  },
  {
    id: "national-express",
    label: "National Express home",
    href: KTH_NATIONAL_EXPRESS_HOME_URL,
  },
  {
    id: "stagecoach-updates",
    label: "Stagecoach South East service updates",
    href: "https://www.stagecoachbus.com/south-east",
  },
  {
    id: "traveline",
    label: "Traveline South East",
    href: "https://www.travelinesoutheast.org.uk/",
  },
  {
    id: "bustimes",
    label: "Bus Times route pages",
    href: "https://bustimes.org/operators/stagecoach-south-east",
  },
];

const DELAY_THRESHOLD_MINUTES = 3;
const OPERATOR = "Stagecoach South East";
const NATIONAL_EXPRESS = "National Express";

export const KTH_LONDON_COACH_STOP_IDS: KthBusStopId[] = [
  "dover-london-coach",
  "folkestone-london-coach",
  "canterbury-london-coach",
];

export const KTH_LONDON_COACH_ROUTES = new Set(["007", "008", "022"]);

export function isLondonCoachRoute(routeNumber: string): boolean {
  return KTH_LONDON_COACH_ROUTES.has(routeNumber.trim());
}

export function isLondonCoachDeparture(departure: KthBusDeparture): boolean {
  if (isLondonCoachRoute(departure.routeNumber)) return true;
  return matchesDestination(departure, [
    /victoria/i,
    /\blondon\b/i,
    /elephant\s*&?\s*castle/i,
    /lewisham/i,
    /new cross/i,
  ]);
}

function resolveBusOperator(departure: KthBusDeparture): string {
  if (isLondonCoachRoute(departure.routeNumber)) return NATIONAL_EXPRESS;
  if (/victoria|ramsgate/i.test(departure.destination) && /^0?2/.test(departure.routeNumber)) {
    return NATIONAL_EXPRESS;
  }
  return departure.operator || OPERATOR;
}

export function bustimesStopUrl(atcoCode: string): string {
  return `https://bustimes.org/stops/${encodeURIComponent(atcoCode)}`;
}

export function stagecoachJourneyUrl(from = "Dover", to = "Canterbury"): string {
  return `https://www.stagecoachbus.com/journey-planner?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`;
}

export function formatBusTime(value: string): string {
  if (!value) return "—";
  if (/^\d{1,2}:\d{2}$/.test(value)) return value;
  return value;
}

export function parseBusInstant(value: string, ref = new Date()): Date | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (!/^\d{1,2}:\d{2}$/.test(trimmed)) return null;
  const [hour, minute] = trimmed.split(":").map(Number);
  const londonNow = new Date(
    ref.toLocaleString("en-US", { timeZone: "Europe/London" }),
  );
  const d = new Date(londonNow);
  d.setHours(hour, minute, 0, 0);
  if (hour < 12 && ref.getTime() - d.getTime() > 6 * 60 * 60 * 1000) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

export function delayMinutesBetween(
  scheduled: string,
  expected?: string,
): number | undefined {
  const s = parseBusInstant(scheduled);
  const e = expected ? parseBusInstant(expected) : null;
  if (!s || !e) return undefined;
  const diff = Math.round((e.getTime() - s.getTime()) / 60_000);
  return diff >= DELAY_THRESHOLD_MINUTES ? diff : undefined;
}

export function formatBusStatus(status: string, expectedTime?: string): string {
  const trimmed = status.trim();
  if (trimmed) return trimmed;
  if (!expectedTime) return "Scheduled";
  if (/^on time$/i.test(expectedTime)) return "On time";
  return "Expected";
}

export function isBusCancelled(service: {
  status: string;
  expectedTime?: string;
}): boolean {
  return /\bcancel/i.test(`${service.status} ${service.expectedTime ?? ""}`);
}

export function isBusDelayed(service: {
  scheduledTime: string;
  expectedTime?: string;
  status: string;
  delayMinutes?: number;
}): boolean {
  if (isBusCancelled(service)) return false;
  const fromTimes = delayMinutesBetween(service.scheduledTime, service.expectedTime);
  if (fromTimes !== undefined) return true;
  if ((service.delayMinutes ?? 0) >= DELAY_THRESHOLD_MINUTES) return true;
  return /\bdelayed?\b|\blate\b/i.test(service.status);
}

export function enrichBusFlags(departure: KthBusDeparture): KthBusDeparture {
  const delayMinutes =
    departure.delayMinutes ??
    delayMinutesBetween(departure.scheduledTime, departure.expectedTime);
  const cancelled = isBusCancelled(departure);
  let status = departure.status;
  if (!status || status === "Scheduled") {
    if (cancelled) status = "Cancelled";
    else if (delayMinutes) status = "Delayed";
    else if (departure.expectedTime) status = "On time";
    else status = "Scheduled";
  }
  return {
    ...departure,
    operator: resolveBusOperator(departure),
    delayMinutes,
    cancelled,
    delayed: !cancelled && isBusDelayed({ ...departure, delayMinutes }),
    status,
  };
}

export function pickNextDeparture(
  departures: KthBusDeparture[],
  ref = new Date(),
): KthBusDeparture | null {
  const now = ref.getTime();
  const upcoming = departures
    .filter((d) => !d.cancelled)
    .map((d) => ({
      departure: d,
      instant: parseBusInstant(d.expectedTime ?? d.scheduledTime, ref),
    }))
    .filter((row) => row.instant && row.instant.getTime() >= now - 2 * 60_000)
    .sort((a, b) => (a.instant!.getTime() > b.instant!.getTime() ? 1 : -1));
  return upcoming[0]?.departure ?? departures.find((d) => !d.cancelled) ?? null;
}

export function matchesDestination(
  departure: KthBusDeparture,
  patterns: RegExp[],
): boolean {
  const hay = departure.destination.toLowerCase();
  return patterns.some((p) => p.test(hay));
}
