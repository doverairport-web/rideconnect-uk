import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import { primaryPhone, telHref, whatsappHref } from "@/lib/contact";
import Link from "next/link";

export async function KthHomeCtaBar() {
  const [book, live] = await Promise.all([
    kthBookUrl({ campaign: "home-cta", content: "hero-bar" }),
    kthPath("/live"),
  ]);

  const whatsapp = whatsappHref(
    "Hi, I'd like to book a taxi from Kent Travel Hub.",
  );

  return (
    <div className="flex flex-wrap gap-2 sm:gap-2.5">
      <Link
        href={book}
        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-kth-gold px-4 py-2.5 text-sm font-extrabold text-kth-navy shadow-sm transition hover:bg-kth-gold-dark sm:flex-none"
      >
        Book Taxi
      </Link>
      <a
        href={`tel:${telHref(primaryPhone)}`}
        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15 sm:flex-none"
      >
        Call Now
      </a>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#25D366]/50 bg-[#25D366]/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#25D366]/25 sm:flex-none"
      >
        WhatsApp
      </a>
      <Link
        href={live}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-kth-sea/40 bg-kth-sea/20 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-kth-sea/30 sm:w-auto"
      >
        Check Live Board
      </Link>
    </div>
  );
}
