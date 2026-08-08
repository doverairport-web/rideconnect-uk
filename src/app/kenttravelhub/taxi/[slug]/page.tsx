import { getAllKthLandingPages, getKthLandingPage } from "@/lib/kenttravelhub/landing-pages";
import { kthPageMetadata } from "@/lib/kenttravelhub/seo";
import { KthLandingPageView } from "@/components/kenttravelhub/KthLandingPage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllKthLandingPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getKthLandingPage(slug);
  if (!page) return {};

  return kthPageMetadata({
    title: page.title,
    description: page.excerpt,
    path: `/taxi/${slug}`,
  });
}

export default async function KentTravelHubTaxiLandingRoute({ params }: Props) {
  const { slug } = await params;
  const page = getKthLandingPage(slug);
  if (!page) notFound();

  return <KthLandingPageView page={page} />;
}
