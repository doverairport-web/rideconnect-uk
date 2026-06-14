import { fetchText } from "@/lib/kenttravelhub/fetchers/http";

const CALAIS_DOVER_URL = "https://www.directferries.com/calais_dover_ferry.htm";

export type OperatorSailing = {
  operator: string;
  route: "Calais";
  departure: string;
  arrives: string;
};

const DAY_CODES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function sailingToday(sailingDays: string, date: Date): boolean {
  const normalized = sailingDays.trim().toLowerCase();
  if (normalized.includes("everyday") || normalized.includes("every day")) {
    return true;
  }

  const today = DAY_CODES[date.getDay()];
  return sailingDays.includes(today);
}

function normalizeOperator(name: string): string {
  if (/dfds/i.test(name)) return "DFDS";
  if (/p&o|po ferries/i.test(name)) return "P&O";
  if (/irish/i.test(name)) return "Irish Ferries";
  return name.trim();
}

function parseTimetableRows(html: string, date: Date): OperatorSailing[] {
  const tableStart = html.indexOf('id="timetables"');
  if (tableStart < 0) return [];

  const tableHtml = html.slice(tableStart, tableStart + 80_000);
  const rows = [...tableHtml.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)];

  const sailings: OperatorSailing[] = [];

  for (const row of rows) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) =>
      m[1].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim(),
    );

    if (cells.length < 5) continue;

    const [operatorRaw, departure, arrives, , sailingDays] = cells;
    if (!operatorRaw || !departure || !arrives || !sailingDays) continue;
    if (!/^\d{2}:\d{2}$/.test(departure) || !/^\d{2}:\d{2}$/.test(arrives)) {
      continue;
    }
    if (!sailingToday(sailingDays, date)) continue;

    sailings.push({
      operator: normalizeOperator(operatorRaw),
      route: "Calais",
      departure,
      arrives,
    });
  }

  return sailings;
}

export async function fetchCalaisDoverOperatorTimetable(
  date = new Date(),
): Promise<{ sailings: OperatorSailing[]; source: string }> {
  const html = await fetchText(CALAIS_DOVER_URL, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-GB,en;q=0.9",
    },
    timeoutMs: 15_000,
  });

  if (!html) {
    return { sailings: [], source: "fallback" };
  }

  const sailings = parseTimetableRows(html, date);
  return {
    sailings,
    source: sailings.length > 0 ? "directferries.com" : "directferries.com/fallback",
  };
}
