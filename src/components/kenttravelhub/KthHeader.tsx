import { KthLogo } from "@/components/kenttravelhub/KthLogo";
import { KthMobileNav } from "@/components/kenttravelhub/KthMobileNav";
import { KthWhatsAppChannelFollow } from "@/components/kenttravelhub/KthWhatsAppChannelFollow";
import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import { primaryPhone, telHref } from "@/lib/contact";
import Link from "next/link";

export async function KthHeader() {
  const home = await kthPath();
  const book = await kthBookUrl({ campaign: "header-book-taxi", content: "nav" });
  const contact = await kthPath("/contact");
  const guides = await kthPath("/news");

  const navLinks = [
    { href: home, label: "Home" },
    { href: await kthPath("/cruise"), label: "Cruise" },
    { href: await kthPath("/cruise-terminal"), label: "Cruise Terminal" },
    { href: await kthPath("/ferries"), label: "Ferries" },
    { href: await kthPath("/airports"), label: "Airports" },
    { href: await kthPath("/trains"), label: "Trains" },
    { href: await kthPath("/buses"), label: "Buses" },
    { href: await kthPath("/live"), label: "Live Travel" },
    { href: await kthPath("/visit"), label: "Visit Kent" },
    { href: await kthPath("/stay"), label: "Stay" },
    { href: await kthPath("/stay#restaurants"), label: "Eat & Drink" },
    { href: guides, label: "Guides" },
    { href: contact, label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-kth-navy/8 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <KthLogo homeHref={home} />

        <div className="ml-auto flex items-center gap-2 sm:gap-3 xl:ml-0 xl:flex-1 xl:justify-center">
          <KthMobileNav links={navLinks} bookHref={book} />

        <nav className="hidden flex-1 items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-kth-navy/80 xl:flex xl:gap-3 xl:text-[11px]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="whitespace-nowrap transition hover:text-kth-sea"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={`tel:${telHref(primaryPhone)}`}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-kth-navy/15 text-kth-navy transition hover:border-kth-sea hover:text-kth-sea sm:hidden"
            aria-label={`Call ${primaryPhone}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
          <a
            href={`tel:${telHref(primaryPhone)}`}
            className="hidden whitespace-nowrap rounded-md border border-kth-navy/15 px-3 py-2 text-xs font-semibold text-kth-navy transition hover:border-kth-sea hover:text-kth-sea sm:inline-flex"
          >
            {primaryPhone}
          </a>
          <Link
            href={book}
            className="rounded-md bg-kth-gold px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide text-kth-navy shadow-sm transition hover:bg-kth-gold-dark sm:px-4 sm:text-xs"
          >
            Book Taxi
          </Link>
          <KthWhatsAppChannelFollow variant="compact" />
          <div className="hidden items-center gap-1.5 rounded-md border border-kth-navy/10 px-2 py-1.5 text-xs font-medium text-kth-navy lg:flex">
            <span aria-hidden>🇬🇧</span>
            <span>EN</span>
          </div>
        </div>
      </div>
    </header>
  );
}
