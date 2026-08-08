import { KthSafeImage } from "@/components/kenttravelhub/KthSafeImage";
import {
  getAllKthArticles,
  getKthArticle,
  type KthArticle,
} from "@/lib/kenttravelhub/articles";
import { getKthArticleImage } from "@/lib/kenttravelhub/article-images";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

type Props = {
  article: KthArticle;
};

function resolveRelated(article: KthArticle): KthArticle[] {
  const fromSlugs = article.relatedSlugs
    .map((slug) => getKthArticle(slug))
    .filter((item): item is KthArticle => Boolean(item));

  if (fromSlugs.length > 0) return fromSlugs.slice(0, 4);

  return getAllKthArticles()
    .filter(
      (item) =>
        item.slug !== article.slug && item.category === article.category,
    )
    .slice(0, 4);
}

export async function KthArticleRelatedGuides({ article }: Props) {
  const guidesIndex = await kthPath("/news");
  const related = resolveRelated(article);

  if (related.length === 0) return null;

  const relatedLinks = await Promise.all(
    related.map(async (item) => ({
      item,
      href: await kthPath(`/news/${item.slug}`),
      image: getKthArticleImage(item.slug, item.category),
    })),
  );

  return (
    <section
      aria-labelledby="kth-related-guides"
      className="mt-16 border-t border-kth-navy/8 bg-kth-sand/35 py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-kth-sea">
              Keep reading
            </p>
            <h2
              id="kth-related-guides"
              className="mt-2 font-serif text-2xl font-bold text-kth-navy sm:text-3xl"
            >
              Related guides
            </h2>
          </div>
          <Link
            href={guidesIndex}
            className="text-sm font-semibold text-kth-sea hover:text-kth-navy"
          >
            All Kent guides →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedLinks.map(({ item, href, image }) => (
            <article
              key={item.slug}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-kth-navy/8 bg-white shadow-sm transition hover:border-kth-sea/25 hover:shadow-md"
            >
              {image && (
                <div className="relative aspect-[16/10] overflow-hidden bg-kth-sand">
                  <KthSafeImage
                    src={image}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-kth-sea">
                  {item.category}
                </p>
                <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-kth-navy group-hover:text-kth-sea">
                  <Link href={href}>{item.title}</Link>
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-kth-muted">
                  {item.excerpt}
                </p>
                <p className="mt-3 text-xs text-kth-muted">
                  {item.readMinutes} min read
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
