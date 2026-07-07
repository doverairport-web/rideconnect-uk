import { getAllKthArticles, getKthArticle } from "@/lib/kenttravelhub/articles";
import { KTH_NAME } from "@/lib/kenttravelhub/brand";
import { KTH_MOST_POPULAR_THIS_WEEK } from "@/lib/kenttravelhub/content";
import { getKthArticleImage, getKthGuideListImage } from "@/lib/kenttravelhub/article-images";
import { kthPath } from "@/lib/kenttravelhub/paths";
import { kthGuidesItemListJsonLd, kthPageMetadata, kthPageTitle } from "@/lib/kenttravelhub/seo";
import type { Metadata } from "next";
import { KthSafeImage } from "@/components/kenttravelhub/KthSafeImage";
import Link from "next/link";

const CATEGORY_ORDER = [
  "Port",
  "Ferries",
  "Cruise",
  "Traffic",
  "Airports",
  "Stay",
  "Visit Kent",
  "Guides",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  return kthPageMetadata({
    title: kthPageTitle("Travel Guides"),
    description:
      "Kent and Dover travel guides — port waiting times, cruise terminal, DFDS & P&O ferries, M20 traffic, airports and places to visit.",
    path: "/news",
  });
}

export default async function KentTravelHubNewsIndexPage() {
  const articles = getAllKthArticles();
  const links = await Promise.all(
    articles.map(async (article) => ({
      article,
      href: await kthPath(`/news/${article.slug}`),
      image: getKthArticleImage(article.slug, article.category),
    })),
  );
  const popularLinks = await Promise.all(
    KTH_MOST_POPULAR_THIS_WEEK.map(async (item) => {
      const article = item.slug ? getKthArticle(item.slug) : undefined;
      const href = item.path
        ? await kthPath(item.path)
        : item.slug
          ? await kthPath(`/news/${item.slug}`)
          : await kthPath("/news");

      return {
        title: item.title,
        href,
        image: getKthGuideListImage(item),
        excerpt: article?.excerpt,
      };
    }),
  );
  const byCategory = CATEGORY_ORDER.map((category) => ({
    category,
    items: links.filter(({ article }) => article.category === category),
  })).filter((group) => group.items.length > 0);

  const itemListLd = kthGuidesItemListJsonLd(articles);

  return (
    <section className="py-14 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold text-kth-navy sm:text-4xl">
          Kent Travel Guides
        </h1>
        <p className="mt-4 max-w-3xl text-kth-muted">
          Practical guides for the journeys people search every day — Dover port
          queues, cruise terminal, DFDS and P&amp;O ferries, M20 and Operation
          Brock, airport routes, and the best of Kent to visit.
        </p>

        <div className="mt-10 rounded-2xl border border-kth-sea/20 bg-kth-sand/40 p-6 sm:p-8">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-kth-sea">
            Travel guides
          </p>
          <p className="mt-1 text-sm font-semibold text-kth-navy">{KTH_NAME}</p>
          <h2 className="mt-2 text-xl font-extrabold text-kth-navy sm:text-2xl">
            🔥 Most Popular This Week
          </h2>
          <ol className="mt-5 space-y-3">
            {popularLinks.map((item, index) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="group flex gap-4 rounded-xl border border-kth-navy/8 bg-white p-4 transition hover:border-kth-sea/35 hover:shadow-sm"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-kth-navy text-xs font-extrabold text-kth-gold">
                    {index + 1}
                  </span>
                  {item.image && (
                    <div className="relative hidden h-14 w-20 shrink-0 overflow-hidden rounded-md sm:block">
                      <KthSafeImage
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-kth-navy group-hover:text-kth-sea">
                      {item.title}
                    </p>
                    {item.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm text-kth-muted">
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 space-y-12">
          {byCategory.map(({ category, items }) => (
            <div key={category}>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-sea">
                {category}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {items.map(({ article, href, image }) => (
                  <article
                    key={article.slug}
                    className="group overflow-hidden rounded-xl border border-kth-navy/8 bg-white shadow-sm transition hover:border-kth-sea/30 hover:shadow-md"
                  >
                    {image && (
                      <div className="relative aspect-[16/9] overflow-hidden bg-kth-sand">
                        <KthSafeImage
                          src={image}
                          alt=""
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-kth-navy">
                        <Link href={href} className="hover:text-kth-sea">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-kth-muted">
                        {article.excerpt}
                      </p>
                      <p className="mt-3 text-xs text-kth-muted">
                        {article.readMinutes} min read · Updated {article.updatedAt}
                      </p>
                      <Link
                        href={href}
                        className="mt-4 inline-block text-sm font-semibold text-kth-sea hover:text-kth-navy"
                      >
                        Read guide →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
