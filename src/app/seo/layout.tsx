import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO OS — RideConnect",
  robots: { index: false, follow: false },
};

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0b1f3a] text-white">{children}</div>;
}
