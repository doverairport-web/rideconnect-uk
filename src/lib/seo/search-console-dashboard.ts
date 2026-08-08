import { HOMEKENT_SITE_URL } from "@/lib/homekent/brand";
import { KTH_SITE_URL } from "@/lib/kenttravelhub/brand";
import { siteUrlForId } from "@/lib/rideconnect/sites";
import {
  googleSiteVerificationDover,
  googleSiteVerificationHomeKent,
  googleSiteVerificationKentTravelHub,
} from "@/lib/search-console";

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
  const dover = googleSiteVerificationDover();
  const homekent = googleSiteVerificationHomeKent();
  const kth = googleSiteVerificationKentTravelHub();

  const gaDefault = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || null;
  const gaKth =
    process.env.NEXT_PUBLIC_KTH_GA_MEASUREMENT_ID?.trim() || gaDefault;

  const rideconnect = trimUrl(siteUrlForId("rideconnect"));
  const dovertaxi = trimUrl(siteUrlForId("dovertaxi"));
  const orion = trimUrl(siteUrlForId("oriontaxis"));
  const gatwick = trimUrl(siteUrlForId("dovertogatwick"));
  const homekentUrl = trimUrl(HOMEKENT_SITE_URL);
  const kthUrl = trimUrl(KTH_SITE_URL);

  return [
    {
      id: "rideconnect",
      name: "RideConnect UK",
      siteUrl: rideconnect,
      sitemapUrl: `${rideconnect}/sitemap.xml`,
      verificationEnv: "GOOGLE_SITE_VERIFICATION",
      verificationConfigured: Boolean(dover),
      verificationPreview: maskCode(dover),
      gaEnv: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
      gaConfigured: Boolean(gaDefault),
      gaId: gaDefault,
      searchConsoleUrl: `https://search.google.com/search-console?resource_id=${encodeURIComponent(`sc-domain:${new URL(rideconnect).hostname}`)}`,
    },
    {
      id: "dovertaxi",
      name: "Dover Taxi",
      siteUrl: dovertaxi,
      sitemapUrl: `${dovertaxi}/sitemap.xml`,
      verificationEnv: "GOOGLE_SITE_VERIFICATION",
      verificationConfigured: Boolean(dover),
      verificationPreview: maskCode(dover),
      gaEnv: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
      gaConfigured: Boolean(gaDefault),
      gaId: gaDefault,
      searchConsoleUrl: `https://search.google.com/search-console?resource_id=${encodeURIComponent(dovertaxi)}`,
    },
    {
      id: "oriontaxis",
      name: "Orion Taxis",
      siteUrl: orion,
      sitemapUrl: `${orion}/sitemap.xml`,
      verificationEnv: "GOOGLE_SITE_VERIFICATION",
      verificationConfigured: Boolean(dover),
      verificationPreview: maskCode(dover),
      gaEnv: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
      gaConfigured: Boolean(gaDefault),
      gaId: gaDefault,
      searchConsoleUrl: `https://search.google.com/search-console?resource_id=${encodeURIComponent(orion)}`,
    },
    {
      id: "dovertogatwick",
      name: "Dover to Gatwick",
      siteUrl: gatwick,
      sitemapUrl: `${gatwick}/sitemap.xml`,
      verificationEnv: "GOOGLE_SITE_VERIFICATION",
      verificationConfigured: Boolean(dover),
      verificationPreview: maskCode(dover),
      gaEnv: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
      gaConfigured: Boolean(gaDefault),
      gaId: gaDefault,
      searchConsoleUrl: `https://search.google.com/search-console?resource_id=${encodeURIComponent(gatwick)}`,
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
