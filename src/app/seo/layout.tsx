import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO — Search Console",
  robots: { index: false, follow: false },
};

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b1f3a] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
