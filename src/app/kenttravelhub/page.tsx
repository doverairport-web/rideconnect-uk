import {
  KTH_HERO_HEADLINE,
  KTH_NAME,
  KTH_SEO_LINE,
} from "@/lib/kenttravelhub/brand";
import { KthBookBanner } from "@/components/kenttravelhub/KthBookBanner";
import { KthHero } from "@/components/kenttravelhub/KthHero";
import { KthHomePageSchema } from "@/components/kenttravelhub/KthHomePageSchema";
import { KthHomePopularGuides } from "@/components/kenttravelhub/KthHomePopularGuides";
import { KthLiveStatusBar } from "@/components/kenttravelhub/KthLiveStatusBar";
import { KthStayTeaser } from "@/components/kenttravelhub/KthStayTeaser";
import { KTH_LIVE_DETAIL_LINKS } from "@/lib/kenttravelhub/live-links";
import { kthPageMetadata } from "@/lib/kenttravelhub/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return kthPageMetadata({
    title: `${KTH_NAME} | ${KTH_HERO_HEADLINE}`,
    description: KTH_SEO_LINE,
    openGraphType: "website",
  });
}

export default async function KentTravelHubPage() {
  return (
    <>
      <KthHomePageSchema />
      <KthHero />
      <KthLiveStatusBar links={KTH_LIVE_DETAIL_LINKS} />
      <KthHomePopularGuides />
      <KthStayTeaser />
      <KthBookBanner />
    </>
  );
}
