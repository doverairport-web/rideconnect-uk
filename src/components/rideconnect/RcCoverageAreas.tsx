import { RC_COVERAGE_AREAS } from "@/lib/rideconnect/content";

export function RcCoverageAreas() {
  return (
    <section id="coverage" className="scroll-mt-24 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">Coverage Areas</h2>
        <p className="mt-2 max-w-2xl text-muted">
          RideConnect UK operates across Dover district and Kent pickup hubs for airport
          and cruise transfers.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RC_COVERAGE_AREAS.map((area) => (
            <article
              key={area.name}
              className="rounded-2xl border border-navy/10 bg-cream/50 p-6"
            >
              <h3 className="text-lg font-semibold text-navy">{area.name}</h3>
              <p className="mt-2 text-sm text-muted">{area.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
