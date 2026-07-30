import {
  buildTransferBookHref,
  buildTransferWhatsAppMessage,
  getAllNetworkTransferPages,
  getNetworkTransferPage,
} from "@/lib/rideconnect/transfer-pages";
import { getRideConnectSiteForRequest } from "@/lib/rideconnect/page-metadata";
import { rideConnectMetadata } from "@/lib/rideconnect/seo";
import { primaryPhone, telHref, whatsappHref } from "@/lib/contact";
import { RcTransferHeroBanner } from "@/components/rideconnect/RcTransferHeroBanner";
import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllNetworkTransferPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getNetworkTransferPage(slug);
  if (!page) return {};

  const host = (await headers()).get("host");
  const site = await getRideConnectSiteForRequest();
  if (page.siteIds && !page.siteIds.includes(site.id)) {
    return { robots: { index: false, follow: false } };
  }
  const base = rideConnectMetadata(site, host, `/transfers/${slug}`);

  return {
    ...base,
    title: page.title,
    description: page.description,
    openGraph: {
      ...base.openGraph,
      title: page.title,
      description: page.description,
    },
    twitter: {
      ...base.twitter,
      title: page.title,
      description: page.description,
    },
  };
}

export default async function NetworkTransferLandingPage({ params }: Props) {
  const { slug } = await params;
  const page = getNetworkTransferPage(slug);
  if (!page) notFound();

  const site = await getRideConnectSiteForRequest();
  if (page.siteIds && !page.siteIds.includes(site.id)) notFound();
  const siteBase = site.siteUrl.replace(/\/$/, "");
  const canonical = `${siteBase}/transfers/${slug}`;
  const bookHref = buildTransferBookHref(page);
  const waHref = whatsappHref(buildTransferWhatsAppMessage(page));
  const relatedPages = getAllNetworkTransferPages(site.id).filter(
    (related) => related.slug !== slug,
  );

  const serviceSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonical}#service`,
    name: page.h1,
    description: page.description,
    url: canonical,
    serviceType: page.serviceType ?? "Pre-booked airport taxi transfer",
    provider: {
      "@id": `${siteBase}/#localbusiness`,
    },
    areaServed: [
      { "@type": "City", name: "Dover" },
      { "@type": "AdministrativeArea", name: "Kent" },
    ],
  };

  if (page.guideFare) {
    serviceSchema.offers = {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: page.guideFare.car,
      availability: "https://schema.org/InStock",
      url: canonical,
      description: page.guideFare.mpv
        ? `Guide fare from £${page.guideFare.car} car / £${page.guideFare.mpv} MPV`
        : `Guide fare from £${page.guideFare.car}`,
    };
  }

  const faqSchema = page.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.h1,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
      <RcTransferHeroBanner slug={slug} title={page.h1} />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link
                href="/"
                className="font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-slate-800">{page.h1}</li>
          </ol>
        </nav>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {page.h1}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {page.description}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {page.highlights.map((item) => (
            <li
              key={item}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={bookHref}
            className="rounded-full bg-emerald-700 px-7 py-3 text-sm font-bold text-white hover:bg-emerald-800"
          >
            Book this transfer
          </Link>
          <a
            href={`tel:${telHref(primaryPhone)}`}
            className="rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Call {primaryPhone}
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-emerald-600/40 bg-emerald-50 px-7 py-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
          >
            WhatsApp
          </a>
        </div>

        <div className="mt-12 space-y-8">
          {page.sections.map((section) => (
            <section key={section.heading ?? section.paragraphs[0]}>
              {section.heading ? (
                <h2 className="text-xl font-bold text-slate-900">
                  {section.heading}
                </h2>
              ) : null}
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-base leading-relaxed text-slate-600"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        {page.faqs?.length ? (
          <section className="mt-14 border-t border-slate-200 pt-10">
            <h2 className="text-2xl font-bold text-slate-900">
              {page.h1} FAQs
            </h2>
            <div className="mt-6 space-y-6">
              {page.faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <nav
          aria-label="Related taxi services"
          className="mt-14 border-t border-slate-200 pt-10"
        >
          <h2 className="text-xl font-bold text-slate-900">
            Related taxi services
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedPages.map((related) => (
              <li key={related.slug}>
                <Link
                  href={`/transfers/${related.slug}`}
                  className="font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  {related.h1}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </article>
    </>
  );
}
