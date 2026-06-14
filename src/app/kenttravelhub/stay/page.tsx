import { KthDoverHotelLinks } from "@/components/kenttravelhub/KthDoverHotelLinks";
import { KthDoverRestaurantLinks } from "@/components/kenttravelhub/KthDoverRestaurantLinks";
import { KthSectionHubLinks } from "@/components/kenttravelhub/KthSectionHubLinks";
import { KthSectionShell } from "@/components/kenttravelhub/KthSectionShell";
import { KTH_STAY_KENT } from "@/lib/kenttravelhub/content";
import { kthBookingSearchUrl } from "@/lib/kenttravelhub/affiliates";
import { kthSectionPageMetadata } from "@/lib/kenttravelhub/section-metadata";
import {
  resolveDoverHotelLinks,
  resolveDoverRestaurantLinks,
  resolveSectionLinks,
} from "@/lib/kenttravelhub/resolve-hub-links";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import type { Metadata } from "next";
import Image from "next/image";

const section = KTH_SITE_SECTIONS[5];

export async function generateMetadata(): Promise<Metadata> {
  return kthSectionPageMetadata(section);
}

export default async function KthStaySectionPage() {
  const [links, doverHotels, doverRestaurants] = await Promise.all([
    resolveSectionLinks("stay"),
    resolveDoverHotelLinks(),
    resolveDoverRestaurantLinks(),
  ]);

  return (
    <KthSectionShell section={section}>
      <KthSectionHubLinks links={links} title="Hotels &amp; restaurants" />

      <section id="hotels" className="scroll-mt-24 border-b border-kth-navy/8 bg-kth-sand py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
            Dover hotels
          </h2>
          <p className="mt-1 text-2xl font-extrabold text-kth-navy sm:text-3xl">
            Book direct near the port
          </p>
          <p className="mt-2 text-sm text-kth-muted">
            Named hotels and B&amp;Bs — click through to their site or Booking.com.
          </p>
          <div className="mt-6">
            <KthDoverHotelLinks hotels={doverHotels} />
          </div>
        </div>
      </section>

      <section id="restaurants" className="scroll-mt-24 border-b border-kth-navy/8 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
            Eat &amp; Drink
          </h2>
          <p className="mt-1 text-2xl font-extrabold text-kth-navy sm:text-3xl">
            Within 5 miles of Dover
          </p>
          <p className="mt-2 text-sm text-kth-muted">
            Website or Google Maps — Dover, Deal and the coast.
          </p>
          <div className="mt-6">
            <KthDoverRestaurantLinks places={doverRestaurants} />
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
            Search by area
          </h2>
          <p className="mt-1 text-lg font-bold text-kth-navy">
            More hotels across Kent
          </p>
          <p className="mt-2 text-sm text-kth-muted">
            Quick Booking.com search — Dover, cruise terminal, Canterbury, Folkestone
            and Deal.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {KTH_STAY_KENT.map((stay) => {
              const href = kthBookingSearchUrl(stay.search);
              return (
                <li key={stay.id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-3 rounded-lg border border-kth-navy/8 bg-white p-3 transition hover:border-kth-sea/35 hover:shadow-sm"
                  >
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={stay.image}
                        alt=""
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-kth-navy group-hover:text-kth-sea">
                        {stay.title}
                      </p>
                      <p className="text-xs font-semibold text-kth-gold">
                        from {stay.fromPrice}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-kth-muted">
                        {stay.description}
                      </p>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </KthSectionShell>
  );
}
