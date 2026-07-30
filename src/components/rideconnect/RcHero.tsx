import Image from "next/image";
import Link from "next/link";
import { customerBookHrefForSite, passengerWebUrl } from "@/lib/apps";
import { RC_HERO_IMAGE } from "@/lib/rideconnect/content";
import type { RideConnectSiteConfig } from "@/lib/rideconnect/sites";

const HERO_ALT =
  "Dover harbour and White Cliffs — RideConnect UK taxis and airport transfers across Kent";

type Props = {
  site: RideConnectSiteConfig;
  showCorporateCtas?: boolean;
  /** Taller full-bleed treatment (default on all network sites). */
  tall?: boolean;
};

export function RcHero({
  site,
  showCorporateCtas = false,
  tall = true,
}: Props) {
  const minH = tall
    ? "min-h-[72vh] sm:min-h-[80vh]"
    : "min-h-[56vh] sm:min-h-[60vh]";

  return (
    <section
      className={`relative isolate overflow-hidden bg-navy text-white ${minH}`}
    >
      <Image
        src={RC_HERO_IMAGE}
        alt={HERO_ALT}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_35%] scale-105 animate-[rc-hero-kenburns_18s_ease-out_forwards]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/92 via-navy/75 to-navy/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-navy/30" />

      <div
        className={`relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-14 pt-28 sm:px-6 sm:pb-20 lg:pb-24 ${minH}`}
      >
        {site.heroBadge ? (
          <p className="inline-flex w-fit rounded-full border border-brand-green/40 bg-brand-green/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-green animate-[rc-hero-fadeup_0.7s_ease-out_both]">
            {site.heroBadge}
          </p>
        ) : null}
        <p
          className={`text-sm font-semibold uppercase tracking-[0.2em] text-brand-green animate-[rc-hero-fadeup_0.7s_ease-out_both] ${site.heroBadge ? "mt-4" : ""}`}
        >
          {site.brandTitle}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl animate-[rc-hero-fadeup_0.8s_ease-out_0.08s_both]">
          {site.heroTitle}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-white/85 sm:text-xl animate-[rc-hero-fadeup_0.8s_ease-out_0.16s_both]">
          {site.heroSubtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3 animate-[rc-hero-fadeup_0.8s_ease-out_0.24s_both]">
          <Link
            href={customerBookHrefForSite(site.id)}
            className="rounded-full bg-brand-green px-7 py-3.5 font-semibold text-white shadow-lg hover:bg-brand-green-dark"
          >
            {site.id === "dovertogatwick" ? "Book Dover to Gatwick" : "Book Now"}
          </Link>
          {showCorporateCtas ? (
            <a
              href={passengerWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/30 bg-white/5 px-7 py-3.5 font-medium text-white backdrop-blur-sm hover:border-brand-green hover:text-brand-green"
            >
              Open Passenger App
            </a>
          ) : (
            <a
              href={passengerWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/30 bg-white/5 px-7 py-3.5 font-medium text-white backdrop-blur-sm hover:border-brand-green hover:text-brand-green"
            >
              Passenger App
            </a>
          )}
        </div>
      </div>

      <style>{`
        @keyframes rc-hero-kenburns {
          from { transform: scale(1.08); }
          to { transform: scale(1); }
        }
        @keyframes rc-hero-fadeup {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
