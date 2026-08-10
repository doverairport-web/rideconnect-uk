import { KthArticlePage } from "@/components/kenttravelhub/KthArticlePage";
import {
  getAllKthArticles,
  getKthArticle,
  isKthArticleRedirected,
} from "@/lib/kenttravelhub/articles";
import { KTH_SITE_URL } from "@/lib/kenttravelhub/brand";
import { kthPath } from "@/lib/kenttravelhub/paths";
import { kthArticleMetadata } from "@/lib/kenttravelhub/seo";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllKthArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Redirected guides must not publish their own indexable canonical.
  if (isKthArticleRedirected(slug) && slug === "dover-cruise-terminal-guide") {
    const canonical = `${KTH_SITE_URL.replace(/\/$/, "")}/cruise-terminal`;
    return {
      title: "Dover Cruise Terminal Guide",
      alternates: { canonical },
      robots: { index: false, follow: true },
    };
  }

  const article = getKthArticle(slug);
  if (!article) return {};

  return kthArticleMetadata(article);
}

export default async function KentTravelHubArticleRoute({ params }: Props) {
  const { slug } = await params;

  if (slug === "dover-cruise-terminal-guide") {
    redirect(await kthPath("/cruise-terminal"));
  }

  const article = getKthArticle(slug);
  if (!article) notFound();

  return <KthArticlePage article={article} />;
}
