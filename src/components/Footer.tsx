import Image from "next/image";
import { BRAND_NAME, DEFAULT_EMAIL, siteHost } from "@/lib/brand";

const phone = process.env.NEXT_PUBLIC_PHONE || "";

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
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {phone ? (
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-brand-green">
                  {phone}
                </a>
              </li>
            ) : null}
            <li>
              <a href={`mailto:${DEFAULT_EMAIL}`} className="hover:text-brand-green">
                {DEFAULT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-brand-green">Bookings</p>
          <p className="mt-3 text-sm text-white/70">
            Online bookings go straight to RideConnect dispatch. A driver is
            assigned after confirmation — we will not promise a specific driver
            until the job is accepted.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {BRAND_NAME} · {siteHost()}
      </div>
    </footer>
  );
}
