import { KthDoverHotelLinks } from "@/components/kenttravelhub/KthDoverHotelLinks";
import { KthDoverRestaurantLinks } from "@/components/kenttravelhub/KthDoverRestaurantLinks";
import {
  resolveDoverHotelLinks,
  resolveDoverRestaurantLinks,
} from "@/lib/kenttravelhub/resolve-hub-links";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

export async function KthStayTeaser() {
  const [hotels, restaurants, stay, restaurantsAnchor] = await Promise.all([
    resolveDoverHotelLinks(),
    resolveDoverRestaurantLinks(),
    kthPath("/stay"),
    kthPath("/stay#restaurants"),
  ]);

  return (
    <section className="border-t border-kth-navy/8 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
              Near the port
            </h2>
            <p className="mt-1 max-w-xl text-sm text-kth-muted">
              Hotels and restaurants within a few miles of Dover — for overnight
              stops before a ferry or cruise.
            </p>
          </div>
          <Link
            href={stay}
            className="text-xs font-bold text-kth-sea hover:text-kth-navy"
          >
            View all →
          </Link>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wide text-kth-muted">
              Hotels near Dover
            </h3>
            <div className="mt-3">
              <KthDoverHotelLinks hotels={hotels.slice(0, 4)} compact />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wide text-kth-muted">
              Eat &amp; Drink
            </h3>
            <div className="mt-3">
              <KthDoverRestaurantLinks places={restaurants.slice(0, 4)} compact />
            </div>
            <Link
              href={restaurantsAnchor}
              className="mt-3 inline-block text-xs font-bold text-kth-sea hover:text-kth-navy"
            >
              More restaurants →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
