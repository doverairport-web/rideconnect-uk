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
    localSubtitle: "Local taxis, airport transfers, cruise transfers and school transport",
    heroTitle: BRAND_LEGAL,
    heroSubtitle:
      "Local taxis, airport transfers, cruise transfers and school transport.",
    heroBadge: "Kent & South East England",
    showNetworkBanner: false,
    networkBannerText: "",
    seoTitle: "RideConnect UK | Kent Taxi & Airport Transfers",
    seoDescription:
      "Book Kent taxis, airport and cruise transfers across Dover, Deal, Folkestone and Canterbury. Fixed fares, WhatsApp booking, available 24/7.",
    seoKeywords: [
      BRAND_LEGAL,
      "RideConnect taxi",
      "Kent taxi booking",
      "airport transfer Kent",
      "cruise transfer Dover",
      "school transport Kent",
    ],
    schemaName: BRAND_LEGAL,
    schemaAlternateNames: ["Dover Taxi"],
  },
  dovertaxi: {
    id: "dovertaxi",
    siteUrl: DOVER_TAXI_URL,
    brandTitle: BRAND_LEGAL,
    localSubtitle: "Dover Taxi & Airport Transfers",
    heroTitle: "Dover taxi — local trips, cruise port and airport transfers.",
    heroSubtitle:
      "Pre-book Dover taxis for town, hospital, station and cruise. Fixed-fare airport transfers from Deal, Folkestone, Canterbury and Ashford.",
    heroBadge: "Based in Dover, Kent",
    showNetworkBanner: false,
    networkBannerText: "",
    seoTitle: "Dover Taxi | Book Online — Local & Airport Transfers Kent",
    seoDescription:
      "Book a Dover taxi online for local trips, cruise port and airport transfers. Fixed fares to Gatwick & Heathrow. Call 01304 350125.",
    seoKeywords: [
      "Dover taxi",
      "taxi Dover",
      "book taxi Dover",
      "Dover airport transfer",
      "Dover cruise taxi",
      "Gatwick taxi Dover",
      "Heathrow taxi Dover",
      BRAND_LEGAL,
    ],
    schemaName: `${BRAND_LEGAL} — Dover Taxi`,
    schemaAlternateNames: ["Dover Taxi", "J.U. Orion Transport"],
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
    heroTitle: "Dover to Gatwick taxi — fixed fares from East Kent.",
    heroSubtitle:
      "Fixed fares from Dover, Deal, Sandwich, Folkestone and Canterbury to Gatwick, Heathrow, Stansted, Luton and London City. Cruise and port pickups available.",
    heroBadge: "Fixed airport fares",
    showNetworkBanner: true,
    networkBannerText: "Part of the RideConnect UK network",
    seoTitle: "Dover to Gatwick Taxi | Fixed Fares from Kent",
    seoDescription:
      "Fixed-fare Dover to Gatwick taxis plus Deal, Folkestone and Canterbury to Heathrow, Stansted and Luton. Cruise pickups. Book online.",
    seoKeywords: [
      "Dover to Gatwick taxi",
      "Deal to Gatwick taxi",
      "Canterbury to Gatwick taxi",
      "Folkestone airport transfer",
      "Sandwich to Heathrow taxi",
      "East Kent airport transfer",
      "Dover cruise to Gatwick",
      BRAND_LEGAL,
    ],
    schemaName: `${BRAND_LEGAL} — East Kent Airport Transfers`,
    schemaAlternateNames: [BRAND_LEGAL, "Dover Taxi", "Dover to Gatwick"],
  },
};

export function getRideConnectSite(id: RideConnectSiteId): RideConnectSiteConfig {
  return RIDECONNECT_SITES[id];
}

export function siteUrlForId(id: RideConnectSiteId): string {
  return RIDECONNECT_SITES[id].siteUrl.replace(/\/$/, "");
}
