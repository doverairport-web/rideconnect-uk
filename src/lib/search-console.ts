import { isDoverTaxiHost, isDoverToGatwickHost, isOrionTaxisHost, isRideConnectUkHost } from "@/lib/rideconnect/host";
import { isHomeKentHost } from "@/lib/homekent/host";
import { isKentTravelHubHost } from "@/lib/kenttravelhub/host";

/**
 * Per-site Google Search Console HTML-tag verification.
 * Prefer the site-specific env; fall back to legacy shared vars only where noted.
 */
export function googleSiteVerificationRideConnect(): string | undefined {
  return (
    process.env.RIDECONNECT_GOOGLE_SITE_VERIFICATION?.trim() ||
    process.env.GOOGLE_SITE_VERIFICATION_RIDECONNECT?.trim() ||
    undefined
  );
}

export function googleSiteVerificationDoverTaxi(): string | undefined {
  return (
    process.env.DOVERTAXI_GOOGLE_SITE_VERIFICATION?.trim() ||
    // Legacy shared key historically used for Dover Taxi (and sometimes the whole taxi network).
    process.env.GOOGLE_SITE_VERIFICATION?.trim() ||
    undefined
  );
}

export function googleSiteVerificationOrion(): string | undefined {
  return (
    process.env.ORION_GOOGLE_SITE_VERIFICATION?.trim() ||
    process.env.GOOGLE_SITE_VERIFICATION_ORION?.trim() ||
    undefined
  );
}

export function googleSiteVerificationGatwick(): string | undefined {
  return (
    process.env.GATWICK_GOOGLE_SITE_VERIFICATION?.trim() ||
    process.env.DOVERTOGATWICK_GOOGLE_SITE_VERIFICATION?.trim() ||
    process.env.GOOGLE_SITE_VERIFICATION_GATWICK?.trim() ||
    undefined
  );
}

export function googleSiteVerificationHomeKent(): string | undefined {
  return process.env.HOMEKENT_GOOGLE_SITE_VERIFICATION?.trim() || undefined;
}

export function googleSiteVerificationKentTravelHub(): string | undefined {
  return process.env.KTH_GOOGLE_SITE_VERIFICATION?.trim() || undefined;
}

/** @deprecated Prefer googleSiteVerificationDoverTaxi — shared key must not cover all brands. */
export function googleSiteVerificationDover(): string | undefined {
  return googleSiteVerificationDoverTaxi();
}

/** Meta tag content for google-site-verification on the current host. */
export function googleSiteVerificationForHost(host: string | null): string | undefined {
  if (isHomeKentHost(host)) return googleSiteVerificationHomeKent();
  if (isKentTravelHubHost(host)) return googleSiteVerificationKentTravelHub();
  if (isRideConnectUkHost(host)) return googleSiteVerificationRideConnect();
  if (isOrionTaxisHost(host)) return googleSiteVerificationOrion();
  if (isDoverToGatwickHost(host)) return googleSiteVerificationGatwick();
  if (isDoverTaxiHost(host)) return googleSiteVerificationDoverTaxi();
  // Unknown host: do not leak a shared verification token.
  return undefined;
}

/** @deprecated Use googleSiteVerificationForHost or the host-specific helpers. */
export function googleSiteVerification(): string | undefined {
  return googleSiteVerificationDoverTaxi();
}
