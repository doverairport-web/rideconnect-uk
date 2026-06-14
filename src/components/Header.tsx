import Link from "next/link";
import { Logo } from "@/components/Logo";
import { siteHost } from "@/lib/brand";
import { primaryPhone, telHref } from "@/lib/contact";
import { pickupHubs } from "@/lib/towns";

const navLinks = [
  { href: "#services", label: "Transfers" },
  { href: "#pricing", label: "Prices" },
  { href: "#areas", label: "Areas" },
  { href: "/book", label: "Book" },
  { href: "/#drivers", label: "Drivers" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo priority />
        <nav className="hidden items-center gap-6 text-sm font-medium text-navy md:flex">
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
          <span className="text-navy/20">|</span>
          <a
            href="#dover"
            className="font-semibold text-navy hover:text-brand-green"
          >
            Dover
          </a>
          <details className="group relative">
            <summary className="cursor-pointer list-none text-navy/70 hover:text-brand-green [&::-webkit-details-marker]:hidden">
              Pickup Hubs
              <span className="ml-0.5 text-[10px] opacity-60" aria-hidden>
                ▾
              </span>
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 min-w-[11rem] rounded-xl border border-navy/10 bg-white py-2 shadow-lg">
              {pickupHubs.map((hub) => (
                <a
                  key={hub.id}
                  href={`#${hub.id}`}
                  className="block px-4 py-2 text-sm text-navy/80 hover:bg-cream hover:text-brand-green"
                >
                  From {hub.title}
                </a>
              ))}
            </div>
          </details>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#dover"
            className="text-sm font-medium text-navy/80 hover:text-brand-green md:hidden"
          >
            Dover
          </a>
          <a
            href="#areas"
            className="text-sm font-medium text-navy/80 hover:text-brand-green md:hidden"
          >
            Hubs
          </a>
          <Link
            href="/#drivers"
            className="text-sm font-medium text-navy/80 hover:text-brand-green md:hidden"
          >
            Drivers
          </Link>
          <a
            href={`tel:${telHref(primaryPhone)}`}
            className="hidden rounded-full border border-brand-blue/25 px-4 py-2 text-sm font-medium text-brand-blue hover:bg-brand-blue/5 sm:inline-block"
          >
            {primaryPhone}
          </a>
          <Link
            href="/book"
            className="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-green-dark"
          >
            Book now
          </Link>
        </div>
      </div>
      <p className="sr-only">{siteHost()}</p>
    </header>
  );
}
