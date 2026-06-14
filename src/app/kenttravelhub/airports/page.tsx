import { KthAirportTransfers } from "@/components/kenttravelhub/KthAirportTransfers";
import { KthSectionHubLinks } from "@/components/kenttravelhub/KthSectionHubLinks";
import { KthSectionShell } from "@/components/kenttravelhub/KthSectionShell";
import { kthSectionPageMetadata } from "@/lib/kenttravelhub/section-metadata";
import { resolveSectionLinks } from "@/lib/kenttravelhub/resolve-hub-links";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import type { Metadata } from "next";

const section = KTH_SITE_SECTIONS[2];

export async function generateMetadata(): Promise<Metadata> {
  return kthSectionPageMetadata(section);
}

export default async function KthAirportsSectionPage() {
  const links = await resolveSectionLinks("airports");

  return (
    <KthSectionShell section={section}>
      <KthSectionHubLinks links={links} />
      <KthAirportTransfers />
    </KthSectionShell>
  );
}
