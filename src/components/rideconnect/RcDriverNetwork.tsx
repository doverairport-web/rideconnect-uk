import { DriverWebLogin } from "@/components/AppStoreButtons";
import { RC_DRIVER_BENEFITS } from "@/lib/rideconnect/content";

export function RcDriverNetwork() {
  return (
    <section id="drivers" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
            Driver Network
          </p>
          <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
            Join the RideConnect UK driver network
          </h2>
          <p className="mt-4 text-muted">
            Licensed private hire and taxi drivers across Kent — accept jobs from dispatch
            on your phone, with fair fees and airport and cruise work.
          </p>
          <ul className="mt-6 space-y-3">
            {RC_DRIVER_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex gap-2 text-sm text-navy/80">
                <span className="text-brand-green" aria-hidden>
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
          <DriverWebLogin variant="light" title="Become a driver" subtitle="Sign in or register interest via dispatch." />
        </div>
      </div>
    </section>
  );
}
