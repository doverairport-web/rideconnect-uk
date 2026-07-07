import { KTH_CRUISE_PICKUP_BY_TERMINAL, KTH_DAILY_QUESTIONS, KTH_TAXI_PICKUP_ADVICE } from "@/lib/kenttravelhub/home-dashboard";
import { KthCruiseArrivals } from "@/components/kenttravelhub/KthCruiseArrivals";
import { KthLiveCruiseCalendar } from "@/components/kenttravelhub/KthLiveCruiseCalendar";
import { KthSectionHubLinks } from "@/components/kenttravelhub/KthSectionHubLinks";
import { KthSectionShell } from "@/components/kenttravelhub/KthSectionShell";
import { KthWhatsAppChannelFollow } from "@/components/kenttravelhub/KthWhatsAppChannelFollow";
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
      <KthWhatsAppChannelFollow variant="banner" />
      <section className="border-b border-kth-navy/8 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="max-w-3xl text-sm font-semibold leading-relaxed text-kth-muted">
            {KTH_DAILY_QUESTIONS.cruise}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {KTH_CRUISE_PICKUP_BY_TERMINAL.map((row) => (
              <li
                key={row.terminal}
                className="rounded-lg border border-kth-navy/8 bg-kth-sand/40 p-4"
              >
                <p className="text-xs font-extrabold uppercase tracking-wide text-kth-sea">
                  {row.terminal}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-kth-navy/85">
                  {row.pickup}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-kth-muted">{KTH_TAXI_PICKUP_ADVICE.cruise}</p>
        </div>
      </section>
      <KthLiveCruiseCalendar />
      <KthCruiseArrivals />
    </KthSectionShell>
  );
}
