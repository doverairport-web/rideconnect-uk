export const HOMEKENT_NAME = "HomeKent";
export const HOMEKENT_TAGLINE = "Professional Cleaning Services";
export const HOMEKENT_SITE_URL =
  process.env.NEXT_PUBLIC_HOMEKENT_URL?.trim() || "https://homekent.co.uk";

export const HOMEKENT_PHONE =
  process.env.NEXT_PUBLIC_HOMEKENT_PHONE?.trim() || "01304 350521";

export const HOMEKENT_EMAIL =
  process.env.NEXT_PUBLIC_HOMEKENT_EMAIL?.trim() || "info@homekent.co.uk";

export const HOMEKENT_AREAS =
  "Dover, Deal, St Margaret's Bay, Kingsdown, Sandwich and surrounding areas";

/** Homepage & meta copy — local SEO. */
export const HOMEKENT_SEO_LINE = `Professional cleaning services in ${HOMEKENT_AREAS}.`;

export const HOMEKENT_ADDRESS = "Kent, United Kingdom";

export function homekentTelHref(phone: string = HOMEKENT_PHONE): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("44")) return `+${digits}`;
  if (digits.startsWith("0")) return `+44${digits.slice(1)}`;
  if (digits.startsWith("7")) return `+44${digits}`;
  return `+${digits}`;
}
