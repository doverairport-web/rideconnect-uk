import type { CruiseArrival, CruiseCalendar, CruiseScheduleEntry } from "@/lib/kenttravelhub/content";
import {
  loadCruiseScheduleCache,
  mergeCruiseScheduleEntries,
  saveCruiseScheduleCache,
} from "@/lib/kenttravelhub/cruise-schedule-cache";
import { fetchCruiseaDoverToday } from "@/lib/kenttravelhub/fetchers/cruisea-dover";
import { fetchText } from "@/lib/kenttravelhub/fetchers/http";

const SCHEDULE_URL =
  "https://www.portofdover.com/cruise/schedule-tickets/";

type ParsedRow = {
  date: string;
  line: string;
  vessel: string;
  terminal: string;
  arrives: string;
  departs: string;
};

function decodeHtml(text: string): string {
  return text
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function stripTags(html: string): string {
  return decodeHtml(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function parseScheduleDate(value: string): Date | null {
  const us = value.match(/^(\w+) (\d{1,2}), (\d{4})$/);
  if (us) {
    const parsed = new Date(`${us[1]} ${us[2]}, ${us[3]}`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const uk = value.match(/^(\d{1,2}) (\w+) (\d{4})$/);
  if (uk) {
    const parsed = new Date(`${uk[2]} ${uk[1]}, ${uk[3]}`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function parseScheduleRows(html: string): ParsedRow[] {
  const rows: ParsedRow[] = [];
  const trMatches = html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);

  for (const match of trMatches) {
    const tdMatches = [...match[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    if (tdMatches.length < 6) continue;

    const cells = tdMatches.map((td) => stripTags(td[1]));
    if (!parseScheduleDate(cells[0])) continue;

    rows.push({
      date: cells[0],
      line: cells[1],
      vessel: cells[2],
      terminal: cells[3],
      arrives: cells[4],
      departs: cells[5],
    });
  }

  return rows;
}

function formatTodayLabel(date = new Date()): string {
  return date.toLocaleDateString("en-GB", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTerminal(code: string): string {
  if (code.startsWith("CT")) {
    return `Dover Cruise Terminal ${code.replace("CT", "")}`;
  }
  if (code.startsWith("WD")) {
    return `Dover Western Docks ${code.replace("WD", "")}`;
  }
  return `Dover ${code}`;
}

function rowToEntry(row: ParsedRow): CruiseScheduleEntry | null {
  const parsed = parseScheduleDate(row.date);
  if (!parsed) return null;

  return {
    name: row.vessel,
    line: row.line,
    arrives: row.arrives,
    departs: row.departs,
    terminal: formatTerminal(row.terminal),
    date: toIsoDate(parsed),
    dateLabel: formatDateLabel(parsed),
  };
}

function sortByDateThenArrival(a: CruiseScheduleEntry, b: CruiseScheduleEntry): number {
  if (a.date !== b.date) return a.date.localeCompare(b.date);
  return a.arrives.localeCompare(b.arrives);
}

function buildCalendar(entries: CruiseScheduleEntry[], date = new Date()): CruiseCalendar {
  const today = startOfDay(date);
  const tomorrow = addDays(today, 1);
  const weekEnd = addDays(today, 7);

  const entryDate = (entry: CruiseScheduleEntry): Date => {
    const [y, m, d] = entry.date.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const inMonth = (entry: CruiseScheduleEntry): boolean => {
    const d = entryDate(entry);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  };

  return {
    today: entries
      .filter((entry) => isSameCalendarDay(entryDate(entry), today))
      .sort(sortByDateThenArrival),
    tomorrow: entries
      .filter((entry) => isSameCalendarDay(entryDate(entry), tomorrow))
      .sort(sortByDateThenArrival),
    thisWeek: entries
      .filter((entry) => {
        const d = entryDate(entry);
        return d >= addDays(today, 2) && d < weekEnd;
      })
      .sort(sortByDateThenArrival),
    thisMonth: entries.filter(inMonth).sort(sortByDateThenArrival),
    scheduleDate: formatTodayLabel(date),
  };
}

function emptyCalendar(date = new Date()): CruiseCalendar {
  return {
    today: [],
    tomorrow: [],
    thisWeek: [],
    thisMonth: [],
    scheduleDate: formatTodayLabel(date),
  };
}

export type CruiseFeedResult = {
  arrivals: CruiseArrival[];
  calendar: CruiseCalendar;
  source: string;
  scheduleDate: string;
};

export async function fetchCruiseArrivals(
  date = new Date(),
): Promise<CruiseFeedResult> {
  const todayLabel = formatTodayLabel(date);
  const cached = await loadCruiseScheduleCache();
  const html = await fetchText(SCHEDULE_URL);
  const parsed = html
    ? parseScheduleRows(html)
        .map(rowToEntry)
        .filter((entry): entry is CruiseScheduleEntry => entry !== null)
    : [];

  let merged = mergeCruiseScheduleEntries(cached, parsed, date);
  let source = html ? "portofdover.com" : "fallback";

  const calendar = buildCalendar(merged, date);
  if (!calendar.today.length) {
    const cruiseaToday = await fetchCruiseaDoverToday(date);
    if (cruiseaToday.length) {
      merged = mergeCruiseScheduleEntries(merged, cruiseaToday, date);
      source = html ? "portofdover.com+cruisea" : "cruisea";
    }
  }

  if (merged.length) {
    await saveCruiseScheduleCache(merged).catch(() => undefined);
  }

  const finalCalendar = buildCalendar(merged, date);

  if (!html && !merged.length) {
    const empty = emptyCalendar(date);
    return { arrivals: [], calendar: empty, source: "fallback", scheduleDate: todayLabel };
  }

  return {
    arrivals: finalCalendar.today.map((entry) => ({
      name: entry.name,
      time: entry.arrives,
      terminal: entry.terminal,
    })),
    calendar: finalCalendar,
    source,
    scheduleDate: todayLabel,
  };
}
