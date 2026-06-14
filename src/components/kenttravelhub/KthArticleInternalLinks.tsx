import {
  getAllKthArticles,
  getKthArticle,
  type KthArticle,
} from "@/lib/kenttravelhub/articles";
import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

type Props = {
  article: KthArticle;
  /** Top of article (after intro) or bottom (before final CTA). */
  placement?: "top" | "bottom";
};

function resolveRelated(article: KthArticle): KthArticle[] {
  const fromSlugs = article.relatedSlugs
    .map((slug) => getKthArticle(slug))
    .filter((item): item is KthArticle => Boolean(item));

  if (fromSlugs.length > 0) return fromSlugs.slice(0, 4);

  return getAllKthArticles()
    .filter(
      (item) =>
        item.slug !== article.slug && item.category === article.category,
    )
    .slice(0, 3);
}

export async function KthArticleInternalLinks({
  article,
  placement = "top",
}: Props) {
  const book = await kthBookUrl({
    campaign: `article-${article.slug}`,
    content: placement === "top" ? "internal-top" : "internal-bottom",
  });
  const cruiseSchedule = await kthPath("/cruise");
  const guidesIndex = await kthPath("/news");
  const related = resolveRelated(article);
  const relatedLinks = await Promise.all(
    related.map(async (item) => ({
      item,
      href: await kthPath(`/news/${item.slug}`),
    })),
  );

  return (
    <nav
      aria-label="Kent Travel Hub — related pages"
      className={
        placement === "top"
          ? "mt-8 rounded-2xl border border-kth-navy/10 bg-kth-sand/70 p-5 sm:p-6"
          : "mt-10 rounded-2xl border border-kth-navy/10 bg-white p-5 shadow-sm sm:p-6"
      }
    >
      <div className="grid gap-6 md:grid-cols-3 md:gap-5">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-kth-navy">
            <span aria-hidden>➡️</span>
            Related Guides
          </h2>
          <ul className="mt-3 space-y-2">
            {relatedLinks.map(({ item, href }) => (
              <li key={item.slug}>
                <Link
                  href={href}
                  className="text-sm font-semibold leading-snug text-kth-sea hover:text-kth-navy hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={guidesIndex}
            className="mt-3 inline-block text-xs font-semibold text-kth-muted hover:text-kth-sea hover:underline"
          >
            All Dover &amp; Kent guides →
          </Link>
        </div>

        <div className="md:border-l md:border-kth-navy/8 md:pl-5">
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-kth-navy">
            <span aria-hidden>➡️</span>
            Book Taxi
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-kth-muted">
            Pre-book a Dover taxi or airport transfer — cruise terminal, port,
            Heathrow, Gatwick and London.
          </p>
          <Link
            href={book}
            className="mt-4 inline-flex rounded-lg bg-kth-navy px-4 py-2.5 text-sm font-bold text-white transition hover:bg-kth-navy-light"
          >
            Book taxi from Dover →
          </Link>
        </div>

        <div className="md:border-l md:border-kth-navy/8 md:pl-5">
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-kth-navy">
            <span aria-hidden>➡️</span>
            Cruise Schedule
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-kth-muted">
            See which cruise ships are in Dover today, tomorrow and this week —
            live from Port of Dover data.
          </p>
          <Link
            href={cruiseSchedule}
            className="mt-4 inline-flex rounded-lg border border-kth-sea/30 bg-white px-4 py-2.5 text-sm font-bold text-kth-sea transition hover:border-kth-sea hover:bg-kth-sand"
          >
            Live cruise calendar →
          </Link>
        </div>
      </div>
    </nav>
  );
}
