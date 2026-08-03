import Link from "next/link";
import { RC_SCHOOL_FEATURES, RC_SCHOOL_RUN_EXAMPLES } from "@/lib/rideconnect/content";

export function RcSchoolTransport() {
  return (
    <section id="school-transport" className="scroll-mt-24 border-y border-navy/8 bg-cream py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
          School Transport
        </p>
        <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
          Regular school runs with trusted local drivers
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Weekly school transport for families across Dover and Kent — and contracted school
          runs for Kent County Council, including multi-stop college journeys with child-safety
          requirements and invoice billing.
        </p>

        <div className="mt-8 rounded-2xl border border-brand-green/25 bg-white px-5 py-4 sm:px-6">
          <p className="text-sm font-semibold text-navy">Council &amp; college school runs</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            We operate school-run contracts through Kent public transport programmes — morning
            pickups in Dover, shared journeys to East Kent College in Broadstairs, and afternoon
            return trips with door-to-door drop-offs. Child locks are used when specified on the
            booking.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {RC_SCHOOL_RUN_EXAMPLES.map((run) => (
            <article
              key={run.id}
              className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-semibold text-navy">{run.label}</h3>
                <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-medium text-brand-green">
                  {run.time}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{run.summary}</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-navy">Pick up</dt>
                  <dd className="mt-1 text-muted">
                    <ul className="list-inside list-disc space-y-0.5">
                      {run.pickups.map((stop) => (
                        <li key={stop}>{stop}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-navy">Drop off</dt>
                  <dd className="mt-1 text-muted">{run.dropOff}</dd>
                </div>
                <div className="rounded-xl bg-cream/80 px-3 py-2 text-muted">{run.notes}</div>
              </dl>
            </article>
          ))}
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {RC_SCHOOL_FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 rounded-xl border border-navy/10 bg-white px-5 py-4 text-sm font-medium text-navy"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <Link
          href="/contact"
          className="mt-8 inline-flex rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark"
        >
          Enquire about school transport
        </Link>
      </div>
    </section>
  );
}
