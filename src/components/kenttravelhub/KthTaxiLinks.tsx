import { getAllKthLandingPages } from "@/lib/kenttravelhub/landing-pages";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

export async function KthTaxiLinks() {
  const pages = getAllKthLandingPages();
  const links = await Promise.all(
    pages.map(async (page) => ({
      page,
      href: await kthPath(`/taxi/${page.slug}`),
    })),
  );

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-kth-sea">
          Book a transfer
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-kth-navy sm:text-4xl">
          Popular Dover Taxi Routes
        </h2>
        <p className="mt-3 max-w-2xl text-kth-muted">
          High-intent journeys — cruise terminal, ferry port and airport
          connections with online booking via RideConnect UK.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map(({ page, href }) => (
            <Link
              key={page.slug}
              href={href}
              className="rounded-xl border border-kth-navy/8 bg-white p-5 shadow-sm transition hover:border-kth-sea/30 hover:shadow-md"
            >
              <h3 className="font-serif text-lg font-bold text-kth-navy hover:text-kth-sea">
                {page.h1}
              </h3>
              <p className="mt-2 text-sm text-kth-muted line-clamp-2">
                {page.excerpt}
              </p>
              <p className="mt-3 text-sm font-semibold text-kth-sea">
                View &amp; book →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
