export const HOMEKENT_NAME = "HomeKent";
export const HOMEKENT_TAGLINE = "Cleaning Services in Dover & Kent";
export const HOMEKENT_SITE_URL =
  process.env.NEXT_PUBLIC_HOMEKENT_URL?.trim() || "https://homekent.co.uk";

export const HOMEKENT_PHONE =
  process.env.NEXT_PUBLIC_HOMEKENT_PHONE?.trim() || "01304 350521";

export const HOMEKENT_EMAIL =
  process.env.NEXT_PUBLIC_HOMEKENT_EMAIL?.trim() || "info@homekent.co.uk";

export const HOMEKENT_AREAS =
  "Dover, Deal, St Margaret's Bay, Kingsdown, Sandwich and surrounding areas";

/** Homepage & meta copy — local SEO (keep 120–160 chars for SERP). */
export const HOMEKENT_SEO_LINE =
  "Professional cleaning in Dover, Deal, Sandwich and East Kent. Regular cleans, deep cleans, holiday lets and Airbnb changeovers.";

export const HOMEKENT_SEO_TITLE = `${HOMEKENT_NAME} | ${HOMEKENT_TAGLINE}`;

export const HOMEKENT_KEYWORDS = [
  "cleaning services Dover",
  "cleaner Dover Kent",
  "end of tenancy cleaning Dover",
  "Airbnb cleaning Deal",
  "holiday home cleaning Kent",
  "deep cleaning Dover",
  "HomeKent",
] as const;

export const HOMEKENT_ADDRESS = "Kent, United Kingdom";

export function homekentTelHref(phone: string = HOMEKENT_PHONE): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("44")) return `+${digits}`;
  if (digits.startsWith("0")) return `+44${digits.slice(1)}`;
  if (digits.startsWith("7")) return `+44${digits}`;
  return `+${digits}`;
}
