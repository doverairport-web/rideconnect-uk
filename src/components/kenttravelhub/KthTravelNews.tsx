import { KTH_TRAVEL_NEWS } from "@/lib/kenttravelhub/content";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

export async function KthTravelNews() {
  const newsIndex = await kthPath("/news");
  const links = await Promise.all(
    KTH_TRAVEL_NEWS.map(async (article) => ({
      article,
      href: await kthPath(`/news/${article.slug}`),
    })),
  );

  return (
    <section id="news" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-kth-sea">
          Travel news
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-kth-navy sm:text-4xl">
          Popular Guides
        </h2>
        <p className="mt-3 max-w-2xl text-kth-muted">
          Practical Kent travel guides — port queues, cruise connections, M20
          traffic and Dover to London routes.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {links.map(({ article, href }) => (
            <article
              key={article.slug}
              className="rounded-xl border border-kth-navy/8 bg-white p-6 shadow-sm transition hover:border-kth-sea/30 hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-kth-sea">
                {article.category}
              </p>
              <h3 className="mt-2 font-serif text-xl font-bold text-kth-navy">
                <Link href={href} className="hover:text-kth-sea">
                  {article.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-kth-muted">
                {article.excerpt}
              </p>
              <Link
                href={href}
                className="mt-4 inline-block text-sm font-semibold text-kth-sea hover:text-kth-navy"
              >
                Read guide →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={newsIndex}
            className="text-sm font-semibold text-kth-navy hover:text-kth-sea"
          >
            View all travel guides →
          </Link>
        </div>
      </div>
    </section>
  );
}
