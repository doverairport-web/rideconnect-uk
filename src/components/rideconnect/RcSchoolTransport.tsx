import { RC_SCHOOL_FEATURES } from "@/lib/rideconnect/content";
import Link from "next/link";

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
          Weekly school transport for families across Dover and Kent — same driver where
          possible, with parent notifications and reliable pickup times.
        </p>
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
