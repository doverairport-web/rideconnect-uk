import { CustomerAppDownload, DriverWebLogin } from "@/components/AppStoreButtons";
import Image from "next/image";
import { ContactLinks } from "@/components/ContactLinks";
import { customerBookUrl, passengerWebUrl } from "@/lib/apps";
import { BRAND_LEGAL } from "@/lib/brand";
import { primaryPhone, telHref, whatsappHref } from "@/lib/contact";
import type { RideConnectSiteConfig } from "@/lib/rideconnect/sites";

type Props = {
  site: RideConnectSiteConfig;
};

export function RcFooter({ site }: Props) {
  const wa = whatsappHref(`Hi, I'd like to book a taxi with ${site.brandTitle}.`);

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
            href={customerBookUrl}
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
          <DriverWebLogin
            className="mt-6"
            variant="dark"
            title="Driver login"
            subtitle="Licensed drivers — sign in to accept jobs."
          />
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
