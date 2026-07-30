import Link from "next/link";
import { RC_SERVICES } from "@/lib/rideconnect/content";

export function RcServices() {
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-bold text-navy sm:text-3xl">Services</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Local taxis, airport transfers, cruise connections, school transport and account work —
          booked through RideConnect UK.
        </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {RC_SERVICES.map((service) => (
          <article
            key={service.id}
            className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm transition hover:border-brand-green/30"
          >
            <h3 className="text-lg font-semibold text-navy">{service.title}</h3>
            <p className="mt-2 text-sm text-muted">{service.description}</p>
            <Link
              href={service.href}
              className="mt-4 inline-block text-sm font-semibold text-brand-green hover:underline"
            >
              {service.id === "school" ? "Learn more" : "View transfer"} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
