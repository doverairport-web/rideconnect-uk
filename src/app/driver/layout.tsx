import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "RideConnect Driver",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1a4d8c",
};

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
