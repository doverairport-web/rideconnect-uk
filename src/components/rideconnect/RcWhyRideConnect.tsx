import { RC_WHY_CARDS } from "@/lib/rideconnect/content";

export function RcWhyRideConnect() {
  return (
    <section id="why" className="scroll-mt-24 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">Why RideConnect UK?</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Local drivers, fixed airport fares and a booking system built for Dover port,
          cruise and school transport.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RC_WHY_CARDS.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-navy/10 bg-cream/40 p-5"
            >
              <h3 className="font-semibold text-navy">{card.title}</h3>
              <p className="mt-2 text-sm text-muted">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
