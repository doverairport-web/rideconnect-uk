import { getAllKthArticles } from "@/lib/kenttravelhub/articles";
import { kthPath } from "@/lib/kenttravelhub/paths";
import { kthGuidesItemListJsonLd, kthPageMetadata, kthPageTitle } from "@/lib/kenttravelhub/seo";
import type { Metadata } from "next";
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
    })),
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

        <div className="mt-12 space-y-12">
          {byCategory.map(({ category, items }) => (
            <div key={category}>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-sea">
                {category}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {items.map(({ article, href }) => (
                  <article
                    key={article.slug}
                    className="rounded-xl border border-kth-navy/8 bg-white p-6 shadow-sm transition hover:border-kth-sea/30 hover:shadow-md"
                  >
                    <h3 className="text-xl font-bold text-kth-navy">
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
