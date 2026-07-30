import { email } from "@/lib/contact";

/** Customer-facing brand name */
export const BRAND_NAME = "RideConnect UK";
export const BRAND_LEGAL = "RideConnect UK";
export const BRAND_TAGLINE = "Taxi & private hire — Dover, Kent";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://dovertaxi.co.uk";

export function siteHost(): string {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return "dovertaxi.co.uk";
  }
}

/** Local calendar date (YYYY-MM-DD) — never use toISOString() for booking pickup dates. */
export function localDateIso(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export const DEFAULT_EMAIL = email;
