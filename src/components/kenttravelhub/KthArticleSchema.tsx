import type { KthArticle } from "@/lib/kenttravelhub/articles";
import { kthArticleJsonLd } from "@/lib/kenttravelhub/schema";

type Props = {
  article: KthArticle;
};

export function KthArticleSchema({ article }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(kthArticleJsonLd(article)),
      }}
    />
  );
}
