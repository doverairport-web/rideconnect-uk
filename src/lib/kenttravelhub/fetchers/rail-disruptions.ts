import type { KthTrainDisruption } from "@/lib/kenttravelhub/train-live";
import { fetchText } from "@/lib/kenttravelhub/fetchers/http";

const SOUTHEASTERN_UPDATES =
  "https://www.southeasternrailway.co.uk/travel-information/service-updates";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function severityFromText(text: string): KthTrainDisruption["severity"] {
  if (/\b(cancel|suspended|do not travel|major disruption)\b/i.test(text)) {
    return "alert";
  }
  if (/\b(delay|late|divert|replacement bus|amended|part cancel)\b/i.test(text)) {
    return "warn";
  }
  return "ok";
}

function parseNrccMessages(messages: string[]): KthTrainDisruption[] {
  return messages.slice(0, 8).map((message, index) => {
    const title = message.split(/[.!]/)[0]?.trim() || "National Rail alert";
    return {
      id: `nrcc-${index}-${slugify(title)}`,
      title: title.slice(0, 120),
      detail: message,
      severity: severityFromText(message),
      url: "https://www.nationalrail.co.uk/service-disruptions/",
    };
  });
}

function parseSoutheasternHtml(html: string): KthTrainDisruption[] {
  const items: KthTrainDisruption[] = [];

  const articleMatches = html.matchAll(
    /<article[^>]*>[\s\S]*?<h[23][^>]*>([\s\S]*?)<\/h[23]>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi,
  );
  for (const match of articleMatches) {
    const title = match[1].replace(/<[^>]+>/g, "").trim();
    const detail = match[2].replace(/<[^>]+>/g, "").trim();
    if (!title || title.length < 8) continue;
    items.push({
      id: `se-${slugify(title)}`,
      title: title.slice(0, 120),
      detail: detail || title,
      severity: severityFromText(`${title} ${detail}`),
      url: SOUTHEASTERN_UPDATES,
    });
    if (items.length >= 6) break;
  }

  if (items.length) return items;

  const headingMatches = html.matchAll(
    /<h[23][^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h[23]>/gi,
  );
  for (const match of headingMatches) {
    const title = match[1].replace(/<[^>]+>/g, "").trim();
    if (!title || title.length < 12) continue;
    if (!/delay|disrupt|cancel|amend|suspended|alert|service/i.test(title)) continue;
    items.push({
      id: `se-${slugify(title)}`,
      title: title.slice(0, 120),
      detail: "See Southeastern service updates for full details.",
      severity: severityFromText(title),
      url: SOUTHEASTERN_UPDATES,
    });
    if (items.length >= 6) break;
  }

  return items;
}

export async function fetchSoutheasternDisruptions(
  nrccMessages: string[] = [],
): Promise<KthTrainDisruption[]> {
  const fromNrcc = parseNrccMessages(nrccMessages);
  if (fromNrcc.length >= 2) {
    return fromNrcc;
  }

  const html = await fetchText(SOUTHEASTERN_UPDATES, {
    headers: { Accept: "text/html" },
    next: { revalidate: 300 },
  });

  const fromSe = html ? parseSoutheasternHtml(html) : [];
  const combined = [...fromNrcc, ...fromSe];
  const seen = new Set<string>();
  const unique = combined.filter((item) => {
    const key = item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (unique.length) return unique.slice(0, 8);

  return [
    {
      id: "se-fallback",
      title: "Southeastern service updates",
      detail:
        "No live disruption feed is configured. Check Southeastern and National Rail before travelling to Dover Priory.",
      severity: "ok",
      url: SOUTHEASTERN_UPDATES,
    },
  ];
}
