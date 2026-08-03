import type { FareCategory } from "@/lib/pricing";
import { formatGuideCar, formatGuideMpv } from "@/lib/pricing";

type FareGuideTablesProps = {
  categories: FareCategory[];
};

export function FareGuideTables({ categories }: FareGuideTablesProps) {
  return (
    <div className="mt-12 space-y-10">
      {categories.map((category) => (
        <div key={category.id} id={`fares-${category.id}`} className="scroll-mt-24">
          <h3 className="text-lg font-semibold text-navy sm:text-xl">
            {category.title}
          </h3>
          <div className="mt-4 overflow-x-auto rounded-xl border border-navy/10 shadow-sm">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-navy/10 bg-cream">
                  <th className="px-4 py-3 font-semibold text-navy">Destination</th>
                  <th className="px-3 py-3 font-semibold text-navy">Postcode</th>
                  <th className="px-3 py-3 font-semibold text-navy">CAR</th>
                  <th className="px-3 py-3 font-semibold text-navy">MPV</th>
                </tr>
              </thead>
              <tbody>
                {category.fares.map((fare, index) => (
                  <tr
                    key={fare.name}
                    className={index % 2 === 0 ? "bg-white" : "bg-cream/40"}
                  >
                    <td className="px-4 py-2.5 font-medium text-navy">{fare.name}</td>
                    <td className="px-3 py-2.5 text-muted">{fare.postcode ?? "—"}</td>
                    <td className="px-3 py-2.5 font-semibold text-navy">
                      {formatGuideCar(fare.car)}
                    </td>
                    <td className="px-3 py-2.5 text-navy/90">
                      {formatGuideMpv(fare.mpv)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
