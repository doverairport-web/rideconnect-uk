import { KthLogo } from "@/components/kenttravelhub/KthLogo";
import { KthMobileNav } from "@/components/kenttravelhub/KthMobileNav";
import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
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
          <Link
            href={book}
            className="text-[10px] font-semibold text-kth-muted transition hover:text-kth-sea sm:text-xs"
          >
            Transfers
          </Link>
          <div className="hidden items-center gap-1.5 rounded-md border border-kth-navy/10 px-2 py-1.5 text-xs font-medium text-kth-navy sm:flex">
            <span aria-hidden>🇬🇧</span>
            <span>EN</span>
          </div>
        </div>
      </div>
    </header>
  );
}
