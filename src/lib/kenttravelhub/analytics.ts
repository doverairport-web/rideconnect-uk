import {
  gaMeasurementIdDover,
  gaMeasurementIdKentTravelHub,
} from "@/lib/analytics";

function normalizeClarityId(raw: string | undefined): string | undefined {
  const id = raw?.trim();
  if (!id || !/^[a-z0-9]+$/i.test(id)) return undefined;
  return id;
}

/** GA4 measurement ID for Kent Travel Hub (falls back to main site ID). */
export function kthGaMeasurementId(): string | undefined {
  return gaMeasurementIdKentTravelHub() ?? gaMeasurementIdDover();
}

/** Microsoft Clarity project ID from clarity.microsoft.com */
export function kthClarityProjectId(): string | undefined {
  return normalizeClarityId(process.env.NEXT_PUBLIC_KTH_CLARITY_PROJECT_ID);
}

export function hasKthGoogleAnalytics(): boolean {
  return Boolean(kthGaMeasurementId());
}

export function hasKthClarity(): boolean {
  return Boolean(kthClarityProjectId());
}

export function hasKthAnalytics(): boolean {
  return hasKthGoogleAnalytics() || hasKthClarity();
}

export type KthTrackedSection = "cruise" | "ferries" | "airports";

export const KTH_TRACKED_SECTIONS: Record<KthTrackedSection, string> = {
  cruise: "/cruise",
  ferries: "/ferries",
  airports: "/airports",
};

export function kthSectionFromPathname(pathname: string): KthTrackedSection | null {
  const normalized = pathname.replace(/\/$/, "") || "/";
  for (const [section, segment] of Object.entries(KTH_TRACKED_SECTIONS) as [
    KthTrackedSection,
    string,
  ][]) {
    if (normalized === segment || normalized.endsWith(segment)) {
      return section;
    }
  }
  return null;
}
