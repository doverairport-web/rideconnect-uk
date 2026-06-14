import {
  KTH_HERO_IMAGE_ALT,
  KTH_NAME,
  KTH_OG_IMAGE,
  KTH_SITE_URL,
} from "@/lib/kenttravelhub/brand";
import type { KthArticle } from "@/lib/kenttravelhub/articles";
import { kthCanonicalUrl } from "@/lib/kenttravelhub/site";
import type { Metadata } from "next";

export function kthPageTitle(page: string): string {
  return `${page} | ${KTH_NAME}`;
}

export function kthOgImageUrl(): string {
  return new URL(KTH_OG_IMAGE, KTH_SITE_URL).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path?: string;
  openGraphType?: "website" | "article";
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
};

export async function kthPageMetadata({
  title,
  description,
  path = "",
  openGraphType = "website",
  keywords,
  publishedTime,
  modifiedTime,
}: PageMetadataInput): Promise<Metadata> {
  const canonical = await kthCanonicalUrl(path);
  const ogImage = kthOgImageUrl();

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: KTH_NAME,
      locale: "en_GB",
      type: openGraphType,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: KTH_HERO_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export async function kthArticleMetadata(article: KthArticle): Promise<Metadata> {
  const title = article.metaTitle ?? `${article.title} | ${KTH_NAME}`;
  const description = article.metaDescription ?? article.excerpt;

  return kthPageMetadata({
    title,
    description,
    path: `/news/${article.slug}`,
    openGraphType: "article",
    keywords: [...article.keywords],
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
}

export function kthBreadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  const base = KTH_SITE_URL.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${base}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export function kthFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function kthGuidesItemListJsonLd(
  articles: { title: string; slug: string; excerpt: string }[],
) {
  const base = KTH_SITE_URL.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kent Travel Guides",
    description:
      "Practical travel guides for Dover port, cruise terminal, ferries, M20 traffic and Kent destinations.",
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${base}/news/${article.slug}`,
      name: article.title,
      description: article.excerpt,
    })),
  };
}
