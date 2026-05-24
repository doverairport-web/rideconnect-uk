import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BRAND_NAME, SITE_URL } from "@/lib/brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} | Book a taxi in Dover, Kent`,
  description:
    "RideConnectUk — book taxis online in Dover. Airport, cruise port, station and hospital transfers. Reservations sent to dispatch.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: BRAND_NAME,
    description: "Book a taxi in Dover online — RideConnectUk dispatch.",
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
  icons: {
    icon: "/rideconnect-logo.png",
    apple: "/rideconnect-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${geistSans.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
