import { KthSectionShell } from "@/components/kenttravelhub/KthSectionShell";
import { KthVisitKentPlaces } from "@/components/kenttravelhub/KthVisitKentPlaces";
import { kthSectionPageMetadata } from "@/lib/kenttravelhub/section-metadata";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import type { Metadata } from "next";

const section = KTH_SITE_SECTIONS[4];

export async function generateMetadata(): Promise<Metadata> {
  return kthSectionPageMetadata(section);
}

export default async function KthVisitSectionPage() {
  return (
    <KthSectionShell section={section}>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
            Places to see
          </h2>
          <p className="mt-1 text-2xl font-extrabold text-kth-navy sm:text-3xl">
            Day trips from Dover
          </p>
          <p className="mt-3 text-sm leading-relaxed text-kth-muted">
            Official websites plus short planning guides — distances from Dover
            port and town centre.
          </p>

          <div className="mt-8">
            <KthVisitKentPlaces />
          </div>
        </div>
      </section>
    </KthSectionShell>
  );
}
