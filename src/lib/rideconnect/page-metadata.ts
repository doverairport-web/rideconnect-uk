import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSiteConfigFromHost, rideConnectMetadata } from "@/lib/rideconnect/seo";
import type { RideConnectSiteId } from "@/lib/rideconnect/sites";
import { getRideConnectSite } from "@/lib/rideconnect/sites";

function siteIdFromHeader(value: string | null): RideConnectSiteId | null {
  if (
    value === "rideconnect" ||
    value === "dovertaxi" ||
    value === "oriontaxis" ||
    value === "dovertogatwick"
  ) {
    return value;
  }
  return null;
}

export async function getRequestPathname(): Promise<string> {
  const pathname = (await headers()).get("x-pathname");
  return pathname && pathname.startsWith("/") ? pathname : "/";
}

export async function getRideConnectSiteForRequest() {
  const h = await headers();
  const fromHeader = siteIdFromHeader(h.get("x-site"));
  if (fromHeader) return getRideConnectSite(fromHeader);
  return getSiteConfigFromHost(h.get("host"));
}

export async function rideConnectPageMetadata(
  path: string,
  title: string,
  description: string,
): Promise<Metadata> {
  const h = await headers();
  const host = h.get("host");
  const site = await getRideConnectSiteForRequest();
  const base = rideConnectMetadata(site, host, path);

  return {
    ...base,
    title,
    description,
    openGraph: {
      ...base.openGraph,
      title,
      description,
      url: path === "/" ? site.siteUrl.replace(/\/$/, "") : `${site.siteUrl.replace(/\/$/, "")}${path}`,
    },
    twitter: {
      ...base.twitter,
      title,
      description,
    },
  };
}
