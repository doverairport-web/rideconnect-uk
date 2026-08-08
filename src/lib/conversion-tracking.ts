/** Shared helpers for GA4 conversion click delegation. */

export function isBookLink(href: string): boolean {
  try {
    const url = new URL(href, "https://example.com");
    if (url.pathname === "/book" || url.pathname.endsWith("/book")) return true;
    if (url.hash === "#book") return true;
    return false;
  } catch {
    return href.includes("/book") || href === "#book" || href.endsWith("#book");
  }
}

export function isPhoneLink(href: string): boolean {
  return href.startsWith("tel:");
}

export function isWhatsAppLink(href: string): boolean {
  const lower = href.toLowerCase();
  return lower.includes("wa.me") || lower.includes("whatsapp.com") || lower.startsWith("whatsapp:");
}

export function parseBookLinkParams(href: string): {
  link_url: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_source?: string;
  link_text?: string;
} {
  try {
    const url = new URL(href, typeof window !== "undefined" ? window.location.origin : "https://example.com");
    return {
      link_url: href,
      utm_campaign: url.searchParams.get("utm_campaign") ?? undefined,
      utm_content: url.searchParams.get("utm_content") ?? undefined,
      utm_source: url.searchParams.get("utm_source") ?? undefined,
    };
  } catch {
    return { link_url: href };
  }
}

export function phoneFromTelHref(href: string): string | undefined {
  return href.replace(/^tel:/i, "") || undefined;
}
