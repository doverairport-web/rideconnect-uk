import { KTH_POWERED_BY } from "@/lib/kenttravelhub/brand";
import type { KthArticle } from "@/lib/kenttravelhub/articles";
import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

type Props = {
  article: KthArticle;
};

export async function KthArticleSupplements({ article }: Props) {
  const cruiseSchedule = await kthPath("/cruise");
  const book = await kthBookUrl({
    campaign: `article-${article.slug}`,
    content: "supplement",
  });

  return (
    <section
      aria-label="Useful travel links"
      className="border-t border-kth-navy/8 bg-white py-12 sm:py-14"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-kth-navy/8 bg-kth-sand/25 p-6 sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-kth-sea">
              Cruise calendar
            </p>
            <h2 className="mt-2 font-serif text-xl font-bold text-kth-navy">
              Ships in Dover this week
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-kth-muted">
              See which cruise ships are scheduled at the Port of Dover — today,
              tomorrow and the week ahead — alongside terminal notes for
              turnarounds and arrivals.
            </p>
            <Link
              href={cruiseSchedule}
              className="mt-5 inline-flex text-sm font-semibold text-kth-sea hover:text-kth-navy"
            >
              Open live cruise schedule →
            </Link>
          </article>

          <article className="rounded-2xl border border-kth-navy/8 bg-white p-6 sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-kth-muted">
              Transport partner
            </p>
            <h2 className="mt-2 font-serif text-xl font-bold text-kth-navy">
              {article.slug === "dover-to-gatwick"
                ? "Dover to Gatwick taxi"
                : KTH_POWERED_BY}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-kth-muted">
              {article.slug === "dover-to-gatwick"
                ? "Kent Travel Hub is independent travel information. For a fixed-fare Dover to Gatwick taxi from £150, book with RideConnect UK on the specialist airport transfer site."
                : "Kent Travel Hub is independent travel information. If you need a pre-booked taxi, airport run or cruise transfer, our transport partner can arrange it online across Kent."}
            </p>
            <a
              href={
                article.slug === "dover-to-gatwick"
                  ? "https://dovertogatwicktaxi.com/transfers/dover-to-gatwick"
                  : book
              }
              className="mt-5 inline-flex text-sm font-semibold text-kth-navy/80 underline decoration-kth-sea/40 underline-offset-4 transition hover:text-kth-sea"
            >
              {article.slug === "dover-to-gatwick"
                ? "Book Dover to Gatwick taxi →"
                : "Visit transport partner →"}
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
