import { CustomerAppDownload, DriverWebLogin } from "@/components/AppStoreButtons";
import Image from "next/image";
import { ContactLinks } from "@/components/ContactLinks";
import { BRAND_NAME, siteHost } from "@/lib/brand";
import { customerBookUrl } from "@/lib/apps";
import { primaryPhone, telHref } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="inline-block rounded-lg bg-white p-2">
            <Image
              src="/rideconnect-logo.png"
              alt={BRAND_NAME}
              width={1024}
              height={682}
              className="h-10 w-auto"
            />
          </div>
          <p className="mt-4 text-sm text-white/70">
            Reliable taxis and private hire in Dover, Kent — airport, cruise port,
            stations, and hospital transfers.
          </p>
        </div>
        <div>
          <p className="font-medium text-brand-green">Customers</p>
          <p className="mt-3 text-sm text-white/70">
            Book online or call — no app download needed.
          </p>
          <a
            href={customerBookUrl}
            className="mt-4 inline-block text-sm font-semibold text-brand-green hover:underline"
          >
            Book online
          </a>
          <a
            href={`tel:${telHref(primaryPhone)}`}
            className="mt-2 block text-sm font-medium text-white/80 hover:text-brand-green"
          >
            Call {primaryPhone}
          </a>
          <CustomerAppDownload
            className="mt-6"
            variant="dark"
            title="RideConnect app"
            subtitle="Airport and cruise transfers — book and track online."
          />
        </div>
        <div>
          <p className="font-medium text-brand-green">Contact</p>
          <ContactLinks className="mt-3 text-sm text-white/80" />
        </div>
        <div className="md:col-span-4 md:border-t md:border-white/10 md:pt-8">
          <DriverWebLogin subtitle="Drivers on our network — sign in on your phone to accept jobs." />
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {BRAND_NAME} · {siteHost()}
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
