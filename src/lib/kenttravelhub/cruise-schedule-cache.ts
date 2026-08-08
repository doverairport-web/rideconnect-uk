import type { CruiseScheduleEntry } from "@/lib/kenttravelhub/content";
import { list, put } from "@vercel/blob";

const BLOB_PATH = "kenttravelhub/cruise-schedule-cache.json";
const RETAIN_PAST_DAYS = 3;
const RETAIN_FUTURE_DAYS = 120;

export type CruiseScheduleCache = {
  updatedAt: string;
  entries: CruiseScheduleEntry[];
};

function entryKey(entry: CruiseScheduleEntry): string {
  return `${entry.date}|${entry.line}|${entry.name}`;
}

function entryDate(entry: CruiseScheduleEntry): Date {
  const [y, m, d] = entry.date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function pruneEntries(entries: CruiseScheduleEntry[], date = new Date()): CruiseScheduleEntry[] {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const min = new Date(today);
  min.setDate(min.getDate() - RETAIN_PAST_DAYS);
  const max = new Date(today);
  max.setDate(max.getDate() + RETAIN_FUTURE_DAYS);

  return entries.filter((entry) => {
    const d = entryDate(entry);
    return d >= min && d <= max;
  });
}

export function mergeCruiseScheduleEntries(
  existing: CruiseScheduleEntry[],
  incoming: CruiseScheduleEntry[],
  date = new Date(),
): CruiseScheduleEntry[] {
  const byKey = new Map<string, CruiseScheduleEntry>();

  for (const entry of existing) {
    byKey.set(entryKey(entry), entry);
  }

  for (const entry of incoming) {
    const key = entryKey(entry);
    const prev = byKey.get(key);
    if (!prev) {
      byKey.set(key, entry);
      continue;
    }

    byKey.set(key, {
      ...prev,
      ...entry,
      arrives: entry.arrives || prev.arrives,
      departs: entry.departs || prev.departs,
      terminal: entry.terminal || prev.terminal,
    });
  }

  return pruneEntries([...byKey.values()], date);
}

export function isCruiseScheduleCacheConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export async function loadCruiseScheduleCache(): Promise<CruiseScheduleEntry[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return [];

  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    const blob = blobs.find((b) => b.pathname === BLOB_PATH) ?? blobs[0];
    if (!blob?.url) return [];

    const res = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];

    const data = (await res.json()) as CruiseScheduleCache;
    return Array.isArray(data.entries) ? data.entries : [];
  } catch {
    return [];
  }
}

export async function saveCruiseScheduleCache(entries: CruiseScheduleEntry[]): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return;

  const payload: CruiseScheduleCache = {
    updatedAt: new Date().toISOString(),
    entries,
  };

  await put(BLOB_PATH, JSON.stringify(payload), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
