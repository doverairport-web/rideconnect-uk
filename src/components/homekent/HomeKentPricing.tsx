import {
  HOMEKENT_AIRBNB_PRICING,
  HOMEKENT_DEEP_CLEAN_SIZES,
  HOMEKENT_EXTRA_SERVICES,
  HOMEKENT_PRICING_MAIN,
} from "@/lib/homekent/content";

export function HomeKentPricing() {
  return (
    <section id="pricing" className="bg-homekent-cream py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-homekent-navy sm:text-4xl">
            Pricing
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-homekent-muted">
            Transparent guide prices to get you started — larger properties,
            premium finishes and bespoke requirements are quoted individually
            after a free assessment.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HOMEKENT_PRICING_MAIN.map((plan) => (
            <div
              key={plan.id}
              className="rounded-xl border border-homekent-navy/8 bg-white p-6 shadow-sm"
            >
              <h3 className="font-serif text-lg font-bold text-homekent-navy">
                {plan.title}
              </h3>
              <p className="mt-3 text-2xl font-bold text-homekent-gold">
                {plan.from}
              </p>
              <p className="mt-2 text-sm text-homekent-muted">{plan.note}</p>
              <p className="mt-3 text-xs text-homekent-muted/80">{plan.market}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-homekent-navy/8 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-homekent-navy">
              Airbnb &amp; holiday let changeovers
            </h3>
            <p className="mt-2 text-sm text-homekent-muted">
              Fixed turnover prices for high-quality holiday lets and serviced
              apartments — linens, restocking and express turns on request.
            </p>
            <table className="mt-5 w-full text-sm">
              <thead>
                <tr className="border-b border-homekent-navy/10 text-left text-homekent-navy">
                  <th className="pb-2 font-semibold">Property</th>
                  <th className="pb-2 text-right font-semibold">From</th>
                </tr>
              </thead>
              <tbody className="text-homekent-muted">
                {HOMEKENT_AIRBNB_PRICING.map((row) => (
                  <tr
                    key={row.property}
                    className="border-b border-homekent-navy/5 last:border-0"
                  >
                    <td className="py-2.5 pr-4">{row.property}</td>
                    <td className="py-2.5 text-right font-semibold text-homekent-gold">
                      {row.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-homekent-muted">
              Linen laundry, restocking and express same-day turns available —
              ask for a quote.
            </p>
          </div>

          <div className="rounded-xl border border-homekent-navy/8 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-homekent-navy">
              Deep cleaning by property size
            </h3>
            <p className="mt-2 text-sm text-homekent-muted">
              One-off top-to-bottom cleans for larger homes, coastal properties
              and pre-arrival refreshes.
            </p>
            <table className="mt-5 w-full text-sm">
              <thead>
                <tr className="border-b border-homekent-navy/10 text-left text-homekent-navy">
                  <th className="pb-2 font-semibold">Size</th>
                  <th className="pb-2 text-right font-semibold">Guide price</th>
                </tr>
              </thead>
              <tbody className="text-homekent-muted">
                {HOMEKENT_DEEP_CLEAN_SIZES.map((row) => (
                  <tr
                    key={row.size}
                    className="border-b border-homekent-navy/5 last:border-0"
                  >
                    <td className="py-2.5 pr-4">{row.size}</td>
                    <td className="py-2.5 text-right font-semibold text-homekent-gold">
                      {row.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-homekent-navy/8 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-homekent-navy">
            Also available
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {HOMEKENT_EXTRA_SERVICES.map((item) => (
              <li
                key={item.service}
                className="flex items-center justify-between gap-4 border-b border-homekent-navy/5 pb-3 text-sm last:border-0 sm:last:border-b"
              >
                <span className="text-homekent-muted">{item.service}</span>
                <span className="shrink-0 font-semibold text-homekent-gold">
                  {item.price}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-center text-sm text-homekent-muted">
          Guide rates shown above — your final price depends on property size,
          condition and any extra requirements. Larger or specialist jobs are
          quoted personally.{" "}
          <a
            href="#quote"
            className="font-semibold text-homekent-navy hover:text-homekent-gold"
          >
            Request a free quote
          </a>{" "}
          with no obligation.
        </p>
      </div>
    </section>
  );
}
