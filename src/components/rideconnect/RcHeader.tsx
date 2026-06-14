import Link from "next/link";
import { customerBookUrl, passengerWebUrl } from "@/lib/apps";
import { primaryPhone, telHref, whatsappHref } from "@/lib/contact";
import type { RideConnectSiteConfig } from "@/lib/rideconnect/sites";
import { RcLogo } from "@/components/rideconnect/RcLogo";

const defaultNav = [
  { href: "#services", label: "Services" },
  { href: "#coverage", label: "Areas" },
  { href: "#why", label: "Why us" },
  { href: "/contact", label: "Contact" },
];

const doverNav = [
  { href: "#services", label: "Transfers" },
  { href: "#pricing", label: "Prices" },
  { href: "#areas", label: "Areas" },
  { href: "/contact", label: "Contact" },
];

const gatwickNav = [
  { href: "#fares", label: "Fares" },
  { href: "#book", label: "Book" },
  { href: "#app", label: "App" },
  { href: "/contact", label: "Contact" },
];

function navForSite(site: RideConnectSiteConfig) {
  if (site.id === "dovertogatwick") return gatwickNav;
  if (site.id === "dovertaxi") return doverNav;
  return defaultNav;
}

type Props = {
  site: RideConnectSiteConfig;
};

export function RcHeader({ site }: Props) {
  const navLinks = navForSite(site);
  const wa = whatsappHref(`Hi, I'd like to book a taxi with ${site.brandTitle}.`);

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/95 shadow-sm backdrop-blur">
      {site.showNetworkBanner ? (
        <div className="bg-brand-green/10 text-center text-xs font-medium text-navy">
          <span className="px-4 py-1.5 inline-block">{site.networkBannerText}</span>
        </div>
      ) : null}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <RcLogo site={site} priority />
        <nav className="hidden items-center gap-5 text-sm font-medium text-navy lg:flex">
          {navLinks.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-navy/80 hover:text-brand-green"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-navy/80 hover:text-brand-green"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href={`tel:${telHref(primaryPhone)}`}
            className="hidden rounded-full border border-brand-blue/30 px-3 py-2 text-sm font-medium text-brand-blue hover:bg-brand-blue/5 sm:inline-flex"
          >
            Call
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-[#25D366]/40 px-3 py-2 text-sm font-medium text-[#128C7E] hover:bg-[#25D366]/10 md:inline-flex"
          >
            WhatsApp
          </a>
          <a
            href={passengerWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-navy/15 px-3 py-2 text-sm font-medium text-navy/80 hover:border-brand-green hover:text-brand-green lg:inline-flex"
          >
            Passenger App
          </a>
          <Link
            href={customerBookUrl}
            className="rounded-full bg-brand-green px-3.5 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-green-dark sm:px-4"
          >
            Book Online
          </Link>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto border-t border-navy/5 px-4 py-2 text-xs font-medium text-navy/70 lg:hidden">
        <a href={`tel:${telHref(primaryPhone)}`} className="shrink-0 hover:text-brand-green">
          Call {primaryPhone}
        </a>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="shrink-0 hover:text-brand-green">
          WhatsApp
        </a>
        <a
          href={passengerWebUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 hover:text-brand-green"
        >
          Passenger App
        </a>
      </div>
    </header>
  );
}
