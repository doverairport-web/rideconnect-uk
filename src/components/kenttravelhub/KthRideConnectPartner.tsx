import { KTH_POWERED_BY } from "@/lib/kenttravelhub/brand";
import { getAllKthLandingPages } from "@/lib/kenttravelhub/landing-pages";
import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

export async function KthRideConnectPartner() {
  const book = await kthBookUrl({
    campaign: "partner-section",
    content: "homepage",
  });
  const pages = getAllKthLandingPages();
  const taxiLinks = await Promise.all(
    pages.map(async (page) => ({
      page,
      href: await kthPath(`/taxi/${page.slug}`),
    })),
  );

  const partnerCtas = [
    { label: "Book Taxi", href: book, primary: true },
    {
      label: "Airport Transfers",
      href: taxiLinks.find((l) => l.page.slug.includes("heathrow") || l.page.slug.includes("gatwick"))
        ?.href ?? book,
      primary: false,
    },
    {
      label: "Cruise Transfers",
      href:
        taxiLinks.find((l) => l.page.slug.includes("cruise"))?.href ?? book,
      primary: false,
    },
  ];

  return (
    <section id="partner" className="border-t border-kth-navy/10 bg-kth-sand py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-kth-muted">
          Transport partner
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-kth-navy sm:text-4xl">
          {KTH_POWERED_BY}
        </h2>
        <p className="mt-3 max-w-2xl text-kth-muted">
          Need a lift? Kent Travel Hub is independent travel information — when
          you want a pre-booked taxi, airport run or cruise transfer, our
          transport partner {KTH_POWERED_BY} handles online booking across Kent.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {partnerCtas.map((cta) => (
            <Link
              key={cta.label}
              href={cta.href}
              className={
                cta.primary
                  ? "rounded-full bg-kth-accent px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-kth-accent-dark"
                  : "rounded-full border border-kth-navy/15 bg-white px-5 py-3 text-sm font-semibold text-kth-navy transition hover:border-kth-sea/40 hover:text-kth-sea"
              }
            >
              {cta.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {taxiLinks.map(({ page, href }) => (
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
