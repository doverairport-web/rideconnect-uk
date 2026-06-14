import type { Metadata } from "next";
import { RcSiteShell } from "@/components/rideconnect/RcSiteShell";
import {
  getRequestPathname,
  getRideConnectSiteForRequest,
} from "@/lib/rideconnect/page-metadata";
import { rideConnectMetadata } from "@/lib/rideconnect/seo";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  const site = await getRideConnectSiteForRequest();
  const pathname = await getRequestPathname();
  return rideConnectMetadata(site, host, pathname);
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <RcSiteShell>{children}</RcSiteShell>;
}
