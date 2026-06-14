import Link from "next/link";
import { airports, doverAirportFares, formatFareCell } from "@/lib/pricing";

export function RcGatwickFares() {
  return (
    <section id="fares" className="scroll-mt-24 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">Fixed Fare Guide</h2>
        <p className="mt-2 max-w-3xl text-muted">
          Dover district Hackney Fares from Dover — CAR (saloon) and MPV, one-way to the
          nearest pound. Cruise terminal and port pickups available.
        </p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-navy/10 shadow-sm">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-navy/10 bg-cream">
                <th className="px-4 py-3 font-semibold text-navy">Airport</th>
                <th className="px-4 py-3 font-semibold text-navy">CAR</th>
                <th className="px-4 py-3 font-semibold text-navy">MPV</th>
              </tr>
            </thead>
            <tbody>
              {airports
                .filter((a) => a.code !== "city")
                .map((airport) => {
                  const fare = doverAirportFares[airport.code];
                  return (
                    <tr key={airport.code} className="border-b border-navy/5">
                      <td className="px-4 py-3 font-medium text-navy">
                        Dover → {airport.short}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {formatFareCell(fare).car}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {formatFareCell(fare).mpv}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">
          Book online for Gatwick, Heathrow, Stansted or Luton — add flight details in the
          notes.
        </p>
        <Link
          href="/book?type=airport"
          className="mt-6 inline-flex rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark"
        >
          Book airport transfer
        </Link>
      </div>
    </section>
  );
}
