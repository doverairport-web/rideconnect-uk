import type { CruiseScheduleEntry } from "@/lib/kenttravelhub/content";

/** Optional secondary cruise source. Returns empty when unavailable. */
export async function fetchCruiseaDoverToday(
  _date: Date = new Date(),
): Promise<CruiseScheduleEntry[]> {
  return [];
}
