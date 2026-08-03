import {
  KTH_MOST_POPULAR_THIS_WEEK,
} from "@/lib/kenttravelhub/content";
import { getKthGuideListImage } from "@/lib/kenttravelhub/article-images";
import { getKthArticle } from "@/lib/kenttravelhub/articles";
import { KTH_NAME } from "@/lib/kenttravelhub/brand";
import { kthPath } from "@/lib/kenttravelhub/paths";
import { KthSafeImage } from "@/components/kenttravelhub/KthSafeImage";
import Link from "next/link";

export async function KthHomePopularGuides() {
  const newsIndex = await kthPath("/news");

  const guideLinks = await Promise.all(
    KTH_MOST_POPULAR_THIS_WEEK.map(async (item, index) => {
      const article = item.slug ? getKthArticle(item.slug) : undefined;
      const href = item.path
        ? await kthPath(item.path)
        : item.slug
          ? await kthPath(`/news/${item.slug}`)
          : newsIndex;

      return {
        title: item.title,
        href,
        image: getKthGuideListImage(item),
        category: article?.category,
        excerpt: article?.excerpt,
        readMinutes: article?.readMinutes,
        rank: index + 1,
      };
    }),
  );

  return (
    <section className="border-b border-kth-navy/8 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-kth-sea">
              Travel guides
            </p>
            <p className="mt-1 text-sm font-semibold text-kth-navy">{KTH_NAME}</p>
            <h2 className="mt-2 text-xl font-extrabold text-kth-navy sm:text-2xl">
              🔥 Most Popular This Week
            </h2>
            <p className="mt-1 max-w-xl text-sm text-kth-muted">
              The guides travellers open most — port queues, M20, cruise
              terminal, Heathrow routes and ferry updates.
            </p>
          </div>
          <Link
            href={newsIndex}
            className="text-xs font-bold text-kth-sea hover:text-kth-navy"
          >
            All guides →
          </Link>
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-1 lg:grid-cols-1">
          {guideLinks.map(
            ({ title, href, image, category, excerpt, readMinutes, rank }) => (
              <li key={title}>
                <Link
                  href={href}
                  className="group flex h-full gap-4 rounded-xl border border-kth-navy/8 bg-kth-sand/30 p-4 transition hover:border-kth-sea/35 hover:bg-kth-sand hover:shadow-sm sm:items-center"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-kth-navy text-xs font-extrabold text-kth-gold">
                    {rank}
                  </span>
                  {image && (
                    <div className="relative hidden h-14 w-20 shrink-0 overflow-hidden rounded-md sm:block">
                      <KthSafeImage
                        src={image}
                        alt=""
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug text-kth-navy group-hover:text-kth-sea sm:text-base">
                      {title}
                    </p>
                    {excerpt && (
                      <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-kth-muted">
                        {excerpt}
                      </p>
                    )}
                    {(category || readMinutes) && (
                      <p className="mt-1 text-[11px] text-kth-muted">
                        {[category, readMinutes ? `${readMinutes} min read` : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <span className="hidden shrink-0 text-sm font-semibold text-kth-sea group-hover:text-kth-navy sm:inline">
                    Read →
                  </span>
                </Link>
              </li>
            ),
          )}
        </ol>
      </div>
    </section>
  );
}
