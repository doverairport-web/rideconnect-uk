import { KthAdSense } from "@/components/kenttravelhub/KthAdSense";
import { KthArticleLiveSummary } from "@/components/kenttravelhub/KthArticleLiveSummary";
import { KthArticleRelatedGuides } from "@/components/kenttravelhub/KthArticleRelatedGuides";
import { KthArticleSchema } from "@/components/kenttravelhub/KthArticleSchema";
import { KthArticleSupplements } from "@/components/kenttravelhub/KthArticleSupplements";
import {
  KthBreadcrumbs,
  kthGuideBreadcrumbs,
} from "@/components/kenttravelhub/KthBreadcrumbs";
import { KthSafeImage } from "@/components/kenttravelhub/KthSafeImage";
import { getKthArticleHeroImage } from "@/lib/kenttravelhub/article-images";
import type { KthArticle } from "@/lib/kenttravelhub/articles";
import { kthPath } from "@/lib/kenttravelhub/paths";
import { kthBreadcrumbJsonLd, kthFaqJsonLd } from "@/lib/kenttravelhub/seo";
import Link from "next/link";

type Props = {
  article: KthArticle;
};

export async function KthArticlePage({ article }: Props) {
  const home = await kthPath();
  const news = await kthPath("/news");
  const live = await kthPath("/live");
  const cruise = await kthPath("/cruise");
  const midIndex = Math.ceil(article.sections.length / 2);
  const breadcrumbs = await kthGuideBreadcrumbs(article.title);
  const heroImage = getKthArticleHeroImage(article);
  const breadcrumbLd = kthBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/news" },
    { name: article.title, path: `/news/${article.slug}` },
  ]);
  const faqLd = article.faqs?.length ? kthFaqJsonLd(article.faqs) : null;

  return (
    <article>
      <KthArticleSchema article={article} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <header className="border-b border-kth-navy/8 bg-gradient-to-b from-kth-sand/30 to-white pb-10 pt-14 sm:pb-12 sm:pt-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <KthBreadcrumbs items={breadcrumbs} />

          <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-kth-sea">
            {article.category}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.12] tracking-tight text-kth-navy sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-sm text-kth-muted">
            Updated {article.updatedAt}
            <span aria-hidden className="mx-2 text-kth-navy/20">
              ·
            </span>
            {article.readMinutes} min read
          </p>
          <p className="mt-6 text-xl leading-relaxed text-kth-navy/80">
            {article.excerpt}
          </p>

          <KthArticleLiveSummary liveHref={live} />
        </div>
      </header>

      {heroImage && (
        <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-kth-sand shadow-md">
            <KthSafeImage
              src={heroImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-14">
        <KthAdSense placement="article-top" />

        <div className="kth-article-prose mt-10 space-y-12">
          {article.sections.map((section, index) => (
            <section key={index}>
              {section.heading && (
                <h2 className="font-serif text-2xl font-bold text-kth-navy sm:text-[1.75rem]">
                  {section.heading}
                </h2>
              )}
              <div
                className={`space-y-5 ${section.heading ? "mt-5" : ""}`}
              >
                {section.paragraphs.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="text-lg leading-[1.8] text-kth-navy/85"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {index + 1 === midIndex && (
                <KthAdSense placement="article-mid" className="mt-10" />
              )}
            </section>
          ))}
        </div>

        {article.tips.length > 0 && (
          <aside className="mt-14 rounded-2xl border border-kth-sea/15 bg-kth-sand/40 p-7 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-kth-navy">
              Quick tips
            </h2>
            <ul className="mt-5 space-y-3 text-base leading-relaxed text-kth-navy/80">
              {article.tips.map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-kth-sea"
                    aria-hidden
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {article.faqs && article.faqs.length > 0 && (
          <section className="mt-14">
            <h2 className="font-serif text-2xl font-bold text-kth-navy">
              Frequently asked questions
            </h2>
            <div className="mt-6 divide-y divide-kth-navy/8 border-y border-kth-navy/8">
              {article.faqs.map((faq) => (
                <div key={faq.question} className="py-6">
                  <h3 className="font-serif text-lg font-bold text-kth-navy">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-kth-muted">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <KthArticleRelatedGuides article={article} />
      <KthArticleSupplements article={article} />

      <section className="border-t border-kth-navy/8 bg-kth-sand/25 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-kth-navy">
            Continue exploring
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-kth-muted">
            Return to live Dover conditions, open the cruise calendar, or browse
            more Kent travel guides.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={home}
              className="rounded-full border border-kth-navy/12 bg-white px-5 py-2.5 text-sm font-semibold text-kth-navy transition hover:border-kth-sea/40 hover:text-kth-sea"
            >
              Live travel hub
            </Link>
            <Link
              href={live}
              className="rounded-full border border-kth-navy/12 bg-white px-5 py-2.5 text-sm font-semibold text-kth-navy transition hover:border-kth-sea/40 hover:text-kth-sea"
            >
              Live conditions
            </Link>
            <Link
              href={cruise}
              className="rounded-full border border-kth-navy/12 bg-white px-5 py-2.5 text-sm font-semibold text-kth-navy transition hover:border-kth-sea/40 hover:text-kth-sea"
            >
              Cruise schedule
            </Link>
            <Link
              href={news}
              className="rounded-full border border-kth-navy/12 bg-white px-5 py-2.5 text-sm font-semibold text-kth-navy transition hover:border-kth-sea/40 hover:text-kth-sea"
            >
              All guides
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
