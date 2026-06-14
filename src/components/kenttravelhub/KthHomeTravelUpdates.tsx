import { KTH_NEWS_THUMBNAILS } from "@/lib/kenttravelhub/content";
import { getAllKthArticles } from "@/lib/kenttravelhub/articles";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Image from "next/image";
import Link from "next/link";

export async function KthHomeTravelUpdates() {
  const newsIndex = await kthPath("/news");
  const articles = getAllKthArticles()
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 4);

  const newsLinks = await Promise.all(
    articles.map(async (article) => ({
      article,
      href: await kthPath(`/news/${article.slug}`),
      image: KTH_NEWS_THUMBNAILS[article.slug],
    })),
  );

  return (
    <section className="border-b border-kth-navy/8 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
              Live Travel Updates
            </h2>
            <p className="mt-1 max-w-xl text-sm text-kth-muted">
              Short guides on port queues, M20 traffic, ferries and planning
              Dover &amp; Kent trips.
            </p>
          </div>
          <Link
            href={newsIndex}
            className="text-xs font-bold text-kth-sea hover:text-kth-navy"
          >
            All guides →
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {newsLinks.map(({ article, href, image }) => (
            <li key={article.slug}>
              <Link
                href={href}
                className="group flex gap-4 rounded-xl border border-kth-navy/8 bg-kth-sand/40 p-3 transition hover:border-kth-sea/30 hover:bg-kth-sand"
              >
                {image && (
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt=""
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="112px"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-kth-navy group-hover:text-kth-sea">
                    {article.title}
                  </p>
                  <p className="mt-1 text-[11px] text-kth-muted">
                    {new Date(article.updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
