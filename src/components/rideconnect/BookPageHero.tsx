"use client";

import { useSearchParams } from "next/navigation";
import { RcTransferHeroBanner } from "@/components/rideconnect/RcTransferHeroBanner";

function heroSlugFromParams(
  type: string | null,
  destination: string | null,
  pickup: string | null,
): string {
  if (type === "cruise" || pickup?.toLowerCase().includes("cruise")) {
    return "dover-cruise-terminal-taxi";
  }
  const dest = (destination ?? "").toLowerCase();
  if (dest.includes("gatwick")) return "dover-to-gatwick";
  if (dest.includes("heathrow")) return "dover-to-heathrow";
  if (type === "airport") return "dover-to-heathrow";
  if (pickup?.toLowerCase().includes("priory")) return "dover-priory-station-taxi";
  if (pickup?.toLowerCase().includes("deal")) return "deal-taxi";
  if (pickup?.toLowerCase().includes("canterbury")) return "canterbury-taxi";
  if (pickup?.toLowerCase().includes("folkestone")) return "folkestone-taxi";
  return "dover-ferry-port-taxi";
}

export function BookPageHero({ brandTitle }: { brandTitle: string }) {
  const searchParams = useSearchParams();
  const slug = heroSlugFromParams(
    searchParams.get("type"),
    searchParams.get("destination"),
    searchParams.get("pickup"),
  );

  return <RcTransferHeroBanner slug={slug} title={`Book with ${brandTitle}`} />;
}
