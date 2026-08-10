import {
  googleSiteVerificationDoverTaxi,
  googleSiteVerificationGatwick,
  googleSiteVerificationHomeKent,
  googleSiteVerificationKentTravelHub,
  googleSiteVerificationOrion,
  googleSiteVerificationRideConnect,
} from "@/lib/search-console";
import { HOMEKENT_SITE_URL } from "@/lib/homekent/brand";
import { KTH_SITE_URL } from "@/lib/kenttravelhub/brand";
import { siteUrlForId } from "@/lib/rideconnect/sites";

export type SearchConsoleSiteStatus = {
  id: string;
  name: string;
  siteUrl: string;
  sitemapUrl: string;
  verificationEnv: string;
  verificationConfigured: boolean;
  verificationPreview: string | null;
  gaEnv: string;
  gaConfigured: boolean;
  gaId: string | null;
  searchConsoleUrl: string;
};

function maskCode(code: string | undefined): string | null {
  if (!code) return null;
  if (code.length <= 10) return `${code.slice(0, 2)}…`;
  return `${code.slice(0, 6)}…${code.slice(-4)}`;
}

function trimUrl(url: string): string {
  return url.replace(/\/$/, "");
}

export function getSearchConsoleDashboardSites(): SearchConsoleSiteStatus[] {
  const rideconnect = googleSiteVerificationRideConnect();
  const dovertaxi = googleSiteVerificationDoverTaxi();
  const orion = googleSiteVerificationOrion();
  const gatwick = googleSiteVerificationGatwick();
  const homekent = googleSiteVerificationHomeKent();
  const kth = googleSiteVerificationKentTravelHub();

  const gaDefault = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || null;
  const gaKth =
    process.env.NEXT_PUBLIC_KTH_GA_MEASUREMENT_ID?.trim() || gaDefault;

  const rideconnectUrl = trimUrl(siteUrlForId("rideconnect"));
  const dovertaxiUrl = trimUrl(siteUrlForId("dovertaxi"));
  const orionUrl = trimUrl(siteUrlForId("oriontaxis"));
  const gatwickUrl = trimUrl(siteUrlForId("dovertogatwick"));
  const homekentUrl = trimUrl(HOMEKENT_SITE_URL);
  const kthUrl = trimUrl(KTH_SITE_URL);

  return [
    {
      id: "rideconnect",
      name: "RideConnect UK",
      siteUrl: rideconnectUrl,
      sitemapUrl: `${rideconnectUrl}/sitemap.xml`,
      verificationEnv: "RIDECONNECT_GOOGLE_SITE_VERIFICATION",
      verificationConfigured: Boolean(rideconnect),
      verificationPreview: maskCode(rideconnect),
      gaEnv: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
      gaConfigured: Boolean(gaDefault),
      gaId: gaDefault,
      searchConsoleUrl: `https://search.google.com/search-console?resource_id=${encodeURIComponent(`sc-domain:${new URL(rideconnectUrl).hostname}`)}`,
    },
    {
      id: "dovertaxi",
      name: "Dover Taxi",
      siteUrl: dovertaxiUrl,
      sitemapUrl: `${dovertaxiUrl}/sitemap.xml`,
      verificationEnv: "DOVERTAXI_GOOGLE_SITE_VERIFICATION",
      verificationConfigured: Boolean(dovertaxi),
      verificationPreview: maskCode(dovertaxi),
      gaEnv: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
      gaConfigured: Boolean(gaDefault),
      gaId: gaDefault,
      searchConsoleUrl: `https://search.google.com/search-console?resource_id=${encodeURIComponent(dovertaxiUrl)}`,
    },
    {
      id: "oriontaxis",
      name: "Orion Taxis",
      siteUrl: orionUrl,
      sitemapUrl: `${orionUrl}/sitemap.xml`,
      verificationEnv: "ORION_GOOGLE_SITE_VERIFICATION",
      verificationConfigured: Boolean(orion),
      verificationPreview: maskCode(orion),
      gaEnv: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
      gaConfigured: Boolean(gaDefault),
      gaId: gaDefault,
      searchConsoleUrl: `https://search.google.com/search-console?resource_id=${encodeURIComponent(orionUrl)}`,
    },
    {
      id: "dovertogatwick",
      name: "Dover to Gatwick",
      siteUrl: gatwickUrl,
      sitemapUrl: `${gatwickUrl}/sitemap.xml`,
      verificationEnv: "GATWICK_GOOGLE_SITE_VERIFICATION",
      verificationConfigured: Boolean(gatwick),
      verificationPreview: maskCode(gatwick),
      gaEnv: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
      gaConfigured: Boolean(gaDefault),
      gaId: gaDefault,
      searchConsoleUrl: `https://search.google.com/search-console?resource_id=${encodeURIComponent(gatwickUrl)}`,
    },
    {
      id: "homekent",
      name: "HomeKent",
      siteUrl: homekentUrl,
      sitemapUrl: `${homekentUrl}/sitemap.xml`,
      verificationEnv: "HOMEKENT_GOOGLE_SITE_VERIFICATION",
      verificationConfigured: Boolean(homekent),
      verificationPreview: maskCode(homekent),
      gaEnv: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
      gaConfigured: Boolean(gaDefault),
      gaId: gaDefault,
      searchConsoleUrl: `https://search.google.com/search-console?resource_id=${encodeURIComponent(homekentUrl)}`,
    },
    {
      id: "kenttravelhub",
      name: "Kent Travel Hub",
      siteUrl: kthUrl,
      sitemapUrl: `${kthUrl}/sitemap.xml`,
      verificationEnv: "KTH_GOOGLE_SITE_VERIFICATION",
      verificationConfigured: Boolean(kth),
      verificationPreview: maskCode(kth),
      gaEnv: "NEXT_PUBLIC_KTH_GA_MEASUREMENT_ID",
      gaConfigured: Boolean(gaKth),
      gaId: gaKth,
      searchConsoleUrl: `https://search.google.com/search-console?resource_id=${encodeURIComponent(kthUrl)}`,
    },
  ];
}
