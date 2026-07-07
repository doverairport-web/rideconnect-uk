import { KthSectionShell } from "@/components/kenttravelhub/KthSectionShell";
import { KthVisitPlanner } from "@/components/kenttravelhub/KthVisitPlanner";
import { KTH_DAILY_QUESTIONS } from "@/lib/kenttravelhub/home-dashboard";
import { kthSectionPageMetadata } from "@/lib/kenttravelhub/section-metadata";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import type { Metadata } from "next";

const section = KTH_SITE_SECTIONS.find((s) => s.id === "visit")!;

export async function generateMetadata(): Promise<Metadata> {
  return kthSectionPageMetadata(section);
}

export default async function KthVisitSectionPage() {
  return (
    <KthSectionShell section={section}>
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-sm font-semibold leading-relaxed text-kth-muted">
            {KTH_DAILY_QUESTIONS.visit}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-kth-muted">
            Practical options for cruise and ferry passengers — organised by
            how much time you have, not a generic tourist list.
          </p>
          <div className="mt-8">
            <KthVisitPlanner />
          </div>
        </div>
      </section>
    </KthSectionShell>
  );
}
