import { HomeKentFooter } from "@/components/homekent/HomeKentFooter";
import { HomeKentHeader } from "@/components/homekent/HomeKentHeader";
import {
  HOMEKENT_KEYWORDS,
  HOMEKENT_NAME,
  HOMEKENT_SEO_LINE,
  HOMEKENT_SEO_TITLE,
  HOMEKENT_SITE_URL,
} from "@/lib/homekent/brand";
import { homekentLocalBusinessJsonLd } from "@/lib/homekent/schema";
import { homekentCanonicalUrl } from "@/lib/homekent/site";
import { googleSiteVerificationHomeKent } from "@/lib/search-console";
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-homekent-serif",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const canonical = await homekentCanonicalUrl();

  const verification = googleSiteVerificationHomeKent();

  return {
    title: HOMEKENT_SEO_TITLE,
    description: HOMEKENT_SEO_LINE,
    keywords: [...HOMEKENT_KEYWORDS],
    metadataBase: new URL(HOMEKENT_SITE_URL),
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: HOMEKENT_SEO_TITLE,
      description: HOMEKENT_SEO_LINE,
      url: canonical,
      siteName: HOMEKENT_NAME,
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: HOMEKENT_SEO_TITLE,
      description: HOMEKENT_SEO_LINE,
    },
    ...(verification ? { verification: { google: verification } } : {}),
  };
}

export default function HomeKentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = homekentLocalBusinessJsonLd();

  return (
    <div
      className={`homekent ${playfair.variable} min-h-screen bg-homekent-cream font-sans text-homekent-navy antialiased`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HomeKentHeader />
      <main>{children}</main>
      <HomeKentFooter />
    </div>
  );
}
