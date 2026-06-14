import { HomeKentFooter } from "@/components/homekent/HomeKentFooter";
import { HomeKentHeader } from "@/components/homekent/HomeKentHeader";
import {
  HOMEKENT_NAME,
  HOMEKENT_SEO_LINE,
  HOMEKENT_SITE_URL,
  HOMEKENT_TAGLINE,
} from "@/lib/homekent/brand";
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
    title: `${HOMEKENT_NAME} | ${HOMEKENT_TAGLINE}`,
    description: `${HOMEKENT_SEO_LINE} Regular cleans, deep cleans, holiday lets and Airbnb changeovers.`,
    metadataBase: new URL(HOMEKENT_SITE_URL),
    alternates: { canonical },
    openGraph: {
      title: `${HOMEKENT_NAME} | ${HOMEKENT_TAGLINE}`,
      description: HOMEKENT_SEO_LINE,
      url: canonical,
      siteName: HOMEKENT_NAME,
      locale: "en_GB",
      type: "website",
    },
    ...(verification ? { verification: { google: verification } } : {}),
  };
}

export default function HomeKentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`homekent ${playfair.variable} min-h-screen bg-homekent-cream font-sans text-homekent-navy antialiased`}
    >
      <HomeKentHeader />
      <main>{children}</main>
      <HomeKentFooter />
    </div>
  );
}
