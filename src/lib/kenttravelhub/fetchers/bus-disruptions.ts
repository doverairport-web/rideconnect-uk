import type { KthBusDisruption } from "@/lib/kenttravelhub/bus-live";
import { fetchText } from "@/lib/kenttravelhub/fetchers/http";

const STAGECOACH_SOUTH_EAST = "https://www.stagecoachbus.com/south-east";
const TRAVELINE_ALERTS = "https://www.travelinesoutheast.org.uk/";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function severityFromText(text: string): KthBusDisruption["severity"] {
  if (/\b(cancel|suspended|divert|road closed|do not travel)\b/i.test(text)) {
    return "alert";
  }
  if (/\b(delay|late|amended|replacement|disrupt)\b/i.test(text)) {
    return "warn";
  }
  return "ok";
}

function parseStagecoachHtml(html: string): KthBusDisruption[] {
  const items: KthBusDisruption[] = [];

  const alerts = html.matchAll(
    /<(?:h[23]|strong)[^>]*>([^<]{12,120})<\/[^>]+>[\s\S]{0,400}?<p[^>]*>([^<]{20,300})<\/p>/gi,
  );
  for (const match of alerts) {
    const title = match[1].trim();
    const detail = match[2].trim();
    if (!/bus|route|service|dover|kent|delay|cancel/i.test(`${title} ${detail}`)) {
      continue;
    }
    items.push({
      id: `sc-${slugify(title)}`,
      title,
      detail,
      severity: severityFromText(`${title} ${detail}`),
      url: STAGECOACH_SOUTH_EAST,
    });
    if (items.length >= 6) break;
  }

  return items;
}

export async function fetchStagecoachDisruptions(): Promise<KthBusDisruption[]> {
  const html = await fetchText(STAGECOACH_SOUTH_EAST, {
    headers: { Accept: "text/html" },
    next: { revalidate: 300 },
  });

  const parsed = html ? parseStagecoachHtml(html) : [];

  if (parsed.length) return parsed.slice(0, 6);

  return [
    {
      id: "stagecoach-fallback",
      title: "Stagecoach South East service updates",
      detail:
        "Check Stagecoach South East and Traveline for diversions on Dover routes 15, 63, 66 and 91 before cruise or ferry connections.",
      severity: "ok",
      url: STAGECOACH_SOUTH_EAST,
    },
    {
      id: "traveline-fallback",
      title: "Traveline South East",
      detail: "Journey planner and disruption notices across Kent bus networks.",
      severity: "ok",
      url: TRAVELINE_ALERTS,
    },
  ];
}
