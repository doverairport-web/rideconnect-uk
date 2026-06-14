import {
  KTH_HERO_HEADLINE,
  KTH_HERO_SUBHEADLINE,
  KTH_HERO_IMAGE_ALT,
  KTH_NAME,
  KTH_OG_IMAGE,
  KTH_SEO_LINE,
  KTH_SITE_URL,
  KTH_TAGLINE,
} from "@/lib/kenttravelhub/brand";
import type { KthArticle } from "@/lib/kenttravelhub/articles";

const base = () => KTH_SITE_URL.replace(/\/$/, "");

export function kthOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base()}/#organization`,
    name: KTH_NAME,
    url: base(),
    logo: {
      "@type": "ImageObject",
      url: `${base()}${KTH_OG_IMAGE}`,
    },
    description: KTH_SEO_LINE,
  };
}

export function kthWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base()}/#website`,
    name: KTH_NAME,
    url: base(),
    description: KTH_SEO_LINE,
    inLanguage: "en-GB",
    about: KTH_TAGLINE,
    publisher: { "@id": `${base()}/#organization` },
  };
}

export function kthHomePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${base()}/#webpage`,
    name: KTH_HERO_HEADLINE,
    description: KTH_HERO_SUBHEADLINE,
    url: base(),
    isPartOf: { "@id": `${base()}/#website` },
    about: {
      "@type": "Thing",
      name: "Dover travel information",
      description:
        "Live Dover port traffic, ferry updates, cruise arrivals, M20 and Operation Brock status.",
    },
    inLanguage: "en-GB",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${base()}${KTH_OG_IMAGE}`,
      caption: KTH_HERO_IMAGE_ALT,
    },
  };
}

export function kthWebPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = `${base()}${normalized}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: { "@id": `${base()}/#website` },
    inLanguage: "en-GB",
  };
}

export function kthArticleJsonLd(article: KthArticle) {
  const url = `${base()}/news/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription ?? article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: KTH_NAME,
      url: base(),
    },
    publisher: {
      "@type": "Organization",
      name: KTH_NAME,
      url: base(),
    },
    mainEntityOfPage: url,
    articleSection: article.category,
    keywords: article.keywords.join(", "),
    inLanguage: "en-GB",
    isAccessibleForFree: true,
  };
}

export function kthSiteGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [kthOrganizationJsonLd(), kthWebSiteJsonLd()],
  };
}
