import { email } from "@/lib/contact";

/** Customer-facing brand name */
export const BRAND_NAME = "RideConnectUk";
export const BRAND_LEGAL = "RideConnect UK";
export const BRAND_TAGLINE = "Taxi & private hire — Dover, Kent";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dovertaxi.co.uk";

export function siteHost(): string {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return "dovertaxi.co.uk";
  }
}

export const DEFAULT_EMAIL = email;
