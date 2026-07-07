import { KTH_DAILY_QUESTIONS } from "@/lib/kenttravelhub/home-dashboard";
import { KthLiveTravel } from "@/components/kenttravelhub/KthLiveTravel";
import { KthSectionHubLinks } from "@/components/kenttravelhub/KthSectionHubLinks";
import { KthSectionShell } from "@/components/kenttravelhub/KthSectionShell";
import { KthWebcams } from "@/components/kenttravelhub/KthWebcams";
import { kthSectionPageMetadata } from "@/lib/kenttravelhub/section-metadata";
import { resolveSectionLinks } from "@/lib/kenttravelhub/resolve-hub-links";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import type { Metadata } from "next";

const section = KTH_SITE_SECTIONS.find((s) => s.id === "live")!;

export async function generateMetadata(): Promise<Metadata> {
  return kthSectionPageMetadata(section);
}

export default async function KthLiveSectionPage() {
  const links = await resolveSectionLinks("live");

  return (
    <KthSectionShell section={section}>
      <KthSectionHubLinks links={links} />
      <section className="border-b border-kth-navy/8 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="max-w-3xl text-sm font-semibold leading-relaxed text-kth-muted">
            {KTH_DAILY_QUESTIONS.live}
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-kth-muted">
            {KTH_DAILY_QUESTIONS.weather}
          </p>
        </div>
      </section>
      <KthLiveTravel />
      <KthWebcams />
    </KthSectionShell>
  );
}
