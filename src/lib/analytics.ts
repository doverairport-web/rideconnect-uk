import { isKentTravelHubHost } from "@/lib/kenttravelhub/host";

function normalizeGaId(raw: string | undefined): string | undefined {
  const id = raw?.trim();
  if (!id || !/^G-[A-Z0-9]+$/i.test(id)) return undefined;
  return id;
}

/** GA4 for dovertaxi.co.uk (RideConnect). */
export function gaMeasurementIdDover(): string | undefined {
  return normalizeGaId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
}

/** GA4 for kenttravelhub.co.uk — separate property recommended. */
export function gaMeasurementIdKentTravelHub(): string | undefined {
  return normalizeGaId(process.env.NEXT_PUBLIC_KTH_GA_MEASUREMENT_ID);
}

export function gaMeasurementIdForHost(host: string | null): string | undefined {
  if (isKentTravelHubHost(host)) {
    return gaMeasurementIdKentTravelHub() ?? gaMeasurementIdDover();
  }
  return gaMeasurementIdDover();
}

/** @deprecated Use gaMeasurementIdForHost or host-specific helpers. */
export function gaMeasurementId(): string | undefined {
  return gaMeasurementIdDover();
}

export function hasGoogleAnalytics(host?: string | null): boolean {
  return Boolean(gaMeasurementIdForHost(host ?? null));
}
