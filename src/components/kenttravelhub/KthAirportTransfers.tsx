import {
  KTH_AIRPORT_ROUTES,
  kthAirportGuidePrice,
} from "@/lib/kenttravelhub/content";
import { KTH_AIRPORT_JOURNEY_GUIDES } from "@/lib/kenttravelhub/home-dashboard";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

const AIRPORT_GUIDES: Record<string, string> = {
  gatwick: "gatwick-to-dover",
  heathrow: "heathrow-to-dover",
};

const journeyByCode = Object.fromEntries(
  KTH_AIRPORT_JOURNEY_GUIDES.map((guide) => [guide.code, guide]),
) as Record<string, (typeof KTH_AIRPORT_JOURNEY_GUIDES)[number]>;

export async function KthAirportTransfers() {
  const routes = await Promise.all(
    KTH_AIRPORT_ROUTES.map(async (route) => ({
      route,
      guideHref: AIRPORT_GUIDES[route.code]
        ? await kthPath(`/taxi/${AIRPORT_GUIDES[route.code]}`)
        : null,
      journey: journeyByCode[route.code],
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
          Private hire and taxi routes from Dover port and cruise terminal to
          London airports — typical journey times, fares and advice for cruise
          passengers catching a flight the same day.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {routes.map(({ route, guideHref, journey }) => {
            const inner = (
              <>
                <p className="font-serif text-xl font-bold group-hover:text-kth-sea">
                  {route.label}
                </p>
                <p className="mt-2 text-sm text-kth-muted">
                  From {route.from} to {route.to}
                </p>
                {journey && (
                  <>
                    <p className="mt-3 text-sm font-bold text-kth-gold">
                      Est. journey time: {journey.journeyTime}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-kth-muted">
                      {journey.cruiseNote}
                    </p>
                  </>
                )}
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
