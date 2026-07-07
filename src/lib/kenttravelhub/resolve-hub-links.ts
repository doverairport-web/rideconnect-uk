import { kthBookingSearchUrl } from "@/lib/kenttravelhub/affiliates";
import {
  KTH_CATEGORY_CARD_LINKS,
  KTH_DOVER_HOTELS,
  KTH_DOVER_RESTAURANTS,
  KTH_INFO_HUB_SECTIONS,
  KTH_VISIT_QUICK_LINKS,
  type KthCategoryCardLink,
} from "@/lib/kenttravelhub/content";
import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import {
  KTH_SITE_SECTIONS,
  type KthSiteSectionId,
} from "@/lib/kenttravelhub/sections";

export type ResolvedHubLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
};

export type ResolvedDoverHotel = ResolvedHubLink & {
  subtitle: string;
  priceFrom: string;
};

export type ResolvedDoverRestaurant = ResolvedHubLink & {
  subtitle: string;
  type: string;
};

function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export type ResolvedHubSection = {
  id: (typeof KTH_INFO_HUB_SECTIONS)[number]["id"];
  label: string;
  shortLabel: string;
  emoji: string;
  sectionHref: string;
  accent: string;
  tabActive: string;
  links: ResolvedHubLink[];
};

const KTH_ANCHOR_PATHS: Record<string, string> = {
  "#cruise": "/cruise",
  "#ferries": "/ferries",
  "#airports": "/airports",
  "#trains": "/trains",
  "#buses": "/buses",
  "#hub": "/live",
  "#live": "/live",
  "#webcams": "/live",
  "#hotels": "/stay",
  "#restaurants": "/stay",
  "#visit": "/visit",
};

const SECTION_HUB_IDS: Record<
  KthSiteSectionId,
  Array<(typeof KTH_INFO_HUB_SECTIONS)[number]["id"] | "trains" | "buses">
> = {
  cruise: ["cruise"],
  ferries: ["ferry"],
  airports: ["airports"],
  trains: ["trains"],
  buses: ["buses"],
  live: ["roads", "cameras"],
  visit: [],
  stay: ["hotels", "restaurants"],
};

async function resolveAnchor(anchor: string): Promise<string> {
  if (anchor.startsWith("#webcam")) {
    return `${await kthPath("/live")}${anchor}`;
  }
  if (anchor === "#hotels" || anchor === "#restaurants") {
    return `${await kthPath("/stay")}${anchor}`;
  }
  const path = KTH_ANCHOR_PATHS[anchor];
  if (path) return kthPath(path);
  const home = await kthPath();
  return `${home}${anchor}`;
}

async function resolveLink(
  link: KthCategoryCardLink,
  bookUrl: string,
): Promise<ResolvedHubLink> {
  if ("anchor" in link) {
    return { id: link.id, label: link.label, href: await resolveAnchor(link.anchor) };
  }
  if ("path" in link) {
    return { id: link.id, label: link.label, href: await kthPath(link.path) };
  }
  if ("articleSlug" in link) {
    return {
      id: link.id,
      label: link.label,
      href: await kthPath(`/news/${link.articleSlug}`),
    };
  }
  if ("external" in link) {
    return {
      id: link.id,
      label: link.label,
      href: link.external,
      external: true,
    };
  }
  if ("bookingSearch" in link) {
    return {
      id: link.id,
      label: link.label,
      href: kthBookingSearchUrl(link.bookingSearch),
      external: true,
    };
  }
  return { id: link.id, label: link.label, href: bookUrl };
}

export async function resolveDoverRestaurantLinks(): Promise<ResolvedDoverRestaurant[]> {
  return KTH_DOVER_RESTAURANTS.map((place) => {
    if ("external" in place) {
      return {
        id: place.id,
        label: place.label,
        href: place.external,
        external: true as const,
        subtitle: place.subtitle,
        type: place.type,
      };
    }
    return {
      id: place.id,
      label: place.label,
      href: googleMapsSearchUrl(place.mapsQuery),
      external: true as const,
      subtitle: place.subtitle,
      type: place.type,
    };
  });
}

export async function resolveDoverHotelLinks(): Promise<ResolvedDoverHotel[]> {
  return KTH_DOVER_HOTELS.map((hotel) => ({
    id: hotel.id,
    label: hotel.label,
    href: hotel.external,
    external: true as const,
    subtitle: hotel.subtitle,
    priceFrom: hotel.priceFrom,
  }));
}

export async function resolveHubSections(): Promise<ResolvedHubSection[]> {
  const bookUrl = await kthBookUrl({ campaign: "info-hub", content: "transfer" });

  const sectionPaths: Record<(typeof KTH_INFO_HUB_SECTIONS)[number]["id"], string> = {
    cruise: "/cruise",
    ferry: "/ferries",
    airports: "/airports",
    roads: "/live",
    hotels: "/stay",
    restaurants: "/stay",
    cameras: "/live",
  };

  return Promise.all(
    KTH_INFO_HUB_SECTIONS.map(async (section) => {
      const rawLinks = KTH_CATEGORY_CARD_LINKS[section.id] ?? [];
      const links = await Promise.all(
        rawLinks.map((link) => resolveLink(link, bookUrl)),
      );

      return {
        id: section.id,
        label: section.label,
        shortLabel: section.shortLabel,
        emoji: section.emoji,
        sectionHref: await kthPath(sectionPaths[section.id]),
        accent: section.accent,
        tabActive: section.tabActive,
        links,
      };
    }),
  );
}

export async function resolveSectionHrefs(): Promise<Record<KthSiteSectionId, string>> {
  const entries = await Promise.all(
    KTH_SITE_SECTIONS.map(async (section) => [section.id, await kthPath(section.path)] as const),
  );
  return Object.fromEntries(entries) as Record<KthSiteSectionId, string>;
}

export async function resolveSectionLinks(
  sectionId: KthSiteSectionId,
): Promise<ResolvedHubLink[]> {
  const bookUrl = await kthBookUrl({ campaign: "section-links", content: sectionId });
  const hubIds = SECTION_HUB_IDS[sectionId];
  const links = await Promise.all(
    hubIds.flatMap((hubId) => KTH_CATEGORY_CARD_LINKS[hubId] ?? []).map((link) =>
      resolveLink(link, bookUrl),
    ),
  );

  if (sectionId === "visit") {
    return resolveVisitLinks();
  }

  if (sectionId === "stay") {
    return links;
  }

  return links;
}

export async function resolveVisitLinks(): Promise<ResolvedHubLink[]> {
  return Promise.all(
    KTH_VISIT_QUICK_LINKS.map(async (link) => ({
      id: link.id,
      label: link.label,
      href: await kthPath(`/news/${link.articleSlug}`),
    })),
  );
}
