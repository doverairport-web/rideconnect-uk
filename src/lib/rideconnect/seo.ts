import type { Metadata } from "next";
import type { RideConnectSiteConfig } from "@/lib/rideconnect/sites";
import { rideConnectSiteIdFromHost } from "@/lib/rideconnect/host";
import { getRideConnectSite } from "@/lib/rideconnect/sites";
import { googleSiteVerificationForHost } from "@/lib/search-console";

export function getSiteConfigFromHost(host: string | null): RideConnectSiteConfig {
  return getRideConnectSite(rideConnectSiteIdFromHost(host));
}

function shareImageForSite(site: RideConnectSiteConfig) {
  if (site.id === "dovertogatwick") {
    // Use network taxi imagery — never borrow Kent Travel Hub assets.
    return {
      url: "/images/airport.jpg",
      width: 1600,
      height: 900,
      alt: "Dover to Gatwick taxi — airport transfer from East Kent",
    };
  }
  return {
    url: "/rideconnect-logo.png",
    width: 1024,
    height: 682,
    alt: site.brandTitle,
  };
}

export function rideConnectMetadata(
  site: RideConnectSiteConfig,
  host: string | null,
  path = "/",
): Metadata {
  const base = site.siteUrl.replace(/\/$/, "");
  const url = path === "/" ? base : `${base}${path}`;
  const verification = googleSiteVerificationForHost(host);
  const shareImage = shareImageForSite(site);

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
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: site.seoTitle,
      description: site.seoDescription,
      images: [shareImage.url],
    },
    robots: { index: true, follow: true },
    ...(verification ? { verification: { google: verification } } : {}),
    icons: {
      icon: "/rideconnect-logo.png",
      apple: "/rideconnect-logo.png",
    },
  };
}
