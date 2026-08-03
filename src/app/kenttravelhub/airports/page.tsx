import { KthAirportLiveCentre } from "@/components/kenttravelhub/KthAirportLiveCentre";
import { KthSectionHubLinks } from "@/components/kenttravelhub/KthSectionHubLinks";
import { KthSectionShell } from "@/components/kenttravelhub/KthSectionShell";
import { KthWhatsAppChannelFollow } from "@/components/kenttravelhub/KthWhatsAppChannelFollow";
import { KTH_AIRPORT_LIVE_INTRO } from "@/lib/kenttravelhub/airport-live";
import { kthSectionPageMetadata } from "@/lib/kenttravelhub/section-metadata";
import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import { resolveSectionLinks } from "@/lib/kenttravelhub/resolve-hub-links";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import type { Metadata } from "next";
import Link from "next/link";

const section = KTH_SITE_SECTIONS.find((s) => s.id === "airports")!;

export async function generateMetadata(): Promise<Metadata> {
  return kthSectionPageMetadata(section);
}

export default async function KthAirportsSectionPage() {
  const [links, bookBase, bookHeathrow, bookGatwick, bookStansted, bookLuton, livePath] =
    await Promise.all([
      resolveSectionLinks("airports"),
      kthBookUrl({ campaign: "airport-live", content: "dashboard" }),
      kthBookUrl({ campaign: "airport-live", content: "heathrow" }),
      kthBookUrl({ campaign: "airport-live", content: "gatwick" }),
      kthBookUrl({ campaign: "airport-live", content: "stansted" }),
      kthBookUrl({ campaign: "airport-live", content: "luton" }),
      kthPath("/live"),
    ]);

  return (
    <KthSectionShell section={section}>
      <KthSectionHubLinks links={links} title="Airport live &amp; guides" />
      <KthWhatsAppChannelFollow variant="banner" />

      <section className="border-b border-kth-navy/8 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-sea">
            Airport live centre
          </p>
          <h2 className="mt-2 max-w-3xl font-serif text-2xl font-bold text-kth-navy sm:text-3xl">
            Live flights, Dover travel times &amp; M20 status
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-kth-muted sm:text-base">
            {KTH_AIRPORT_LIVE_INTRO}
          </p>
          <p className="mt-4 max-w-3xl text-sm text-kth-muted">
            Need the port instead? Check{" "}
            <Link href={livePath} className="font-semibold text-kth-sea hover:underline">
              live Dover status
            </Link>{" "}
            for cruise ships, ferries and M20 queues.
          </p>
        </div>
      </section>

      <section className="bg-kth-sand py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <KthAirportLiveCentre
            bookBase={bookBase}
            bookUrls={{
              heathrow: bookHeathrow,
              gatwick: bookGatwick,
              stansted: bookStansted,
              luton: bookLuton,
            }}
          />
        </div>
      </section>
    </KthSectionShell>
  );
}
