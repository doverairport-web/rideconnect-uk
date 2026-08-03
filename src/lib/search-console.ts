import { isHomeKentHost } from "@/lib/homekent/host";
import { isKentTravelHubHost } from "@/lib/kenttravelhub/host";

export function googleSiteVerificationDover(): string | undefined {
  const code = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  return code || undefined;
}

export function googleSiteVerificationHomeKent(): string | undefined {
  const code = process.env.HOMEKENT_GOOGLE_SITE_VERIFICATION?.trim();
  return code || undefined;
}

export function googleSiteVerificationKentTravelHub(): string | undefined {
  const code = process.env.KTH_GOOGLE_SITE_VERIFICATION?.trim();
  return code || undefined;
}

/** Meta tag content for google-site-verification on the current host. */
export function googleSiteVerificationForHost(host: string | null): string | undefined {
  if (isHomeKentHost(host)) return googleSiteVerificationHomeKent();
  if (isKentTravelHubHost(host)) return googleSiteVerificationKentTravelHub();
  return googleSiteVerificationDover();
}

/** @deprecated Use googleSiteVerificationForHost or the host-specific helpers. */
export function googleSiteVerification(): string | undefined {
  return googleSiteVerificationDover();
}
