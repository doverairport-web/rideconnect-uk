import { KTH_POPULAR_TRANSFERS } from "@/lib/kenttravelhub/content";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

export async function KthHomePopularTransfers() {
  const airports = await kthPath("/airports");
  const transfers = await Promise.all(
    KTH_POPULAR_TRANSFERS.map(async (route) => ({
      route,
      href: route.slug
        ? "isGuide" in route && route.isGuide
          ? await kthPath(`/news/${route.slug}`)
          : await kthPath(`/taxi/${route.slug}`)
        : null,
    })),
  );

  return (
    <section className="border-b border-kth-navy/8 bg-kth-sand py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
              Popular Transfers
            </h2>
            <p className="mt-1 max-w-xl text-sm text-kth-muted">
              Typical routes from Dover port, cruise terminal and town — guides
              and airport transfer pages.
            </p>
          </div>
          <Link
            href={airports}
            className="text-xs font-bold text-kth-sea hover:text-kth-navy"
          >
            All airport routes →
          </Link>
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {transfers.map(({ route, href }) => {
            const row = (
              <>
                <span className="text-lg" aria-hidden>
                  {route.icon === "van" ? "🚐" : "🚗"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-kth-navy">{route.label}</p>
                  <p className="text-xs font-bold text-kth-gold">From £{route.price}</p>
                </div>
              </>
            );

            if (href) {
              return (
                <li key={route.id}>
                  <Link
                    href={href}
                    className="flex items-start gap-3 rounded-xl border border-kth-navy/8 bg-white p-4 shadow-sm transition hover:border-kth-sea/30 hover:shadow-md"
                  >
                    {row}
                  </Link>
                </li>
              );
            }

            return (
              <li
                key={route.id}
                className="flex items-start gap-3 rounded-xl border border-kth-navy/8 bg-white p-4 shadow-sm"
              >
                {row}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
