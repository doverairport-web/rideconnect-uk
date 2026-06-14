import {
  KTH_FERRY_TOPICS,
  KTH_STAY_KENT,
} from "@/lib/kenttravelhub/content";
import { KthDoverHotelLinks } from "@/components/kenttravelhub/KthDoverHotelLinks";
import { KthDoverRestaurantLinks } from "@/components/kenttravelhub/KthDoverRestaurantLinks";
import { kthBookingSearchUrl } from "@/lib/kenttravelhub/affiliates";
import {
  resolveDoverHotelLinks,
  resolveDoverRestaurantLinks,
} from "@/lib/kenttravelhub/resolve-hub-links";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Image from "next/image";
import Link from "next/link";

type Props = {
  waitingTimesGuide: string;
};

export async function KthCompactInfo({ waitingTimesGuide }: Props) {
  const doverHotels = await resolveDoverHotelLinks();
  const doverRestaurants = await resolveDoverRestaurantLinks();
  const guideLinks = {
    "dover-port-waiting-times": waitingTimesGuide,
  };

  return (
    <section className="border-t border-kth-navy/8 bg-kth-sand py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="scroll-mt-24">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
              Ferries &amp; Port
            </h2>
            <ul className="mt-4 space-y-3">
              {KTH_FERRY_TOPICS.map((topic) => {
                const href =
                  "guideSlug" in topic && topic.guideSlug
                    ? guideLinks[topic.guideSlug as keyof typeof guideLinks]
                    : null;
                const content = (
                  <div className="rounded-lg border border-kth-navy/8 bg-white p-4">
                    <p className="text-sm font-bold text-kth-navy">{topic.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-kth-muted">
                      {topic.description}
                    </p>
                  </div>
                );
                return (
                  <li key={topic.id}>
                    {href ? (
                      <Link href={href} className="block transition hover:opacity-90">
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div id="hotels" className="scroll-mt-24">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
              Stay in Kent
            </h2>
            <ul className="mt-4 space-y-3">
              {KTH_STAY_KENT.slice(0, 4).map((stay) => {
                const href = kthBookingSearchUrl(stay.search);
                return (
                  <li key={stay.id}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex gap-3 rounded-lg border border-kth-navy/8 bg-white p-3 transition hover:border-kth-sea/35 hover:shadow-sm active:scale-[0.99]"
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
                        <p className="mt-0.5 text-[11px] leading-snug text-kth-muted line-clamp-2">
                          {stay.description}
                        </p>
                      </div>
                      <span className="shrink-0 self-center text-kth-sea" aria-hidden>
                        →
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-kth-muted">
              Dover hotels &amp; B&amp;Bs — book direct
            </p>
            <div className="mt-3">
              <KthDoverHotelLinks hotels={doverHotels} />
            </div>
          </div>

          <div id="restaurants" className="scroll-mt-24">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
              Eat &amp; Drink
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-kth-muted">
              Within 5 miles of Dover port — click for website or map.
            </p>
            <div className="mt-3">
              <KthDoverRestaurantLinks places={doverRestaurants} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
