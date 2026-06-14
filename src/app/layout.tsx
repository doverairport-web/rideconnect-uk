import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { headers } from "next/headers";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { GoogleAnalyticsPageViews } from "@/components/GoogleAnalyticsPageViews";
import { gaMeasurementIdForHost } from "@/lib/analytics";
import { isKentTravelHubHost } from "@/lib/kenttravelhub/host";
import { BRAND_NAME, SITE_URL } from "@/lib/brand";
import { SEO_DESCRIPTION, SEO_KEYWORDS, SEO_TITLE } from "@/lib/seo";
import { googleSiteVerificationForHost } from "@/lib/search-console";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  const verification = googleSiteVerificationForHost(host);

  return {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    keywords: SEO_KEYWORDS,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: SEO_TITLE,
      description: SEO_DESCRIPTION,
      url: SITE_URL,
      siteName: BRAND_NAME,
      locale: "en_GB",
      type: "website",
      images: [
        {
          url: "/rideconnect-logo.png",
          width: 1024,
          height: 682,
          alt: BRAND_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SEO_TITLE,
      description: SEO_DESCRIPTION,
      images: ["/rideconnect-logo.png"],
    },
    robots: { index: true, follow: true },
    ...(verification ? { verification: { google: verification } } : {}),
    icons: {
      icon: "/rideconnect-logo.png",
      apple: "/rideconnect-logo.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = (await headers()).get("host");
  const gaId = gaMeasurementIdForHost(host);
  const isKth = isKentTravelHubHost(host);

  return (
    <html lang="en-GB">
      <body
        className={`${geistSans.variable} antialiased`}
        data-ga-measurement-id={isKth ? "" : (gaId ?? "")}
        data-kth-site={isKth ? "true" : undefined}
      >
        <GoogleAnalytics />
        <GoogleAnalyticsPageViews />
        {children}
      </body>
    </html>
  );
}
