import { HOMEKENT_SITE_URL } from "@/lib/homekent/brand";
import { getAllHomeKentLandingPages } from "@/lib/homekent/landing-pages";
import { isHomeKentHost } from "@/lib/homekent/paths";
import { getAllKthArticles } from "@/lib/kenttravelhub/articles";
import { KTH_SITE_URL } from "@/lib/kenttravelhub/brand";
import { isKentTravelHubHost } from "@/lib/kenttravelhub/host";
import { getAllKthLandingPages } from "@/lib/kenttravelhub/landing-pages";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import {
  isDoverTaxiHost,
  isDoverToGatwickHost,
  isOrionTaxisHost,
  isRideConnectUkHost,
} from "@/lib/rideconnect/host";
import { getAllNetworkTransferPages } from "@/lib/rideconnect/transfer-pages";
import { siteUrlForId } from "@/lib/rideconnect/sites";
import type { MetadataRoute } from "next";
import { headers } from "next/headers";

function networkSitemap(base: string): MetadataRoute.Sitemap {
  const transfers = getAllNetworkTransferPages().map((page) => ({
    url: `${base}/transfers/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/book`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    ...transfers,
    {
      url: `${base}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host");

  if (isHomeKentHost(host)) {
    const base = HOMEKENT_SITE_URL.replace(/\/$/, "");
    const services = getAllHomeKentLandingPages().map((page) => ({
      url: `${base}/services/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

    return [
      {
        url: base,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${base}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
      ...services,
      {
        url: `${base}/privacy`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.3,
      },
    ];
  }

  if (isKentTravelHubHost(host)) {
    const base = KTH_SITE_URL.replace(/\/$/, "");
    const articles = getAllKthArticles();
    const landingPages = getAllKthLandingPages();
    return [
      {
        url: base,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      },
      ...KTH_SITE_SECTIONS.map((section) => ({
        url: `${base}${section.path}`,
        lastModified: new Date(),
        changeFrequency: "hourly" as const,
        priority: 0.95,
      })),
      {
        url: `${base}/cruise-terminal`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      },
      {
        url: `${base}/news`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
      ...articles.map((article) => ({
        url: `${base}/news/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
      ...landingPages.map((page) => ({
        url: `${base}/taxi/${page.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.92,
      })),
      {
        url: `${base}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${base}/book`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.95,
      },
      {
        url: `${base}/privacy`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.3,
      },
    ];
  }

  if (isRideConnectUkHost(host)) {
    return networkSitemap(siteUrlForId("rideconnect"));
  }

  if (isOrionTaxisHost(host)) {
    return networkSitemap(siteUrlForId("oriontaxis"));
  }

  if (isDoverToGatwickHost(host)) {
    return networkSitemap(siteUrlForId("dovertogatwick"));
  }

  const base = isDoverTaxiHost(host)
    ? siteUrlForId("dovertaxi")
    : siteUrlForId("dovertaxi");

  return networkSitemap(base);
}
