import Link from "next/link";
import { customerBookUrl, passengerWebUrl } from "@/lib/apps";
import { RC_HERO_IMAGE } from "@/lib/rideconnect/content";
import type { RideConnectSiteConfig } from "@/lib/rideconnect/sites";

type Props = {
  site: RideConnectSiteConfig;
  showCorporateCtas?: boolean;
};

export function RcHero({ site, showCorporateCtas = false }: Props) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${RC_HERO_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        {site.heroBadge ? (
          <p className="inline-flex rounded-full border border-brand-green/40 bg-brand-green/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-green">
            {site.heroBadge}
          </p>
        ) : null}
        <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-brand-green">
          {site.brandTitle}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {site.heroTitle}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-white/80">{site.heroSubtitle}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={customerBookUrl}
            className="rounded-full bg-brand-green px-6 py-3 font-semibold text-white shadow-lg hover:bg-brand-green-dark"
          >
            Book Now
          </Link>
          {showCorporateCtas ? (
            <a
              href={passengerWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/25 px-6 py-3 font-medium text-white hover:border-brand-green hover:text-brand-green"
            >
              Open Passenger App
            </a>
          ) : (
            <Link
              href={passengerWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/25 px-6 py-3 font-medium text-white hover:border-brand-green hover:text-brand-green"
            >
              Passenger App
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
