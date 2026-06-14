import { KthLiveTravel } from "@/components/kenttravelhub/KthLiveTravel";
import { KthSectionHubLinks } from "@/components/kenttravelhub/KthSectionHubLinks";
import { KthSectionShell } from "@/components/kenttravelhub/KthSectionShell";
import { KthWebcams } from "@/components/kenttravelhub/KthWebcams";
import { kthSectionPageMetadata } from "@/lib/kenttravelhub/section-metadata";
import { resolveSectionLinks } from "@/lib/kenttravelhub/resolve-hub-links";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import type { Metadata } from "next";

const section = KTH_SITE_SECTIONS[3];

export async function generateMetadata(): Promise<Metadata> {
  return kthSectionPageMetadata(section);
}

export default async function KthLiveSectionPage() {
  const links = await resolveSectionLinks("live");

  return (
    <KthSectionShell section={section}>
      <KthSectionHubLinks links={links} />
      <KthLiveTravel />
      <KthWebcams />
    </KthSectionShell>
  );
}
