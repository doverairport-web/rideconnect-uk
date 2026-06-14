import { KthCruiseArrivals } from "@/components/kenttravelhub/KthCruiseArrivals";
import { KthLiveCruiseCalendar } from "@/components/kenttravelhub/KthLiveCruiseCalendar";
import { KthSectionHubLinks } from "@/components/kenttravelhub/KthSectionHubLinks";
import { KthSectionShell } from "@/components/kenttravelhub/KthSectionShell";
import { kthSectionPageMetadata } from "@/lib/kenttravelhub/section-metadata";
import { resolveSectionLinks } from "@/lib/kenttravelhub/resolve-hub-links";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import type { Metadata } from "next";

const section = KTH_SITE_SECTIONS[0];

export async function generateMetadata(): Promise<Metadata> {
  return kthSectionPageMetadata(section);
}

export default async function KthCruiseSectionPage() {
  const links = await resolveSectionLinks("cruise");

  return (
    <KthSectionShell section={section}>
      <KthSectionHubLinks links={links} />
      <KthLiveCruiseCalendar />
      <KthCruiseArrivals />
    </KthSectionShell>
  );
}
