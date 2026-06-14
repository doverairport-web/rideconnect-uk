import type { Metadata } from "next";
import type { RideConnectSiteConfig } from "@/lib/rideconnect/sites";
import { rideConnectSiteIdFromHost } from "@/lib/rideconnect/host";
import { getRideConnectSite } from "@/lib/rideconnect/sites";
import { googleSiteVerificationForHost } from "@/lib/search-console";

export function getSiteConfigFromHost(host: string | null): RideConnectSiteConfig {
  return getRideConnectSite(rideConnectSiteIdFromHost(host));
}

export function rideConnectMetadata(
  site: RideConnectSiteConfig,
  host: string | null,
  path = "/",
): Metadata {
  const base = site.siteUrl.replace(/\/$/, "");
  const url = path === "/" ? base : `${base}${path}`;
  const verification = googleSiteVerificationForHost(host);

  return {
    title: site.seoTitle,
    description: site.seoDescription,
    keywords: [...site.seoKeywords],
    metadataBase: new URL(base),
    alternates: { canonical: url },
    openGraph: {
      title: site.seoTitle,
      description: site.seoDescription,
      url,
      siteName: site.brandTitle,
      locale: "en_GB",
      type: "website",
      images: [
        {
          url: "/rideconnect-logo.png",
          width: 1024,
          height: 682,
          alt: site.brandTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.seoTitle,
      description: site.seoDescription,
      images: ["/rideconnect-logo.png"],
    },
    robots: { index: true, follow: true },
    ...(verification ? { verification: { google: verification } } : {}),
    icons: {
      icon: "/rideconnect-logo.png",
      apple: "/rideconnect-logo.png",
    },
  };
}
