import { BRAND_LEGAL } from "@/lib/brand";

export type RideConnectSiteId =
  | "rideconnect"
  | "dovertaxi"
  | "oriontaxis"
  | "dovertogatwick";

export type RideConnectSiteConfig = {
  id: RideConnectSiteId;
  siteUrl: string;
  brandTitle: string;
  localSubtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge?: string;
  showNetworkBanner: boolean;
  networkBannerText: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  schemaName: string;
  schemaAlternateNames: string[];
};

const RIDE_CONNECT_URL =
  process.env.NEXT_PUBLIC_RIDECONNECT_URL?.trim() ||
  "https://rideconnectuk.com";
const DOVER_TAXI_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://dovertaxi.co.uk";
const ORION_URL =
  process.env.NEXT_PUBLIC_ORION_URL?.trim() || "https://oriontaxis.co.uk";
const GATWICK_URL =
  process.env.NEXT_PUBLIC_GATWICK_URL?.trim() ||
  "https://dovertogatwicktaxi.com";

export const RIDECONNECT_SITES: Record<RideConnectSiteId, RideConnectSiteConfig> = {
  rideconnect: {
    id: "rideconnect",
    siteUrl: RIDE_CONNECT_URL,
    brandTitle: BRAND_LEGAL,
    localSubtitle: "Kent Taxi & Airport Transfers",
    heroTitle: BRAND_LEGAL,
    heroSubtitle:
      "Kent taxi and airport transfers from Dover, Deal, Folkestone and Canterbury. Fixed fares, online booking and licensed local drivers — book in minutes or call 01304 350125.",
    heroBadge: "Kent & South East England",
    showNetworkBanner: false,
    networkBannerText: "",
    seoTitle: "RideConnect UK | Book Kent Taxis & Airport Transfers Online",
    seoDescription:
      "RideConnect UK — book Kent taxis, airport and cruise transfers online. Dover, Deal, Folkestone and Canterbury. Fixed fares. Call 01304 350125.",
    seoKeywords: [
      BRAND_LEGAL,
      "RideConnect",
      "RideConnect taxi",
      "Kent taxi",
      "Kent taxi booking",
      "Kent airport transfer",
      "airport transfer Kent",
      "cruise transfer Dover",
      "Dover taxi",
      "school transport Kent",
    ],
    schemaName: BRAND_LEGAL,
    schemaAlternateNames: ["RideConnect", "Ride Connect UK", "Dover Taxi"],
  },
  dovertaxi: {
    id: "dovertaxi",
    siteUrl: DOVER_TAXI_URL,
    brandTitle: BRAND_LEGAL,
    localSubtitle: "Dover Taxi — Book Online",
    heroTitle: "Dover taxi you can book online — local, port and airport.",
    heroSubtitle:
      "Licensed Dover taxis for town, hospital, Priory station, ferry and cruise. Fixed-fare airport transfers from Dover, Deal, Folkestone and Canterbury — book in minutes or call 01304 350125.",
    heroBadge: "Based in Dover, Kent",
    showNetworkBanner: true,
    networkBannerText: "Part of RideConnect UK — Kent taxi & airport transfers",
    seoTitle: "Dover Taxi | Book Online — Fixed Fares & Airport Transfers",
    seoDescription:
      "Taxi Dover? Book a local Dover taxi online with RideConnect UK for town, port, station and airports. Fixed fares to Gatwick & Heathrow. Call 01304 350125.",
    seoKeywords: [
      "Dover taxi",
      "taxi Dover",
      "dover taxis",
      "book taxi Dover",
      "Dover airport transfer",
      "Dover cruise taxi",
      "Gatwick taxi Dover",
      "Heathrow taxi Dover",
      BRAND_LEGAL,
    ],
    schemaName: `${BRAND_LEGAL} — Dover Taxi`,
    schemaAlternateNames: ["Dover Taxi", "Dover Taxis", "J.U. Orion Transport", BRAND_LEGAL],
  },
  oriontaxis: {
    id: "oriontaxis",
    siteUrl: ORION_URL,
    brandTitle: BRAND_LEGAL,
    localSubtitle: "Dover & Kent Taxi Services",
    heroTitle: "Dover & Kent taxi services with RideConnect UK.",
    heroSubtitle:
      "Licensed local drivers for Dover, Deal, Folkestone and Kent airport transfers — book online with map, fare estimate and card payment.",
    heroBadge: "Dover & Kent",
    showNetworkBanner: true,
    networkBannerText: "Part of the RideConnect UK network",
    seoTitle: "Orion Taxis Dover | Book Online | RideConnect UK",
    seoDescription:
      "Book Dover and Kent taxis online with RideConnect UK. Airport transfers, cruise port pickups, map route and dispatch. Call 01304 350125.",
    seoKeywords: [
      "Dover taxi",
      "Kent taxi",
      "Orion taxi Dover",
      "Dover airport transfer",
      BRAND_LEGAL,
    ],
    schemaName: `${BRAND_LEGAL} — Dover & Kent`,
    schemaAlternateNames: [BRAND_LEGAL, "J.U. Orion Transport"],
  },
  dovertogatwick: {
    id: "dovertogatwick",
    siteUrl: GATWICK_URL,
    brandTitle: BRAND_LEGAL,
    localSubtitle: "East Kent Airport Transfers",
    heroTitle: "Dover to Gatwick Taxi — Fixed Fares from £150",
    heroSubtitle:
      "Book a fixed-fare taxi from Dover, Deal, Sandwich, Folkestone or Canterbury to Gatwick North & South. Also Heathrow, Stansted, Luton and cruise port pickups.",
    heroBadge: "Dover → Gatwick specialist",
    showNetworkBanner: true,
    networkBannerText: "Part of the RideConnect UK network",
    seoTitle: "Dover to Gatwick Taxi | Fixed Fares from £150 | Book Online",
    seoDescription:
      "Dover to Gatwick taxi from £150. Fixed fares from Deal, Sandwich, Folkestone and Canterbury. Licensed Kent drivers — book online 24/7.",
    seoKeywords: [
      "Dover to Gatwick taxi",
      "taxi Dover to Gatwick",
      "Dover Gatwick airport transfer",
      "Deal to Gatwick taxi",
      "Canterbury to Gatwick taxi",
      "Folkestone to Gatwick taxi",
      "Sandwich to Gatwick taxi",
      "Dover cruise to Gatwick",
      "East Kent airport transfer",
      BRAND_LEGAL,
    ],
    schemaName: `${BRAND_LEGAL} — Dover to Gatwick Taxi`,
    schemaAlternateNames: [
      BRAND_LEGAL,
      "Dover to Gatwick Taxi",
      "Dover Gatwick Airport Transfer",
      "Dover Taxi",
    ],
  },
};

export function getRideConnectSite(id: RideConnectSiteId): RideConnectSiteConfig {
  return RIDECONNECT_SITES[id];
}

export function siteUrlForId(id: RideConnectSiteId): string {
  return RIDECONNECT_SITES[id].siteUrl.replace(/\/$/, "");
}
