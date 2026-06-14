import { SITE_URL } from "@/lib/brand";
import { HOMEKENT_SITE_URL } from "@/lib/homekent/brand";
import { isHomeKentHost } from "@/lib/homekent/paths";
import { KTH_SITE_URL } from "@/lib/kenttravelhub/brand";
import { isKentTravelHubHost } from "@/lib/kenttravelhub/host";
import type { MetadataRoute } from "next";
import { headers } from "next/headers";

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

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/platform/", "/driver/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
