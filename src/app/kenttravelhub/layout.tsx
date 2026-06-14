import { KthFooter } from "@/components/kenttravelhub/KthFooter";
import { KthHeader } from "@/components/kenttravelhub/KthHeader";
import { KthAdSenseAuto } from "@/components/kenttravelhub/KthAdSenseScript";
import { KthAnalyticsLoader } from "@/components/kenttravelhub/KthAnalyticsLoader";
import { KthWebSiteSchema } from "@/components/kenttravelhub/KthWebSiteSchema";
import {
  KTH_HERO_HEADLINE,
  KTH_NAME,
  KTH_SEO_LINE,
  KTH_SITE_URL,
  KTH_TAGLINE,
} from "@/lib/kenttravelhub/brand";
import { kthPageMetadata } from "@/lib/kenttravelhub/seo";
import { googleSiteVerificationKentTravelHub } from "@/lib/search-console";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const verification = googleSiteVerificationKentTravelHub();
  const meta = await kthPageMetadata({
    title: `${KTH_NAME} | ${KTH_TAGLINE}`,
    description: KTH_SEO_LINE,
  });

  return {
    ...meta,
    metadataBase: new URL(KTH_SITE_URL),
    openGraph: {
      ...meta.openGraph,
      title: `${KTH_NAME} | ${KTH_HERO_HEADLINE}`,
    },
    ...(verification ? { verification: { google: verification } } : {}),
  };
}

export default function KentTravelHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="kenttravelhub min-h-screen bg-white font-sans text-kth-navy antialiased">
      <KthWebSiteSchema />
      <KthAdSenseAuto />
      <KthAnalyticsLoader />
      <KthHeader />
      <main>{children}</main>
      <KthFooter />
    </div>
  );
}
