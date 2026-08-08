import { fetchJson } from "@/lib/kenttravelhub/fetchers/http";

type WpPost = {
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
};

const TRAVEL_KEYWORDS = [
  "getaway",
  "travel readiness",
  "travel",
  "queue",
  "waiting",
  "delay",
  "smooth",
  "sailing",
  "ferry",
  "half term",
  "easter",
  "summer",
  "peak",
  "border",
  "traffic",
  "m20",
  "brock",
  "congest",
];

const EXCLUDE_KEYWORDS = [
  "channel 4",
  "retirement",
  "certification",
  "marina manager",
  "school trip",
  "crane",
  "media",
  "award",
];

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&#[0-9]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isRecent(isoDate: string, maxDays = 45): boolean {
  const posted = new Date(isoDate);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - maxDays);
  return posted >= cutoff;
}

function travelScore(post: WpPost): number {
  const text = `${post.title.rendered} ${post.excerpt.rendered}`.toLowerCase();
  if (EXCLUDE_KEYWORDS.some((word) => text.includes(word))) return -1;

  let score = 0;
  for (const word of TRAVEL_KEYWORDS) {
    if (text.includes(word)) score += word.includes(" ") ? 3 : 1;
  }
  return score;
}

export type PortNewsResult = {
  headline: string | null;
  detail: string | null;
  link: string | null;
  source: string;
};

export async function fetchPortNews(): Promise<PortNewsResult> {
  const posts = await fetchJson<WpPost[]>(
    "https://www.portofdover.com/wp-json/wp/v2/posts?per_page=12",
  );

  if (!posts?.length) {
    return { headline: null, detail: null, link: null, source: "fallback" };
  }

  const ranked = posts
    .filter((post) => isRecent(post.date))
    .map((post) => ({ post, score: travelScore(post) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const match = ranked[0]?.post;
  if (!match) {
    return { headline: null, detail: null, link: null, source: "portofdover.com" };
  }

  const headline = stripHtml(match.title.rendered);
  const detail = stripHtml(match.excerpt.rendered).slice(0, 220);

  return {
    headline,
    detail: detail || null,
    link: match.link,
    source: "portofdover.com",
  };
}
