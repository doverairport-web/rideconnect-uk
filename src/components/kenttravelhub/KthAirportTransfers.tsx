import {
  KTH_AIRPORT_ROUTES,
  kthAirportGuidePrice,
} from "@/lib/kenttravelhub/content";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

const AIRPORT_GUIDES: Record<string, string> = {
  gatwick: "gatwick-to-dover",
  heathrow: "heathrow-to-dover",
};

export async function KthAirportTransfers() {
  const routes = await Promise.all(
    KTH_AIRPORT_ROUTES.map(async (route) => ({
      route,
      guideHref: AIRPORT_GUIDES[route.code]
        ? await kthPath(`/taxi/${AIRPORT_GUIDES[route.code]}`)
        : null,
    })),
  );

  return (
    <section id="airports" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-kth-sea">
          Airports
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-kth-navy sm:text-4xl">
          Airport Transfers from Dover
        </h2>
        <p className="mt-3 max-w-2xl text-kth-muted">
          Getting to Gatwick, Heathrow, Stansted and Luton from Dover — journey
          times, routes and what to expect with luggage after a cruise or ferry.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {routes.map(({ route, guideHref }) => {
            const inner = (
              <>
                <p className="font-serif text-xl font-bold group-hover:text-kth-sea">
                  {route.label}
                </p>
                <p className="mt-2 text-sm text-kth-muted">
                  From {route.from} to {route.to}
                </p>
                <p className="mt-4 text-sm font-semibold text-kth-sea">
                  Typical taxi fare from £{kthAirportGuidePrice(route.code)}
                  {guideHref ? " · View route guide →" : ""}
                </p>
              </>
            );

            if (guideHref) {
              return (
                <Link
                  key={route.code}
                  href={guideHref}
                  className="group rounded-xl border border-kth-navy/8 bg-white p-6 shadow-sm transition hover:border-kth-sea/30 hover:shadow-md"
                >
                  {inner}
                </Link>
              );
            }

            return (
              <div
                key={route.code}
                className="rounded-xl border border-kth-navy/8 bg-white p-6 shadow-sm"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
