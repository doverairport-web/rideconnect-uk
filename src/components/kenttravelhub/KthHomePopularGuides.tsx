import { KTH_MOST_READ_GUIDES, KTH_NEWS_THUMBNAILS } from "@/lib/kenttravelhub/content";
import { getAllKthArticles, getKthArticle } from "@/lib/kenttravelhub/articles";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Image from "next/image";
import Link from "next/link";

export async function KthHomePopularGuides() {
  const newsIndex = await kthPath("/news");

  const curated = KTH_MOST_READ_GUIDES.map((slug) => getKthArticle(slug)).filter(
    (article) => article !== undefined,
  );

  const articles =
    curated.length >= 4
      ? curated
      : getAllKthArticles()
          .slice()
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          .slice(0, 6);

  const guideLinks = await Promise.all(
    articles.map(async (article, index) => ({
      article,
      href: await kthPath(`/news/${article.slug}`),
      image: KTH_NEWS_THUMBNAILS[article.slug],
      rank: index + 1,
    })),
  );

  return (
    <section className="border-b border-kth-navy/8 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-kth-sea">
              Travel guides
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-kth-navy sm:text-2xl">
              Most read before Dover
            </h2>
            <p className="mt-1 max-w-xl text-sm text-kth-muted">
              The guides travellers open most — port queues, M20, ferries, cruise
              terminal and airport routes.
            </p>
          </div>
          <Link
            href={newsIndex}
            className="text-xs font-bold text-kth-sea hover:text-kth-navy"
          >
            All guides →
          </Link>
        </div>

        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guideLinks.map(({ article, href, image, rank }) => (
            <li key={article.slug}>
              <Link
                href={href}
                className="group flex h-full gap-4 rounded-xl border border-kth-navy/8 bg-kth-sand/30 p-4 transition hover:border-kth-sea/35 hover:bg-kth-sand hover:shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-kth-navy text-xs font-extrabold text-kth-gold">
                  {rank}
                </span>
                {image && (
                  <div className="relative hidden h-16 w-20 shrink-0 overflow-hidden rounded-md sm:block">
                    <Image
                      src={image}
                      alt=""
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="80px"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-kth-sea">
                    {article.category}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold leading-snug text-kth-navy group-hover:text-kth-sea">
                    {article.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-kth-muted">
                    {article.excerpt}
                  </p>
                  <p className="mt-2 text-[11px] text-kth-muted">
                    {article.readMinutes} min read
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
