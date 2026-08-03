import { fetchText } from "@/lib/kenttravelhub/fetchers/http";

const DFDS_TIMETABLE_URL =
  "https://www.dfds.com/en/passenger-ferries/passenger-information/timetables";

export type DfdsSailing = {
  operator: "DFDS";
  route: "Calais" | "Dunkirk";
  departure: string;
  arrives: string;
};

function formatTodayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "|")
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\|+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRouteSection(
  sectionHtml: string,
  route: "Calais" | "Dunkirk",
  todayLabel: string,
): DfdsSailing[] {
  const text = stripTags(sectionHtml);
  if (!text.includes(todayLabel)) return [];

  const sailings: DfdsSailing[] = [];
  const blocks = text.split(todayLabel).slice(1);

  for (const block of blocks) {
    const times = [...block.matchAll(/(\d{2}:\d{2})/g)].map((m) => m[1]);
    if (times.length < 3) continue;

    const departure = times[1];
    const arrives = times[2];
    if (!departure || !arrives) continue;

    sailings.push({
      operator: "DFDS",
      route,
      departure,
      arrives,
    });
  }

  return sailings;
}

export async function fetchDfdsArrivalsAtDover(
  date = new Date(),
): Promise<{ sailings: DfdsSailing[]; source: string }> {
  const html = await fetchText(DFDS_TIMETABLE_URL, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!html) {
    return { sailings: [], source: "fallback" };
  }

  const todayLabel = formatTodayLabel(date);
  const sailings: DfdsSailing[] = [];

  for (const [title, route] of [
    ["Calais - Dover", "Calais"],
    ["Dunkirk - Dover", "Dunkirk"],
  ] as const) {
    const titleIndex = html.indexOf(title);
    if (titleIndex < 0) continue;

    const sectionEnd = html.indexOf("accordion__header", titleIndex + title.length);
    const sectionHtml = html.slice(
      titleIndex,
      sectionEnd > titleIndex ? sectionEnd : titleIndex + 12_000,
    );
    sailings.push(...parseRouteSection(sectionHtml, route, todayLabel));
  }

  return {
    sailings,
    source: sailings.length > 0 ? "dfds.com" : "dfds.com/fallback",
  };
}
