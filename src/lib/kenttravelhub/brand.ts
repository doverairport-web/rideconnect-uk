import { BRAND_LEGAL } from "@/lib/brand";

export const KTH_NAME = "Kent Travel Hub";
export const KTH_TAGLINE = "Dover Port & Cruise Updates";
export const KTH_HERO_EYEBROW = "Daily Dover travel check";
export const KTH_HERO_HEADLINE = "Check Dover Before You Travel";
export const KTH_HERO_SUBHEADLINE =
  "Bookmark this page. Before every ferry, cruise pickup or drive to the port — check ships, delays, queues, M20, weather and pickup advice here first.";
export const KTH_HERO_IMAGE = "/kenttravelhub/hero-dover.jpg";
export const KTH_HERO_IMAGE_ALT =
  "Cruise ship at Dover port with the White Cliffs of Dover in the background";

/** Default Open Graph / Twitter share image (1200×630 source). */
export const KTH_OG_IMAGE = KTH_HERO_IMAGE;
export const KTH_OG_IMAGE_ALT =
  "Kent Travel Hub — live Dover travel board for port, ferries and cruise";

/** Local explore tiles — served from /public, no remote CDN dependency. */
export const KTH_EXPLORE_IMAGES = {
  castle: "/kenttravelhub/explore/dover-castle.jpg",
  canterbury: "/kenttravelhub/explore/canterbury-cathedral.jpg",
  cliffs: "/kenttravelhub/explore/white-cliffs.jpg",
  deal: "/kenttravelhub/explore/deal-beach.jpg",
} as const;
export const KTH_SITE_URL =
  process.env.NEXT_PUBLIC_KTH_URL?.trim() || "https://kenttravelhub.co.uk";

export const KTH_POWERED_BY = BRAND_LEGAL;

export const KTH_SEO_LINE =
  "Live Dover cruise ships, ferry delays, port queues, M20, Operation Brock and weather — check Kent Travel Hub before you travel.";

export const KTH_EMAIL =
  process.env.NEXT_PUBLIC_EMAIL?.trim() || "info@rideconnectuk.com";

/** Kent Travel Hub WhatsApp Channel — live Dover travel updates. */
export const KTH_WHATSAPP_CHANNEL_URL =
  "https://whatsapp.com/channel/0029Vb8EyXVATRSvvzZhVm3L";

export const KTH_WHATSAPP_CHANNEL_LABEL = "Follow us on WhatsApp";

export const KTH_WHATSAPP_CHANNEL_DESCRIPTION =
  "Follow Kent Travel Hub on WhatsApp:";
