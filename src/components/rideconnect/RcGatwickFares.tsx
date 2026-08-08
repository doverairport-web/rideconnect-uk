import Link from "next/link";
import {
  airports,
  formatFareCell,
  getEastKentAirportPricing,
} from "@/lib/pricing";

const TOWN_ROUTE_HREF: Record<string, string> = {
  dover: "/transfers/dover-to-gatwick",
  deal: "/transfers/deal-to-gatwick",
  sandwich: "/transfers/sandwich-to-gatwick",
  folkestone: "/transfers/folkestone-to-gatwick",
  canterbury: "/transfers/canterbury-to-gatwick",
};

export function RcGatwickFares() {
  const zonePricing = getEastKentAirportPricing();

  return (
    <section id="fares" className="scroll-mt-24 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">
          Dover to Gatwick &amp; East Kent fixed fares
        </h2>
        <p className="mt-2 max-w-3xl text-muted">
          East Kent airport transfers — Dover district Hackney Fares from Dover (05.03.2026),
          with fixed pickup fares from Deal, Sandwich, Folkestone and Canterbury scaled to
          distance. CAR (saloon) and MPV, one-way to the nearest pound.
        </p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-navy/10 shadow-sm">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-navy/10 bg-cream">
                <th className="px-4 py-3 font-semibold text-navy">From</th>
                {airports.map((airport) => (
                  <th
                    key={airport.code}
                    className="px-3 py-3 font-semibold text-navy"
                  >
                    {airport.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zonePricing.map((row, index) => {
                const routeHref = TOWN_ROUTE_HREF[row.id];
                return (
                  <tr
                    key={row.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-cream/40"}
                  >
                    <td className="px-4 py-3 font-medium text-navy">
                      {routeHref ? (
                        <Link
                          href={routeHref}
                          className="hover:text-brand-green hover:underline"
                        >
                          {row.town}
                        </Link>
                      ) : (
                        row.town
                      )}
                      {row.note ? (
                        <span className="mt-0.5 block text-xs font-normal text-muted">
                          {row.note}
                        </span>
                      ) : null}
                    </td>
                    {airports.map((airport) => {
                      const fare = formatFareCell(row.prices[airport.code]);
                      return (
                        <td
                          key={airport.code}
                          className="whitespace-nowrap px-3 py-3 text-navy/90"
                        >
                          <span className="font-semibold text-navy">{fare.car}</span>
                          {fare.mpv ? (
                            <span className="block text-xs text-muted">{fare.mpv}</span>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-navy/8 bg-cream p-4 text-sm text-muted">
            <p className="font-medium text-navy">Dover — Gatwick terminals</p>
            <p className="mt-1">
              South: CAR £150 / MPV £225. North: CAR £150 / MPV £225.{" "}
              <Link
                href="/transfers/dover-to-gatwick"
                className="font-medium text-brand-green hover:underline"
              >
                Dover to Gatwick taxi details
              </Link>
            </p>
          </div>
          <div className="rounded-xl border border-navy/8 bg-cream p-4 text-sm text-muted">
            <p className="font-medium text-navy">Cruise &amp; port pickups</p>
            <p className="mt-1">
              Dover cruise terminal and ferry port — use Dover row above. Meet-and-greet
              available when pre-booked.
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">
          Book online for Gatwick, Heathrow, Stansted, Luton or London City — add flight
          details and pickup town in the notes.
        </p>
        <Link
          href="/book?type=airport"
          className="mt-6 inline-flex rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark"
        >
          Book Dover to Gatwick taxi
        </Link>
      </div>
    </section>
  );
}
