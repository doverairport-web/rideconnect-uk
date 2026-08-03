import type { LiveSeverity, LiveStatus } from "@/lib/kenttravelhub/content";
import { fetchJson } from "@/lib/kenttravelhub/fetchers/http";
import {
  buildM20Detail,
  fetchM20JourneyLive,
} from "@/lib/kenttravelhub/fetchers/m20-journey";

/** Active MIDAS sites on M20 between Maidstone and Folkestone. */
const M20_SITE_IDS = [45, 68, 317, 1187, 1387];

const SLOW_BANDS = ["0 - 10 mph", "11 - 15 mph", "16 - 20 mph"];

type WebTrisRow = Record<string, string> & {
  "Site Name": string;
  "Report Date": string;
  "Time Period Ending": string;
};

type WebTrisDailyResponse = {
  Rows?: WebTrisRow[];
};

function formatWebTrisDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}${month}${year}`;
}

function parseHour(timePeriodEnding: string): number | null {
  const match = timePeriodEnding.match(/(\d{2}):/);
  return match ? Number(match[1]) : null;
}

function bandValue(row: WebTrisRow, band: string): number {
  const raw = row[band];
  if (!raw) return 0;
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
}

function congestionFromRows(rows: WebTrisRow[]): {
  slowPct: number;
  peakHour: number;
} {
  const byHour = new Map<number, { slow: number; total: number }>();

  for (const row of rows) {
    const hour = parseHour(row["Time Period Ending"]);
    if (hour === null || hour < 6 || hour > 20) continue;

    let rowTotal = 0;
    let rowSlow = 0;

    for (const band of [
      ...SLOW_BANDS,
      "21 - 25 mph",
      "26 - 30 mph",
      "31 - 40 mph",
      "41 - 50 mph",
      "51 - 60 mph",
      "61 - 70 mph",
      "71 - 80 mph",
      "80+ mph",
    ]) {
      const count = bandValue(row, band);
      rowTotal += count;
      if (SLOW_BANDS.includes(band)) rowSlow += count;
    }

    const entry = byHour.get(hour) ?? { slow: 0, total: 0 };
    entry.slow += rowSlow;
    entry.total += rowTotal;
    byHour.set(hour, entry);
  }

  let daySlow = 0;
  let dayTotal = 0;
  let peakHour = 8;
  let peakSlowPct = 0;

  for (const [hour, { slow, total }] of byHour) {
    daySlow += slow;
    dayTotal += total;
    if (total > 0) {
      const pct = (slow / total) * 100;
      if (pct > peakSlowPct) {
        peakSlowPct = pct;
        peakHour = hour;
      }
    }
  }

  return {
    slowPct: dayTotal > 0 ? Math.round((daySlow / dayTotal) * 100) : 0,
    peakHour,
  };
}

function severityFromCongestion(pct: number): LiveSeverity {
  if (pct >= 35) return "alert";
  if (pct >= 18) return "warn";
  return "ok";
}

export type M20FeedResult = LiveStatus & {
  source: string;
  dataDate: string | null;
  journeyMinutes?: number;
  delayMinutes?: number;
};

async function fetchWebTrisFallback(date: Date): Promise<M20FeedResult | null> {
  for (let daysAgo = 0; daysAgo <= 60; daysAgo += 1) {
    const probe = new Date(date);
    probe.setDate(probe.getDate() - daysAgo);
    const label = formatWebTrisDate(probe);
    const url =
      `https://webtris.nationalhighways.co.uk/api/v1.0/reports/daily` +
      `?sites=${M20_SITE_IDS.join(",")}&start_date=${label}&end_date=${label}` +
      `&page=1&page_size=200`;

    const data = await fetchJson<WebTrisDailyResponse>(url);
    const rows = data?.Rows ?? [];
    if (!rows.length) continue;

    const { slowPct, peakHour } = congestionFromRows(rows);
    const severity = severityFromCongestion(slowPct);
    const displayDate = probe.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const detail =
      severity === "ok"
        ? `Recent monitoring (${displayDate}): flowing well on M20 J8–J13 — ${slowPct}% slow traffic at peak`
        : severity === "warn"
          ? `Recent monitoring (${displayDate}): slower periods on M20 — ${slowPct}% below 20 mph around ${peakHour}:00`
          : `Recent monitoring (${displayDate}): heavy congestion on M20 — ${slowPct}% below 20 mph; allow extra time`;

    return {
      label: "M20 Traffic",
      detail,
      severity,
      source: "nationalhighways.co.uk/webtris",
      dataDate: displayDate,
    };
  }

  return null;
}

export async function fetchM20Traffic(
  date = new Date(),
  liveIncidents: string[] = [],
): Promise<M20FeedResult> {
  const journey = await fetchM20JourneyLive(liveIncidents);

  if (journey) {
    const { detail, severity } = buildM20Detail(journey, liveIncidents);
    return {
      label: "M20 Traffic",
      detail,
      severity,
      source: journey.source,
      dataDate: null,
      journeyMinutes: journey.journeyMinutes,
      delayMinutes: journey.delayMinutes,
    };
  }

  if (liveIncidents.length > 0) {
    const summary = liveIncidents[0].slice(0, 160);
    return {
      label: "M20 Traffic",
      detail: `Live National Highways alert on Dover approach: ${summary}`,
      severity: "alert",
      source: "nationalhighways.co.uk/api",
      dataDate: null,
    };
  }

  const webtris = await fetchWebTrisFallback(date);
  if (webtris) return webtris;

  return {
    label: "M20 Traffic",
    detail:
      "M20 J11A→Dover — live journey feed temporarily unavailable; check National Highways before travel",
    severity: "warn",
    source: "fallback",
    dataDate: null,
  };
}
