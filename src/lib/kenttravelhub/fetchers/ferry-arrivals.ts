import { fetchCalaisDoverOperatorTimetable } from "@/lib/kenttravelhub/fetchers/direct-ferries-timetable";
import { fetchDfdsArrivalsAtDover } from "@/lib/kenttravelhub/fetchers/dfds-timetable";

export type FerryArrivalEntry = {
  operator: string;
  route: "Calais" | "Dunkirk";
  arrives: string;
  status: "in-port" | "arriving" | "scheduled";
};

export type FerryArrivalsFeed = {
  arrivals: FerryArrivalEntry[];
  source: string;
};

function parseMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function statusForOffset(offsetMinutes: number): FerryArrivalEntry["status"] {
  if (offsetMinutes >= -25 && offsetMinutes <= 15) return "in-port";
  if (offsetMinutes > 15 && offsetMinutes <= 45) return "arriving";
  return "scheduled";
}

type Candidate = FerryArrivalEntry & { offset: number };

function toCandidate(
  operator: string,
  route: "Calais" | "Dunkirk",
  arrives: string,
  nowMins: number,
): Candidate {
  let offset = parseMinutes(arrives) - nowMins;
  if (offset < -30) offset += 24 * 60;

  return {
    operator,
    route,
    arrives,
    offset,
    status: statusForOffset(offset),
  };
}

export async function fetchFerryArrivalsFromFrance(
  date = new Date(),
  limit = 3,
): Promise<FerryArrivalsFeed> {
  const nowMins = date.getHours() * 60 + date.getMinutes();

  const [dfdsFeed, operatorFeed] = await Promise.all([
    fetchDfdsArrivalsAtDover(date),
    fetchCalaisDoverOperatorTimetable(date),
  ]);

  const candidates: Candidate[] = [];
  const seen = new Set<string>();

  const add = (
    operator: string,
    route: "Calais" | "Dunkirk",
    arrives: string,
  ) => {
    const key = `${operator}-${route}-${arrives}`;
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push(toCandidate(operator, route, arrives, nowMins));
  };

  for (const sailing of dfdsFeed.sailings) {
    add(sailing.operator, sailing.route, sailing.arrives);
  }

  for (const sailing of operatorFeed.sailings) {
    if (sailing.operator === "Irish Ferries") continue;
    add(sailing.operator, sailing.route, sailing.arrives);
  }

  const sources = [dfdsFeed.source, operatorFeed.source].filter(
    (s) => s && !s.endsWith("/fallback"),
  );

  if (candidates.length === 0) {
    return {
      arrivals: [],
      source: sources[0] ?? "unavailable",
    };
  }

  const arrivals = candidates
    .filter((entry) => entry.offset >= -25 && entry.offset <= 8 * 60)
    .sort((a, b) => a.offset - b.offset)
    .slice(0, limit)
    .map(({ offset: _offset, ...entry }) => entry);

  return {
    arrivals,
    source: [...new Set(sources)].join(" + ") || "operator-timetables",
  };
}
