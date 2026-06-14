const DEFAULT_PHONES = ["01304 350125", "01304 208208", "01304 350777"];
const DEFAULT_EMAIL = "info@rideconnectuk.com";
const DEFAULT_WHATSAPP = "07405 327650";

function parsePhoneList(raw: string | undefined): string[] {
  if (!raw?.trim()) return DEFAULT_PHONES;
  return raw
    .split(/[,|]/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(formatUkPhone);
}

/** UK display format: 01304 350124 */
export function formatUkPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("44") && digits.length >= 12) {
    const local = `0${digits.slice(2)}`;
    if (local.length === 11) {
      return `${local.slice(0, 5)} ${local.slice(5)}`;
    }
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 10 && digits.startsWith("7")) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return raw.trim();
}

export function telHref(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("44")) return `+${digits}`;
  if (digits.startsWith("0")) return `+44${digits.slice(1)}`;
  if (digits.startsWith("7")) return `+44${digits}`;
  return `+${digits}`;
}

export const phones = parsePhoneList(process.env.NEXT_PUBLIC_PHONES);
export const primaryPhone = phones[0] ?? DEFAULT_PHONES[0];

export const email =
  process.env.NEXT_PUBLIC_EMAIL?.trim() || DEFAULT_EMAIL;

export const whatsappDisplay = formatUkPhone(
  process.env.NEXT_PUBLIC_WHATSAPP?.trim() || DEFAULT_WHATSAPP,
);

export function whatsappHref(message?: string): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP?.trim() || DEFAULT_WHATSAPP;
  const digits = raw.replace(/\D/g, "");
  const intl = digits.startsWith("44")
    ? digits
    : digits.startsWith("0")
      ? `44${digits.slice(1)}`
      : `44${digits}`;
  const base = `https://wa.me/${intl}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
