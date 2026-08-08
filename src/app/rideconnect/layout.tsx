import type { Metadata } from "next";
import { RcSiteShell } from "@/components/rideconnect/RcSiteShell";
import { rideConnectMetadata } from "@/lib/rideconnect/seo";
import { getRideConnectSite } from "@/lib/rideconnect/sites";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  const site = getRideConnectSite("rideconnect");
  return rideConnectMetadata(site, host);
}

export default function RideConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RcSiteShell>{children}</RcSiteShell>;
}
