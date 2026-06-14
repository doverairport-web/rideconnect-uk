import { KthAdSense } from "@/components/kenttravelhub/KthAdSense";
import { KthArticleInternalLinks } from "@/components/kenttravelhub/KthArticleInternalLinks";
import { KthArticleSchema } from "@/components/kenttravelhub/KthArticleSchema";
import {
  KthBreadcrumbs,
  kthGuideBreadcrumbs,
} from "@/components/kenttravelhub/KthBreadcrumbs";
import { KthLiveStatusPanel } from "@/components/kenttravelhub/KthLiveStatusPanel";
import type { KthArticle } from "@/lib/kenttravelhub/articles";
import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import { kthBreadcrumbJsonLd, kthFaqJsonLd } from "@/lib/kenttravelhub/seo";
import Link from "next/link";

type Props = {
  article: KthArticle;
  showLivePanel?: boolean;
};

export async function KthArticlePage({ article, showLivePanel }: Props) {
  const book = await kthBookUrl({
    campaign: `article-${article.slug}`,
    content: "cta",
  });
  const home = await kthPath();
  const news = await kthPath("/news");
  const cruise = await kthPath("/cruise");
  const midIndex = Math.ceil(article.sections.length / 2);
  const breadcrumbs = await kthGuideBreadcrumbs(article.title);
  const breadcrumbLd = kthBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/news" },
    { name: article.title, path: `/news/${article.slug}` },
  ]);
  const faqLd = article.faqs?.length ? kthFaqJsonLd(article.faqs) : null;

  return (
    <article className="py-14 sm:py-20">
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

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <KthBreadcrumbs items={breadcrumbs} />

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-kth-sea">
          {article.category}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-kth-navy sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-sm text-kth-muted">
          Updated {article.updatedAt} · {article.readMinutes} min read
        </p>
        <p className="mt-6 text-lg leading-relaxed text-kth-muted">
          {article.excerpt}
        </p>

        <KthArticleInternalLinks article={article} placement="top" />

        <KthAdSense placement="article-top" className="mt-8" />

        {showLivePanel && (
          <div className="mt-8">
            <KthLiveStatusPanel />
          </div>
        )}

        <div className="mt-10 space-y-10">
          {article.sections.map((section, index) => (
            <section key={index}>
              {section.heading && (
                <h2 className="text-2xl font-extrabold text-kth-navy">
                  {section.heading}
                </h2>
              )}
              <div className={`space-y-4 ${section.heading ? "mt-4" : ""}`}>
                {section.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex} className="leading-relaxed text-kth-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
              {index + 1 === midIndex && (
                <KthAdSense placement="article-mid" className="mt-8" />
              )}
            </section>
          ))}
        </div>

        {article.tips.length > 0 && (
          <div className="mt-10 rounded-xl border border-kth-sea/20 bg-kth-sand p-6">
            <h2 className="text-xl font-extrabold text-kth-navy">Quick tips</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-kth-muted">
              {article.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {article.faqs && article.faqs.length > 0 && (
          <div className="mt-10 rounded-xl border border-kth-navy/8 bg-white p-6">
            <h2 className="text-xl font-extrabold text-kth-navy">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-5">
              {article.faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-bold text-kth-navy">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-kth-muted">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <KthArticleInternalLinks article={article} placement="bottom" />

        <div className="mt-12 rounded-xl bg-kth-navy p-8 text-white">
          <h2 className="text-2xl font-extrabold">Planning travel through Dover?</h2>
          <p className="mt-3 text-white/80">
            Return to the live travel hub for port traffic, cruise arrivals and
            ferry updates — or pre-book a transfer with our transport partner
            RideConnect UK.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={home}
              className="rounded-lg bg-kth-gold px-6 py-3 text-sm font-extrabold text-kth-navy hover:bg-kth-gold-dark"
            >
              Live travel hub
            </Link>
            <Link
              href={cruise}
              className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Cruise schedule
            </Link>
            <Link
              href={book}
              className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Book taxi
            </Link>
            <Link
              href={news}
              className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              All guides
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
