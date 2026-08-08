import { HOMEKENT_SITE_URL } from "@/lib/homekent/brand";
import { isHomeKentHost } from "@/lib/homekent/paths";
import { KTH_SITE_URL } from "@/lib/kenttravelhub/brand";
import { isKentTravelHubHost } from "@/lib/kenttravelhub/host";
import {
  isDoverTaxiHost,
  isDoverToGatwickHost,
  isOrionTaxisHost,
  isRideConnectNetworkHost,
  isRideConnectUkHost,
} from "@/lib/rideconnect/host";
import { siteUrlForId } from "@/lib/rideconnect/sites";
import type { MetadataRoute } from "next";
import { headers } from "next/headers";

function sitemapUrlForNetworkHost(host: string | null): string {
  if (isRideConnectUkHost(host)) return siteUrlForId("rideconnect");
  if (isOrionTaxisHost(host)) return siteUrlForId("oriontaxis");
  if (isDoverToGatwickHost(host)) return siteUrlForId("dovertogatwick");
  return siteUrlForId("dovertaxi");
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");

  if (isHomeKentHost(host)) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/book", "/driver", "/platform", "/private"],
      },
      sitemap: `${HOMEKENT_SITE_URL.replace(/\/$/, "")}/sitemap.xml`,
    };
  }

  if (isKentTravelHubHost(host)) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/driver", "/platform", "/private"],
      },
      sitemap: `${KTH_SITE_URL.replace(/\/$/, "")}/sitemap.xml`,
    };
  }

  const base = isRideConnectNetworkHost(host)
    ? sitemapUrlForNetworkHost(host)
    : isDoverTaxiHost(host)
      ? siteUrlForId("dovertaxi")
      : siteUrlForId("dovertaxi");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/platform/", "/driver/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
