import { KthLiveNewsTickerClient } from "@/components/kenttravelhub/KthLiveNewsTicker";
import { getAllKthArticles } from "@/lib/kenttravelhub/articles";
import { kthPath } from "@/lib/kenttravelhub/paths";

export async function KthLiveNewsTicker() {
  const articles = getAllKthArticles()
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .filter(
      (article, index, arr) =>
        arr.findIndex((entry) => entry.slug === article.slug) === index,
    )
    .slice(0, 14);

  const items = await Promise.all(
    articles.map(async (article) => ({
      id: article.slug,
      label: article.title,
      href: await kthPath(`/news/${article.slug}`),
      category: article.category,
    })),
  );

  return <KthLiveNewsTickerClient items={items} />;
}
