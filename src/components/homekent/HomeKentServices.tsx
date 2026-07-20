import { ServiceIcon } from "@/components/homekent/ServiceIcon";
import { HOMEKENT_SERVICES } from "@/lib/homekent/content";
import { getAllHomeKentLandingPages } from "@/lib/homekent/landing-pages";
import { hkPath } from "@/lib/homekent/paths";
import Link from "next/link";

const SERVICE_LANDING_BY_ID: Record<string, string> = {
  regular: "regular-cleaning-dover",
  deep: "deep-cleaning-dover",
  airbnb: "airbnb-cleaning-dover",
  holiday: "holiday-home-cleaning-kent",
};

export async function HomeKentServices() {
  const landings = getAllHomeKentLandingPages();

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
          {await Promise.all(
            HOMEKENT_SERVICES.map(async (service) => {
              const landingSlug = SERVICE_LANDING_BY_ID[service.id];
              const href = landingSlug
                ? await hkPath(`/services/${landingSlug}`)
                : null;
              const landing = landings.find((page) => page.slug === landingSlug);

              return (
                <article
                  key={service.id}
                  className="rounded-xl border border-homekent-navy/8 bg-white p-6 shadow-sm transition hover:border-homekent-gold/40 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-homekent-navy/5 text-homekent-navy">
                    <ServiceIcon name={service.icon} />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-bold text-homekent-navy">
                    {href ? (
                      <Link href={href} className="hover:text-homekent-gold">
                        {service.title}
                      </Link>
                    ) : (
                      service.title
                    )}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-homekent-muted">
                    {service.description}
                  </p>
                  {href && landing ? (
                    <Link
                      href={href}
                      className="mt-4 inline-block text-sm font-semibold text-homekent-navy hover:text-homekent-gold"
                    >
                      Learn more →
                    </Link>
                  ) : null}
                </article>
              );
            }),
          )}
        </div>

        <p className="mt-10 text-center">
          <Link
            href={await hkPath("/services/end-of-tenancy-cleaning-dover")}
            className="text-sm font-semibold text-homekent-navy hover:text-homekent-gold"
          >
            Also offering end of tenancy cleaning in Dover →
          </Link>
        </p>
      </div>
    </section>
  );
}
