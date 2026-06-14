import { ServiceIcon } from "@/components/homekent/ServiceIcon";
import { HOMEKENT_SERVICES } from "@/lib/homekent/content";

export function HomeKentServices() {
  return (
    <section id="services" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-homekent-navy sm:text-4xl">
            Our Services
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-homekent-muted">
            Six tailored services for fine homes, coastal properties and
            premium holiday lets across Dover, Deal and St Margaret&apos;s.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HOMEKENT_SERVICES.map((service) => (
            <article
              key={service.id}
              className="rounded-xl border border-homekent-navy/8 bg-white p-6 shadow-sm transition hover:border-homekent-gold/40 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-homekent-navy/5 text-homekent-navy">
                <ServiceIcon name={service.icon} />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-homekent-navy">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-homekent-muted">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
