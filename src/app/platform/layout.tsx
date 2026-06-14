import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RideConnect Dispatch",
  robots: { index: false, follow: false },
};

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
              RideConnect UK
            </p>
            <h1 className="text-xl font-bold sm:text-2xl">Dispatch</h1>
          </div>
          <a
            href="/driver"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white hover:border-brand-green hover:bg-neutral-900"
          >
            Driver app
          </a>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
