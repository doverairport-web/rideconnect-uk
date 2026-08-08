import type { KthArticle } from "@/lib/kenttravelhub/articles";
import { getKthArticle } from "@/lib/kenttravelhub/articles";
import { KTH_EXPLORE_IMAGES, KTH_HERO_IMAGE } from "@/lib/kenttravelhub/brand";
import { KTH_NEWS_THUMBNAILS } from "@/lib/kenttravelhub/content";

const KTH_CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  Port: KTH_HERO_IMAGE,
  Ferries: KTH_HERO_IMAGE,
  Cruise:
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
  Traffic:
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
  Airports:
    "https://images.unsplash.com/photo-1436491865339-9a109c0ab05a?auto=format&fit=crop&w=800&q=80",
  Stay:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  "Visit Kent": KTH_EXPLORE_IMAGES.cliffs,
  Guides: KTH_HERO_IMAGE,
};

const KTH_PATH_IMAGES: Record<string, string> = {
  "/cruise": KTH_NEWS_THUMBNAILS["dover-cruise-terminal-guide"],
  "/cruise-terminal": KTH_NEWS_THUMBNAILS["dover-cruise-terminal-guide"],
  "/ferries": KTH_NEWS_THUMBNAILS["dover-ferry-dfds-po-updates"],
  "/live": KTH_HERO_IMAGE,
};

function toHeroSize(src: string): string {
  if (src.includes("unsplash.com")) {
    const url = new URL(src);
    url.searchParams.set("w", "1600");
    url.searchParams.set("q", "85");
    return url.toString();
  }
  return src;
}

/** Thumbnail or category fallback — undefined when no known-good image exists. */
export function getKthArticleImage(
  slug: string,
  category?: string,
): string | undefined {
  const mapped = KTH_NEWS_THUMBNAILS[slug];
  if (mapped) return mapped;
  if (category && KTH_CATEGORY_FALLBACK_IMAGES[category]) {
    return KTH_CATEGORY_FALLBACK_IMAGES[category];
  }
  return undefined;
}

/** Larger editorial hero image for article pages. */
export function getKthArticleHeroImage(article: Pick<KthArticle, "slug" | "category">): string | undefined {
  const base = getKthArticleImage(article.slug, article.category);
  return base ? toHeroSize(base) : undefined;
}

/** Image for curated guide lists that may link to articles or hub pages. */
export function getKthGuideListImage(item: {
  slug?: string;
  path?: string;
}): string | undefined {
  if (item.slug) {
    const article = getKthArticle(item.slug);
    return getKthArticleImage(item.slug, article?.category);
  }
  if (item.path && KTH_PATH_IMAGES[item.path]) {
    return KTH_PATH_IMAGES[item.path];
  }
  return undefined;
}
