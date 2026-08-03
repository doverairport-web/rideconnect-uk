import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soukromá evidence",
  robots: { index: false, follow: false },
};

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream text-navy">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
