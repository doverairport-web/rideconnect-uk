import Link from "next/link";
import { FareGuideTables } from "@/components/FareGuideTables";
import {
  airports,
  fareCategories,
  formatFareCell,
  formatParis,
  townPricing,
} from "@/lib/pricing";

const fareNav = [
  { href: "#fares-hospitals", label: "Hospitals" },
  { href: "#fares-castles", label: "Castles" },
  { href: "#fares-london-stations", label: "London stations" },
  { href: "#fares-international", label: "Eurostar" },
  { href: "#fares-attractions", label: "Attractions" },
  { href: "#fares-retail", label: "Shopping" },
];

export function AirportPricing() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">Fixed Fare Guide</h2>
        <p className="mt-2 max-w-3xl text-muted">
          Dover district Hackney Fares — 05.03.2026. All prices from Dover unless
          stated. CAR (saloon) and MPV shown — to the nearest pound, one-way.
        </p>

        <h3 className="mt-10 text-lg font-semibold text-navy">Airport Transfers</h3>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-navy/10 shadow-sm">
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
                <th className="px-3 py-3 font-semibold text-navy">Paris</th>
              </tr>
            </thead>
            <tbody>
              {townPricing.map((row, index) => (
                <tr
                  key={row.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-cream/40"}
                >
                  <td className="px-4 py-3 font-medium text-navy">
                    <Link
                      href={`#${row.id}`}
                      className="hover:text-brand-green"
                    >
                      {row.town}
                    </Link>
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
                  <td className="whitespace-nowrap px-3 py-3 text-muted">
                    {formatParis(row.paris)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-navy/8 bg-cream p-4 text-sm text-muted">
            <p className="font-medium text-navy">Gatwick terminals</p>
            <p className="mt-1">
              South: CAR £191 / MPV £287. North: CAR £196 / MPV £294.
            </p>
          </div>
          <div className="rounded-xl border border-navy/8 bg-cream p-4 text-sm text-muted">
            <p className="font-medium text-navy">Heathrow terminals</p>
            <p className="mt-1">
              From CAR £248 / MPV £373 (T4 &amp; T5). T1–T3 up to CAR £255 / MPV
              £383.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-medium">East Kent zone pickups</p>
            <p className="mt-1">
              Fixed fares from Deal, Sandwich, Folkestone, Canterbury and Ashford
              are scaled from the Dover tariff by distance. Paris and other
              international routes — quote on request.
            </p>
          </div>
        </div>

        <nav className="mt-10 flex flex-wrap gap-2">
          {fareNav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full border border-navy/15 bg-cream px-3 py-1.5 text-xs font-medium text-navy hover:border-brand-green hover:text-brand-green"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <FareGuideTables categories={fareCategories} />

        <p className="mt-10 text-xs text-muted">
          Source: Hackney Fares 05.03.2026 — Dover district. Journeys outside the
          district boundary must be agreed between driver and hirer prior to hire.
        </p>

        <a
          href="#book"
          className="mt-8 inline-flex rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-green-dark"
        >
          Book online — confirm your fare
        </a>
      </div>
    </section>
  );
}
