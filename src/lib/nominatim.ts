/** Dover town centre — bias address search for local taxi work. */
export const DOVER_CENTER = { lat: 51.1279, lng: 1.3134 };

/** Viewbox around Dover / Deal / Folkestone (lon/lat). */
const DOVER_VIEWBOX = "1.20,51.20,1.45,51.00";

const LONG_DISTANCE_PATTERN =
  /\b(gatwick|heathrow|stansted|luton|city airport|airport|ferry port|eurotunnel|channel tunnel)\b/i;
const NON_DOVER_CITY_PATTERN =
  /\b(london|manchester|birmingham|bristol|southampton|cambridge|oxford|brighton|canterbury|ashford|folkestone)\b/i;

export type NominatimHit = {
  display_name: string;
  lat: string;
  lon: string;
};

export type AddressSuggestion = {
  label: string;
  value: string;
  lat?: number;
  lng?: number;
  placeId?: string;
};

/** Build a Nominatim free-text query with local bias when appropriate. */
export function nominatimSearchQuery(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return trimmed;
  if (/\bCT\d{1,2}\s?\d[A-Z]{2}\b/i.test(trimmed)) return trimmed;
  if (/\bUnited Kingdom\b/i.test(trimmed)) return trimmed;

  if (LONG_DISTANCE_PATTERN.test(trimmed) || NON_DOVER_CITY_PATTERN.test(trimmed)) {
    return /\bUK\b/i.test(trimmed) ? trimmed : `${trimmed}, UK`;
  }

  if (/\bKent\b/i.test(trimmed) && /\bDover\b/i.test(trimmed)) {
    if (!/\bCT16\b/i.test(trimmed)) return `${trimmed}, CT16`;
    return trimmed;
  }
  if (/\bdover\b/i.test(trimmed)) {
    if (/\b(ferry|port|docks|jubilee)\b/i.test(trimmed)) {
      return `${trimmed}, Dover, Kent, UK`;
    }
    return `${trimmed}, Dover, Kent, CT16`;
  }

  if (trimmed.length >= 48) return trimmed;
  return `${trimmed}, Dover, Kent, UK`;
}

function extractPostcode(displayName: string): string | null {
  const match = displayName.match(/\b(CT\d{1,2}\s?\d[A-Z]{2})\b/i);
  return match ? match[1].replace(/\s+/g, " ").toUpperCase() : null;
}

export function postcodeFromQuery(query: string): string | null {
  return extractPostcode(query);
}

function haversineMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 3958.8;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/** Prefer Dover CT16 over nearby villages when the user typed "dover". */
export function scoreAddressHit(query: string, hit: NominatimHit): number {
  const q = query.toLowerCase();
  const name = hit.display_name.toLowerCase();
  let score = 0;

  const postcode = extractPostcode(hit.display_name);
  if (postcode?.startsWith("CT16")) score += 120;
  else if (postcode?.startsWith("CT17")) score += 60;
  else if (postcode?.startsWith("CT14") || postcode?.startsWith("CT15")) score += 40;
  else if (postcode?.startsWith("CT18")) score -= 30;

  if (q.includes("dover") && !q.includes("capel") && !q.includes("deal") && !q.includes("folkestone")) {
    if (name.includes("capel-le-ferne")) score -= 100;
    if (name.includes("folkestone")) score -= 60;
    if (name.includes("middle deal") || name.includes(", deal,")) score -= 50;
    if (name.includes("tower hamlets")) score += 50;
    if (name.includes(", dover,") && !name.includes("capel")) score += 30;
  }

  const houseMatch = q.match(/\b(\d+[a-z]?)\b/i);
  if (houseMatch && name.includes(`${houseMatch[1].toLowerCase()},`)) score += 25;

  const lat = Number(hit.lat);
  const lng = Number(hit.lon);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    const miles = haversineMiles(DOVER_CENTER, { lat, lng });
    if (miles <= 3) score += 40;
    else if (miles <= 8) score += 20;
    else if (miles > 12) score -= 15;
  }

  return score;
}

/** Extra query shapes — e.g. "dover albert road" → "albert road, Dover, CT16". */
function searchQueryVariants(query: string): string[] {
  const trimmed = query.trim();
  const variants = new Set<string>([nominatimSearchQuery(trimmed)]);

  const words = trimmed.split(/\s+/).filter(Boolean);
  const lower = trimmed.toLowerCase();

  if (lower.includes("dover")) {
    const withoutDover = trimmed.replace(/\bdover\b/gi, "").replace(/\s+/g, " ").trim();
    if (withoutDover.length >= 2) {
      variants.add(nominatimSearchQuery(`${withoutDover}, Dover, CT16`));
      variants.add(nominatimSearchQuery(`${withoutDover}, Tower Hamlets, Dover, CT16`));
    }
  }

  if (words.length >= 2 && words[0].toLowerCase() === "dover") {
    const rest = words.slice(1).join(" ");
    variants.add(nominatimSearchQuery(`${rest}, Dover, CT16`));
  }

  if (words.length >= 2 && words[words.length - 1].toLowerCase() === "dover") {
    const head = words.slice(0, -1).join(" ");
    variants.add(nominatimSearchQuery(`${head}, Dover, CT16`));
  }

  return [...variants];
}

export function formatSuggestLabel(displayName: string): string {
  const parts = displayName.split(",").map((s) => s.trim());
  const postcode = extractPostcode(displayName);

  let head = parts.slice(0, 2).join(", ");
  if (/^CT\d+\s+\d+[a-z]?$/i.test(parts[0] ?? "") && parts[1]) {
    const num = parts[0].replace(/^CT\d+\s+/i, "");
    head = `${num} ${parts[1]}`;
  }

  return postcode ? `${head} · ${postcode}` : parts.slice(0, 3).join(", ");
}

function dedupeHits(hits: NominatimHit[]): NominatimHit[] {
  const seen = new Set<string>();
  const out: NominatimHit[] = [];
  for (const hit of hits) {
    const key = `${hit.lat},${hit.lon},${hit.display_name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(hit);
  }
  return out;
}

export async function searchNominatim(
  query: string,
  limit = 6,
  userAgent: string,
): Promise<NominatimHit[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const queries = searchQueryVariants(trimmed);
  if (/\bdover\b/i.test(trimmed)) {
    queries.push(`${trimmed}, Tower Hamlets, Dover, CT16`);
  }

  const uniqueQueries = [...new Set(queries)];
  const all: NominatimHit[] = [];

  for (const q of uniqueQueries) {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", q);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", String(Math.max(limit, 4)));
    url.searchParams.set("countrycodes", "gb");
    url.searchParams.set("viewbox", DOVER_VIEWBOX);
    url.searchParams.set("bounded", "0");
    url.searchParams.set("addressdetails", "0");

    const response = await fetch(url.toString(), {
      headers: { "User-Agent": userAgent, Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) continue;
    all.push(...((await response.json()) as NominatimHit[]));
  }

  return dedupeHits(all)
    .sort((a, b) => scoreAddressHit(trimmed, b) - scoreAddressHit(trimmed, a))
    .slice(0, limit);
}

export async function geocodeBestMatch(
  query: string,
  userAgent: string,
  coord?: { lat: number; lng: number } | null,
): Promise<{ lat: number; lon: number } | null> {
  if (coord) return { lat: coord.lat, lon: coord.lng };

  const trimmed = query.trim();
  if (!trimmed) return null;

  const attempts = new Set<string>([
    trimmed,
    ...searchQueryVariants(trimmed),
  ]);

  const postcode = postcodeFromQuery(trimmed);
  if (postcode) {
    attempts.add(`${postcode}, UK`);
    attempts.add(`${postcode}, Dover, Kent, UK`);
    if (/\bpriory\b/i.test(trimmed)) {
      attempts.add(`Dover Priory ${postcode}`);
      attempts.add(`Priory Station Approach Road, Dover ${postcode}`);
    }
  if (/\bferry\b/i.test(trimmed) || /\bport\b/i.test(trimmed)) {
      attempts.add(`Dover Eastern Docks Ferry Terminal, Dover, Kent, UK`);
      attempts.add(`Dover Ferry Port, Dover, Kent, UK`);
    }
  }

  for (const attempt of attempts) {
    const hits = await searchNominatim(attempt, 5, userAgent);
    const best = hits[0];
    if (!best) continue;
    const lat = Number(best.lat);
    const lon = Number(best.lon);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      return { lat, lon };
    }
  }

  return null;
}

export function hitsToSuggestions(hits: NominatimHit[]): AddressSuggestion[] {
  return hits.map((item) => ({
    label: formatSuggestLabel(item.display_name),
    value: item.display_name,
    lat: Number(item.lat),
    lng: Number(item.lon),
  }));
}
