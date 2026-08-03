import { KthCruiseTerminalGuidePage } from "@/components/kenttravelhub/KthCruiseTerminalGuidePage";
import { KTH_CRUISE_TERMINAL_META } from "@/lib/kenttravelhub/cruise-terminal-guide";
import { KTH_NAME } from "@/lib/kenttravelhub/brand";
import { kthPageMetadata } from "@/lib/kenttravelhub/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return kthPageMetadata({
    title: `${KTH_CRUISE_TERMINAL_META.title} | ${KTH_NAME}`,
    description: KTH_CRUISE_TERMINAL_META.description,
    path: "/cruise-terminal",
    openGraphType: "article",
    keywords: [
      "Dover cruise terminal",
      "Dover cruise terminal guide",
      "Dover CT1",
      "Dover CT2",
      "Dover cruise terminal map",
      "Dover cruise terminal taxi",
      "hotels near Dover cruise terminal",
      "Dover cruise terminal restaurants",
      "Dover cruise transfer",
    ],
  });
}

export default function KentTravelHubCruiseTerminalPage() {
  return <KthCruiseTerminalGuidePage />;
}
