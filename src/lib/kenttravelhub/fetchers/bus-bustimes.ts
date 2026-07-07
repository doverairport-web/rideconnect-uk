import {
  bustimesStopUrl,
  enrichBusFlags,
  stagecoachJourneyUrl,
  type KthBusDeparture,
} from "@/lib/kenttravelhub/bus-live";
import { fetchText } from "@/lib/kenttravelhub/fetchers/http";

function decodeHtml(text: string): string {
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripCellHtml(html: string): string {
  return decodeHtml(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function parseDestination(raw: string): string {
  const line = raw.split(/\n/)[0]?.trim() || raw;
  return line.replace(/\s+\d{5,}\s*-\s*[A-Z0-9\s]+$/i, "").trim() || raw;
}

function parseDepartureRow(
  cells: string[],
  stopCode: string,
  index: number,
): KthBusDeparture | null {
  if (cells.length < 2 || !cells[0]) return null;

  const routeNumber = cells[0].trim();
  const destination = parseDestination(cells[1]);
  const scheduledTime = cells[2]?.trim() || "";
  const expectedTime = cells[3]?.trim() || undefined;

  if (!scheduledTime && !expectedTime) return null;

  const base: KthBusDeparture = {
    id: `${stopCode}-${routeNumber}-${scheduledTime}-${index}`,
    routeNumber,
    destination,
    scheduledTime: scheduledTime || expectedTime || "—",
    expectedTime:
      expectedTime && expectedTime !== scheduledTime ? expectedTime : undefined,
    status: expectedTime
      ? expectedTime === scheduledTime
        ? "On time"
        : "Expected"
      : "Scheduled",
    operator: "Stagecoach South East",
    delayed: false,
    cancelled: false,
  };

  return enrichBusFlags(base);
}

export function parseBustimesDeparturesHtml(
  html: string,
  stopCode: string,
): KthBusDeparture[] {
  const tbody = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)?.[1];
  if (!tbody) return [];

  const departures: KthBusDeparture[] = [];
  for (const row of tbody.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) =>
      stripCellHtml(m[1]),
    );
    const parsed = parseDepartureRow(cells, stopCode, departures.length);
    if (parsed) departures.push(parsed);
  }
  return departures;
}

export type BusStopDeparturesResult = {
  departures: KthBusDeparture[];
  source: string;
  liveAvailable: boolean;
  stopName?: string;
};

export async function fetchBustimesDepartures(
  atcoCode: string,
  rows = 12,
): Promise<BusStopDeparturesResult> {
  const url = bustimesStopUrl(atcoCode);
  const html = await fetchText(url, {
    headers: { Accept: "text/html" },
    next: { revalidate: 45 },
  });

  if (!html) {
    return {
      departures: [],
      source: "bustimes.org",
      liveAvailable: false,
    };
  }

  const stopName = html.match(/<title>([^<]+)/)?.[1]?.replace(" – Bus Times", "");
  const departures = parseBustimesDeparturesHtml(html, atcoCode).slice(0, rows);

  return {
    departures,
    source: "bustimes.org",
    liveAvailable: departures.length > 0,
    stopName,
  };
}

export function officialTimetableUrl(atcoCode: string, areaLabel: string): string {
  return bustimesStopUrl(atcoCode);
}

export function stagecoachStopJourneyUrl(areaLabel: string): string {
  return stagecoachJourneyUrl("Dover", areaLabel);
}
