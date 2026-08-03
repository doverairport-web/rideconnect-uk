import { CustomerAppDownload } from "@/components/AppStoreButtons";
import Image from "next/image";
import Link from "next/link";
import { ContactLinks } from "@/components/ContactLinks";
import { customerBookHrefForSite, passengerWebUrl } from "@/lib/apps";
import { BRAND_LEGAL } from "@/lib/brand";
import { primaryPhone, telHref, whatsappHref } from "@/lib/contact";
import type { RideConnectSiteConfig } from "@/lib/rideconnect/sites";

type Props = {
  site: RideConnectSiteConfig;
};

export function RcFooter({ site }: Props) {
  const wa = whatsappHref(`Hi, I'd like to book a taxi with ${site.brandTitle}.`);
  const showLocalLandings =
    site.id === "dovertaxi" || site.id === "rideconnect" || site.id === "oriontaxis";
  const showGatwickTownLandings = site.id === "dovertogatwick";
  const gatwickExternal = "https://dovertogatwicktaxi.com";

  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="inline-block rounded-lg bg-white p-2.5">
            <Image
              src="/rideconnect-logo.png"
              alt={BRAND_LEGAL}
              width={180}
              height={120}
              className="h-9 w-auto max-w-[180px] object-contain"
            />
          </div>
          <p className="mt-3 text-sm font-semibold text-brand-green">{site.localSubtitle}</p>
          <p className="mt-2 text-sm text-white/70">
            Reliable taxis and private hire across Dover and Kent — airport, cruise port,
            school transport and local journeys.
          </p>
        </div>
        <div>
          <p className="font-medium text-brand-green">Book</p>
          <a
            href={customerBookHrefForSite(site.id)}
            className="mt-3 block text-sm font-semibold text-white hover:text-brand-green"
          >
            Book online
          </a>
          <a
            href={`tel:${telHref(primaryPhone)}`}
            className="mt-2 block text-sm text-white/80 hover:text-brand-green"
          >
            Call {primaryPhone}
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-sm text-white/80 hover:text-brand-green"
          >
            WhatsApp
          </a>
          <a
            href={passengerWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-sm text-white/80 hover:text-brand-green"
          >
            Passenger app
          </a>
          <CustomerAppDownload
            className="mt-6"
            variant="dark"
            title="Passenger app"
            subtitle="Book and track airport and cruise transfers."
          />
        </div>
        <div>
          <p className="font-medium text-brand-green">Contact</p>
          <ContactLinks className="mt-3 text-sm text-white/80" />
          <p className="mt-6 font-medium text-brand-green">Popular transfers</p>
          {showGatwickTownLandings ? (
            <>
              <Link
                href="/transfers/dover-to-gatwick"
                className="mt-3 block text-sm text-white/80 hover:text-brand-green"
              >
                Dover to Gatwick taxi
              </Link>
              <Link
                href="/transfers/deal-to-gatwick"
                className="mt-2 block text-sm text-white/80 hover:text-brand-green"
              >
                Deal to Gatwick taxi
              </Link>
              <Link
                href="/transfers/canterbury-to-gatwick"
                className="mt-2 block text-sm text-white/80 hover:text-brand-green"
              >
                Canterbury to Gatwick taxi
              </Link>
              <Link
                href="/transfers/folkestone-to-gatwick"
                className="mt-2 block text-sm text-white/80 hover:text-brand-green"
              >
                Folkestone to Gatwick taxi
              </Link>
              <Link
                href="/transfers/sandwich-to-gatwick"
                className="mt-2 block text-sm text-white/80 hover:text-brand-green"
              >
                Sandwich to Gatwick taxi
              </Link>
              <Link
                href="/transfers/dover-to-heathrow"
                className="mt-2 block text-sm text-white/80 hover:text-brand-green"
              >
                Dover to Heathrow taxi
              </Link>
            </>
          ) : (
            <>
              <a
                href={`${gatwickExternal}/transfers/dover-to-gatwick`}
                className="mt-3 block text-sm text-white/80 hover:text-brand-green"
              >
                Dover to Gatwick taxi
              </a>
              <Link
                href="/transfers/dover-to-heathrow"
                className="mt-2 block text-sm text-white/80 hover:text-brand-green"
              >
                Dover to Heathrow taxi
              </Link>
              <Link
                href="/transfers/dover-cruise-terminal-taxi"
                className="mt-2 block text-sm text-white/80 hover:text-brand-green"
              >
                Dover Cruise Terminal taxi
              </Link>
            </>
          )}
          {showLocalLandings ? (
            <>
              <Link
                href="/transfers/deal-taxi"
                className="mt-2 block text-sm text-white/80 hover:text-brand-green"
              >
                Deal taxi
              </Link>
              <Link
                href="/transfers/corporate-staff-transfers"
                className="mt-2 block text-sm text-white/80 hover:text-brand-green"
              >
                Corporate & staff transfers
              </Link>
            </>
          ) : null}
          {site.id === "dovertaxi" ? (
            <>
              <p className="mt-6 font-medium text-brand-green">Local taxi services</p>
              <Link
                href="/transfers/dover-ferry-port-taxi"
                className="mt-3 block text-sm text-white/80 hover:text-brand-green"
              >
                Dover Ferry Port taxi
              </Link>
              <Link
                href="/transfers/dover-priory-station-taxi"
                className="mt-2 block text-sm text-white/80 hover:text-brand-green"
              >
                Dover Priory Station taxi
              </Link>
              <Link
                href="/transfers/dover-bus-station-taxi"
                className="mt-2 block text-sm text-white/80 hover:text-brand-green"
              >
                Dover Bus Station taxi
              </Link>
            </>
          ) : null}
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {BRAND_LEGAL}
        <span className="mx-2">·</span>
        {new URL(site.siteUrl).host}
        <span className="mx-2">·</span>
        <a href="/contact" className="hover:text-white/80 hover:underline">
          Contact
        </a>
        <span className="mx-2">·</span>
        <a href="/privacy" className="hover:text-white/80 hover:underline">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
