import {
  KTH_HERO_HEADLINE,
  KTH_NAME,
  KTH_SEO_LINE,
} from "@/lib/kenttravelhub/brand";
import { KthHomeDashboard } from "@/components/kenttravelhub/KthHomeDashboard";
import { KthHomeHero } from "@/components/kenttravelhub/KthHomeHero";
import { KthHomePageSchema } from "@/components/kenttravelhub/KthHomePageSchema";
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
      <KthHomeHero />
      <KthHomeDashboard />
    </>
  );
}
