import { BRAND_LEGAL } from "@/lib/brand";

export const KTH_NAME = "Kent Travel Hub";
export const KTH_TAGLINE = "Check Dover before you travel";
export const KTH_HERO_EYEBROW = "Live Dover travel board";
export const KTH_HERO_HEADLINE = "Check Dover Before You Travel";
export const KTH_HERO_SUBHEADLINE =
  "Live port, ferry, cruise and road conditions — plus the guides people read before crossing to France or catching a ship.";
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
  "Check Dover before you travel — live port traffic, ferry delays, cruise arrivals, M20 and Operation Brock updates, plus Kent travel guides.";

export const KTH_EMAIL =
  process.env.NEXT_PUBLIC_EMAIL?.trim() || "info@rideconnectuk.com";
