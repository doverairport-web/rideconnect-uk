import { KTH_POWERED_BY } from "@/lib/kenttravelhub/brand";
import { kthBookUrl } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

export async function KthBookBanner() {
  const book = await kthBookUrl({ campaign: "footer-banner", content: "cta" });

  return (
    <section
      id="partner"
      className="scroll-mt-20 border-t border-kth-navy/10 bg-kth-navy py-10 text-white sm:py-12"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-gold">
          Transport partner
        </p>
        <h2 className="mt-3 text-xl font-extrabold sm:text-2xl">
          Need a Dover or airport transfer?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
          Licensed taxis and private hire from the port, cruise terminal and across
          Kent — booked through {KTH_POWERED_BY}.
        </p>
        <Link
          href={book}
          className="mt-6 inline-flex rounded-lg bg-kth-gold px-6 py-3 text-sm font-extrabold text-kth-navy transition hover:bg-kth-gold-dark"
        >
          Book via {KTH_POWERED_BY} →
        </Link>
      </div>
    </section>
  );
}
