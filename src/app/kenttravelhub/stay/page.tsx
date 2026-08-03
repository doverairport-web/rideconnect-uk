import { KthCruiseHotelCards } from "@/components/kenttravelhub/KthCruiseHotelCards";
import { KthDoverRestaurantLinks } from "@/components/kenttravelhub/KthDoverRestaurantLinks";
import { KthSectionHubLinks } from "@/components/kenttravelhub/KthSectionHubLinks";
import { KthSectionShell } from "@/components/kenttravelhub/KthSectionShell";
import { KTH_CRUISE_HOTELS_INTRO, KTH_CRUISE_HOTELS } from "@/lib/kenttravelhub/cruise-hotels";
import { kthSectionPageMetadata } from "@/lib/kenttravelhub/section-metadata";
import {
  resolveDoverRestaurantLinks,
  resolveSectionLinks,
} from "@/lib/kenttravelhub/resolve-hub-links";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import type { Metadata } from "next";
import Link from "next/link";

const section = KTH_SITE_SECTIONS.find((s) => s.id === "stay")!;

export async function generateMetadata(): Promise<Metadata> {
  return kthSectionPageMetadata(section);
}

export default async function KthStaySectionPage() {
  const [links, doverRestaurants, bookUrl, cruiseTerminal] = await Promise.all([
    resolveSectionLinks("stay"),
    resolveDoverRestaurantLinks(),
    kthBookUrl({ campaign: "stay-page", content: "intro" }),
    kthPath("/cruise-terminal"),
  ]);

  return (
    <KthSectionShell section={section}>
      <KthSectionHubLinks links={links} title="Hotels &amp; restaurants" />

      <section className="border-b border-kth-navy/8 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-sea">
            Written for cruise passengers
          </p>
          <h2 className="mt-2 max-w-3xl font-serif text-2xl font-bold text-kth-navy sm:text-3xl">
            Where Dover locals tell cruise guests to stay
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-kth-muted sm:text-base">
            {KTH_CRUISE_HOTELS_INTRO}
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-kth-muted">
            CT1 is on Admiralty Pier; CT2 is at the Western Docks — a few minutes
            apart by road. Share your terminal when you{" "}
            <Link href={bookUrl} className="font-semibold text-kth-sea hover:underline">
              book a taxi
            </Link>{" "}
            or read our{" "}
            <Link
              href={cruiseTerminal}
              className="font-semibold text-kth-sea hover:underline"
            >
              cruise terminal guide
            </Link>
            .
          </p>
        </div>
      </section>

      <section
        id="hotels"
        className="scroll-mt-24 border-b border-kth-navy/8 bg-kth-sand py-10 sm:py-14"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-sea">
            {KTH_CRUISE_HOTELS.length} hotels we recommend
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-kth-navy sm:text-3xl">
            Stay before embarkation or after disembarkation
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-kth-muted">
            Official photos and links only — book direct with the hotel, then
            pre-book your taxi to CT1 or CT2 for turnaround mornings.
          </p>
          <div className="mt-8">
            <KthCruiseHotelCards />
          </div>
        </div>
      </section>

      <section id="restaurants" className="scroll-mt-24 border-b border-kth-navy/8 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
            Eat &amp; Drink
          </h2>
          <p className="mt-1 text-2xl font-extrabold text-kth-navy sm:text-3xl">
            Dinner the night before you sail
          </p>
          <p className="mt-2 text-sm text-kth-muted">
            Harbour-side and town-centre restaurants cruise passengers reach by
            taxi from CT1, CT2 or their hotel.
          </p>
          <div className="mt-6">
            <KthDoverRestaurantLinks places={doverRestaurants} />
          </div>
        </div>
      </section>
    </KthSectionShell>
  );
}
