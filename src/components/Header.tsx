import { Logo } from "@/components/Logo";
import { siteHost } from "@/lib/brand";

const phone = process.env.NEXT_PUBLIC_PHONE || "";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo priority />
        <nav className="hidden items-center gap-8 text-sm font-medium text-navy md:flex">
          <a href="#services" className="text-navy/80 hover:text-brand-green">
            Services
          </a>
          <a href="#book" className="text-navy/80 hover:text-brand-green">
            Book online
          </a>
          <a href="#areas" className="text-navy/80 hover:text-brand-green">
            Areas
          </a>
        </nav>
        <div className="flex items-center gap-3">
          {phone ? (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="hidden rounded-full border border-brand-blue/25 px-4 py-2 text-sm font-medium text-brand-blue hover:bg-brand-blue/5 sm:inline-block"
            >
              Call {phone}
            </a>
          ) : null}
          <a
            href="#book"
            className="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-green-dark"
          >
            Book now
          </a>
        </div>
      </div>
      <p className="sr-only">{siteHost()}</p>
    </header>
  );
}
