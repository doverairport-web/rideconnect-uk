import type { LiveStatus } from "@/lib/kenttravelhub/content";
import { fetchText } from "@/lib/kenttravelhub/fetchers/http";

type ClosureRecord = {
  roadName: string;
  comment: string;
  location: string;
};

function decodeXml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseDatexClosures(xml: string): ClosureRecord[] {
  const blocks = xml.match(/<situationRecord>[\s\S]*?<\/situationRecord>/gi) ?? [];
  const records: ClosureRecord[] = [];

  for (const block of blocks) {
    const comment = decodeXml(
      block.match(/<comment>([\s\S]*?)<\/comment>/i)?.[1] ?? "",
    );
    const roadNames = [
      ...block.matchAll(/<roadName>([\s\S]*?)<\/roadName>/gi),
    ].map((match) => decodeXml(match[1]));
    const locations = [
      ...block.matchAll(/<locationDescription>([\s\S]*?)<\/locationDescription>/gi),
    ].map((match) => decodeXml(match[1]));

    records.push({
      roadName: roadNames[0] ?? "",
      comment,
      location: locations[0] ?? "",
    });
  }

  return records;
}

function recordText(record: ClosureRecord): string {
  return `${record.roadName} ${record.comment} ${record.location}`.toLowerCase();
}

function isDoverApproach(record: ClosureRecord): boolean {
  const text = recordText(record);
  const road = record.roadName.toUpperCase();
  return (
    road.includes("M20") ||
    road.includes("A20") ||
    road.includes("A2") ||
    road.includes("M2") ||
    text.includes("dover") ||
    text.includes("folkestone") ||
    text.includes("channel tunnel")
  );
}

export type HighwaysFeedResult = {
  brock: LiveStatus & { active: boolean; source: string };
  incidents: string[];
};

async function fetchClosureRecords(
  apiKey: string,
  base: string,
  closureType: "unplanned" | "planned",
): Promise<ClosureRecord[]> {
  const url = `${base}/roads/v2.0/closures?closureType=${closureType}`;
  const xml = await fetchText(url, {
    headers: {
      "Ocp-Apim-Subscription-Key": apiKey,
      Accept: "application/xml, text/xml, */*",
    },
  });
  if (!xml) return [];
  return parseDatexClosures(xml);
}

export async function fetchHighwaysIncidents(): Promise<HighwaysFeedResult | null> {
  const apiKey = process.env.NATIONAL_HIGHWAYS_API_KEY?.trim();
  if (!apiKey) return null;

  const base =
    process.env.NATIONAL_HIGHWAYS_API_URL?.trim() ||
    "https://api.data.nationalhighways.co.uk";

  const records = [
    ...(await fetchClosureRecords(apiKey, base, "unplanned")),
    ...(await fetchClosureRecords(apiKey, base, "planned")),
  ];
  const text = records.map(recordText).join(" ");
  const m20Related =
    text.includes("m20") ||
    records.some((r) => r.roadName.toUpperCase().includes("M20"));
  const brock =
    text.includes("operation brock") ||
    (text.includes("contraflow") && m20Related);
  const active = brock && m20Related;

  const incidents = records
    .filter(isDoverApproach)
    .map((record) => record.comment || record.location || record.roadName)
    .filter(Boolean)
    .slice(0, 3);

  return {
    brock: {
      label: "Operation Brock",
      active,
      detail: active
        ? "Active on M20 — HGV routes and contraflow in place; follow signed diversions to Dover"
        : records.length === 0
          ? "No unplanned M20 closures reported — standard running on Dover approaches"
          : "Not reported active on M20 — standard running; check before peak ferry times",
      severity: active ? "alert" : "ok",
      source: "nationalhighways.co.uk/api",
    },
    incidents,
  };
}

export function estimateBrockStatus(): LiveStatus & {
  active: boolean;
  source: string;
} {
  return {
    label: "Operation Brock",
    active: false,
    detail:
      "No Brock alert reported — standby scheme for severe Channel disruption; check signs on M20/A20",
    severity: "ok",
    source: "estimated",
  };
}
