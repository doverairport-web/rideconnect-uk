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
    seoTitle: `${BRAND_LEGAL} | Book Taxis, Airport & Cruise Transfers Online`,
    seoDescription:
      "RideConnect UK — book local taxis, airport transfers, cruise port pickups and school transport across Dover, Deal, Folkestone, Canterbury and Ashford. Fixed airport fares, WhatsApp booking and passenger app.",
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
    heroTitle: "Book local taxis and airport transfers with RideConnect UK.",
    heroSubtitle:
      "Dover taxi service — port, cruise, town and station. Pre-booked airport transfers from Deal, Folkestone, Canterbury and Ashford.",
    heroBadge: "Based in Dover, Kent",
    showNetworkBanner: false,
    networkBannerText: "",
    seoTitle: "Dover Taxi | Book Online — Local & Airport Transfers Kent",
    seoDescription:
      "Book a Dover taxi online — local trips, hospital, station, cruise port and airport transfers. Fixed fares to Gatwick and Heathrow with RideConnect UK. Call 01304 350125.",
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
      "Licensed local drivers for Dover, Deal, Folkestone and Kent airport transfers — book online, by phone or WhatsApp.",
    heroBadge: "Dover & Kent",
    showNetworkBanner: true,
    networkBannerText: "Part of the RideConnect UK network",
    seoTitle: "Dover & Kent Taxi | RideConnect UK | Book Online",
    seoDescription:
      "Book Dover and Kent taxis with RideConnect UK — airport transfers, cruise port pickups and local journeys. Part of the RideConnect UK driver network.",
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
    heroTitle: "East Kent airport transfers with RideConnect UK.",
    heroSubtitle:
      "Fixed fares from Dover, Deal, Sandwich, Folkestone and Canterbury to Gatwick, Heathrow, Stansted, Luton and London City. Cruise and port pickups available.",
    heroBadge: "Fixed airport fares",
    showNetworkBanner: true,
    networkBannerText: "Part of the RideConnect UK network",
    seoTitle:
      "East Kent Airport Taxi | Dover, Deal, Canterbury | Fixed Fares | RideConnect UK",
    seoDescription:
      "Fixed-fare airport transfers from Dover, Deal, Sandwich, Folkestone and Canterbury to Gatwick, Heathrow, Stansted and Luton. Cruise terminal pickups. Book online.",
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
