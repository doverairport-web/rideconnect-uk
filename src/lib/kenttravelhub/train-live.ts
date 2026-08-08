export type KthStationId =
  | "dover-priory"
  | "folkestone-central"
  | "ashford-international"
  | "canterbury-east"
  | "canterbury-west";

export type KthTrainDirection = "arrival" | "departure";

export type KthTrainService = {
  id: string;
  direction: KthTrainDirection;
  operator: string;
  /** Origin (arrivals) or destination (departures). */
  routeLabel: string;
  routeCrs?: string;
  scheduledTime: string;
  expectedTime?: string;
  status: string;
  platform?: string;
  delayed: boolean;
  cancelled: boolean;
  delayMinutes?: number;
};

export type KthTrainDisruption = {
  id: string;
  title: string;
  detail: string;
  severity: "ok" | "warn" | "alert";
  url?: string;
};

export type KthStationTransfer = {
  id: string;
  label: string;
  journeyMinutes: number;
  normalMinutes?: number;
  delayMinutes?: number;
  source: string;
  staticEstimate?: string;
};

export type KthTrainLiveBoard = {
  id: KthStationId;
  name: string;
  crs: string;
  officialBoardUrl: string;
  arrivals: KthTrainService[];
  departures: KthTrainService[];
  source: string;
  updatedAt: string;
  liveAvailable: boolean;
};

export type KthTrainLiveDashboard = {
  updatedAt: string;
  nextDeparture: KthTrainService | null;
  londonDepartures: KthTrainService[];
  delayed: number;
  cancelled: number;
  disruptions: KthTrainDisruption[];
  transfers: KthStationTransfer[];
  stations: KthTrainLiveBoard[];
  mainStationId: KthStationId;
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

export const KTH_TRAIN_GUIDES: KthTrainLiveDashboard["guides"] = [
  {
    id: "cruise-terminal",
    label: "Dover Priory → Cruise Terminal 1 & 2",
    detail:
      "Pre-book a taxi for CT1 (Admiralty Pier) or CT2 (Western Docks) — ranks queue on turnaround Saturdays.",
    href: "/cruise-terminal",
  },
  {
    id: "ferry-terminal",
    label: "Dover Priory → Ferry Terminal",
    detail:
      "Eastern Docks foot passengers — allow time for check-in after your train arrives.",
    href: "/ferries",
  },
  {
    id: "dover-castle",
    label: "Dover Priory → Dover Castle",
    detail: "Short taxi uphill from the station — ideal between train and ship.",
    href: "/visit",
  },
  {
    id: "st-pancras",
    label: "London St Pancras → Dover Priory",
    detail:
      "Southeastern high-speed from St Pancras takes about 1 hour — Elizabeth line connections from Heathrow.",
    href: "/news/dover-to-london",
  },
  {
    id: "victoria",
    label: "London Victoria → Dover Priory",
    detail:
      "Change at Ashford or take slower mainline services — taxi at Dover Priory for port transfers.",
    href: "/news/dover-to-london",
  },
  {
    id: "southeastern",
    label: "Southeastern disruption alerts",
    detail: "Official operator updates for Kent routes including Dover Priory.",
    href: "https://www.southeasternrailway.co.uk/travel-information/service-updates",
    external: true,
  },
];

export const KTH_TRAIN_LIVE_INTRO =
  "Live departures and arrivals for Dover Priory and Kent stations — Southeastern delays, London connections and taxi times to the cruise terminals, ferry port and Dover Castle. Buy train tickets online in advance for the best fares on Dover Priory and London services.";

/** Official Southeastern ticket shop — advance fares vs day-of-travel. */
export const KTH_SOUTHEASTERN_TICKETS_URL = "https://ticket.southeasternrailway.co.uk/";
export const KTH_SOUTHEASTERN_HOME_URL = "https://www.southeasternrailway.co.uk/";
export const KTH_NATIONAL_RAIL_TICKETS_URL = "https://www.nationalrail.co.uk/tickets/";

export const KTH_TRAIN_OFFICIAL_LINKS: KthTrainLiveDashboard["officialLinks"] = [
  {
    id: "southeastern-tickets",
    label: "Buy Southeastern tickets (advance fares)",
    href: KTH_SOUTHEASTERN_TICKETS_URL,
  },
  {
    id: "national-rail-tickets",
    label: "National Rail tickets",
    href: KTH_NATIONAL_RAIL_TICKETS_URL,
  },
  {
    id: "southeastern-updates",
    label: "Southeastern service updates",
    href: "https://www.southeasternrailway.co.uk/travel-information/service-updates",
  },
  {
    id: "national-rail-dvr",
    label: "Dover Priory live board (National Rail)",
    href: "https://www.nationalrail.co.uk/live-trains/departures/dvr/",
  },
];

export const DOVER_PRIORY = { lat: 51.1263, lng: 1.3053 };

export const KTH_STATIONS: Record<
  KthStationId,
  {
    name: string;
    shortName: string;
    crs: string;
    lat: number;
    lng: number;
    officialBoardUrl: string;
    isMain?: boolean;
  }
> = {
  "dover-priory": {
    name: "Dover Priory",
    shortName: "Dover Priory",
    crs: "DVP",
    lat: DOVER_PRIORY.lat,
    lng: DOVER_PRIORY.lng,
    officialBoardUrl:
      "https://www.nationalrail.co.uk/live-trains/departures/dvp/",
    isMain: true,
  },
  "folkestone-central": {
    name: "Folkestone Central",
    shortName: "Folkestone",
    crs: "FKC",
    lat: 51.0825,
    lng: 1.1694,
    officialBoardUrl:
      "https://www.nationalrail.co.uk/live-trains/departures/fkc/",
  },
  "ashford-international": {
    name: "Ashford International",
    shortName: "Ashford",
    crs: "AFK",
    lat: 51.1435,
    lng: 0.8762,
    officialBoardUrl:
      "https://www.nationalrail.co.uk/live-trains/departures/afk/",
  },
  "canterbury-east": {
    name: "Canterbury East",
    shortName: "Canterbury East",
    crs: "CBE",
    lat: 51.2753,
    lng: 1.0759,
    officialBoardUrl:
      "https://www.nationalrail.co.uk/live-trains/departures/cbe/",
  },
  "canterbury-west": {
    name: "Canterbury West",
    shortName: "Canterbury West",
    crs: "CBW",
    lat: 51.2843,
    lng: 1.0753,
    officialBoardUrl:
      "https://www.nationalrail.co.uk/live-trains/departures/cbw/",
  },
};

export const KTH_STATION_ORDER: KthStationId[] = [
  "dover-priory",
  "folkestone-central",
  "ashford-international",
  "canterbury-east",
  "canterbury-west",
];

export const LONDON_STATION_CRS = new Set([
  "STP",
  "VIC",
  "CHX",
  "LBG",
  "CST",
  "WAE",
  "ZFD",
  "PAD",
  "MYB",
  "EUS",
  "KGX",
  "WAT",
  "CLJ",
  "BFR",
]);

const DELAY_THRESHOLD_MINUTES = 10;

export function formatTrainTime(value: string): string {
  if (!value) return "—";
  if (/^\d{1,2}:\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  });
}

export function parseTrainInstant(value: string, ref = new Date()): Date | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
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
  const d = new Date(trimmed);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function delayMinutesBetween(
  scheduled: string,
  estimated?: string,
): number | undefined {
  const s = parseTrainInstant(scheduled);
  const e = estimated ? parseTrainInstant(estimated) : null;
  if (!s || !e) return undefined;
  const diff = Math.round((e.getTime() - s.getTime()) / 60_000);
  return diff >= DELAY_THRESHOLD_MINUTES ? diff : undefined;
}

export function formatTrainStatus(status: string, expectedTime?: string): string {
  const trimmed = status.trim();
  if (!trimmed && expectedTime) {
    if (/^on time$/i.test(expectedTime)) return "On time";
    if (/^\d{1,2}:\d{2}$/.test(expectedTime)) return "Expected";
    return expectedTime;
  }
  if (/^on time$/i.test(trimmed)) return "On time";
  if (/^delayed$/i.test(trimmed)) return "Delayed";
  if (/^cancelled$/i.test(trimmed)) return "Cancelled";
  return trimmed || "Scheduled";
}

export function isTrainCancelled(service: {
  status: string;
  expectedTime?: string;
}): boolean {
  const hay = `${service.status} ${service.expectedTime ?? ""}`;
  return /\bcancel/i.test(hay);
}

export function isTrainDelayed(service: {
  scheduledTime: string;
  expectedTime?: string;
  status: string;
  delayMinutes?: number;
}): boolean {
  if (isTrainCancelled(service)) return false;
  const fromTimes = delayMinutesBetween(service.scheduledTime, service.expectedTime);
  if (fromTimes !== undefined) return true;
  if ((service.delayMinutes ?? 0) >= DELAY_THRESHOLD_MINUTES) return true;
  const status = service.status.trim();
  if (/^on time$/i.test(status)) return false;
  if (/^expected$/i.test(status)) return false;
  return /\bdelayed?\b|\blate\b|\brevised\b/i.test(status);
}

export function enrichTrainFlags(service: KthTrainService): KthTrainService {
  const expected =
    service.expectedTime && !/^on time$/i.test(service.expectedTime)
      ? service.expectedTime
      : undefined;
  const delayMinutes =
    service.delayMinutes ?? delayMinutesBetween(service.scheduledTime, expected);
  const cancelled = isTrainCancelled(service);
  return {
    ...service,
    expectedTime: expected ?? service.expectedTime,
    delayMinutes,
    cancelled,
    delayed: !cancelled && isTrainDelayed({ ...service, delayMinutes }),
  };
}

export function isLondonDestination(service: KthTrainService): boolean {
  if (service.direction !== "departure") return false;
  if (service.routeCrs && LONDON_STATION_CRS.has(service.routeCrs.toUpperCase())) {
    return true;
  }
  return /\blondon\b/i.test(service.routeLabel);
}

export function pickNextDeparture(
  departures: KthTrainService[],
  ref = new Date(),
): KthTrainService | null {
  const now = ref.getTime();
  const upcoming = departures
    .filter((d) => !d.cancelled)
    .map((d) => ({
      service: d,
      instant: parseTrainInstant(d.expectedTime ?? d.scheduledTime, ref),
    }))
    .filter((row) => row.instant && row.instant.getTime() >= now - 2 * 60_000)
    .sort((a, b) => (a.instant!.getTime() > b.instant!.getTime() ? 1 : -1));
  return upcoming[0]?.service ?? departures.find((d) => !d.cancelled) ?? null;
}

export function nationalRailBoardUrl(crs: string, mode: "dep" | "arr" = "dep"): string {
  const code = crs.toLowerCase();
  return mode === "dep"
    ? `https://www.nationalrail.co.uk/live-trains/departures/${code}/`
    : `https://www.nationalrail.co.uk/live-trains/arrivals/${code}/`;
}
