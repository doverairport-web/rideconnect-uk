import Image from "next/image";
import { ContactLinks } from "@/components/ContactLinks";
import { BRAND_NAME, siteHost } from "@/lib/brand";
import { primaryPhone, telHref } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
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
          <p className="font-medium text-brand-green">Contact</p>
          <ContactLinks className="mt-3 text-sm text-white/80" />
        </div>
        <div>
          <p className="font-medium text-brand-green">Bookings</p>
          <p className="mt-3 text-sm text-white/70">
            Online bookings go straight to RideConnect dispatch. A driver is
            assigned after confirmation — we will not promise a specific driver
            until the job is accepted.
          </p>
          <a
            href={`tel:${telHref(primaryPhone)}`}
            className="mt-4 inline-block text-sm font-medium text-brand-green hover:underline"
          >
            Call {primaryPhone}
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {BRAND_NAME} · {siteHost()}
      </div>
    </footer>
  );
}
