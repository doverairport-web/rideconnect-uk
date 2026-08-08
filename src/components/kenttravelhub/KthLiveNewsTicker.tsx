"use client";

import Link from "next/link";

export type KthNewsTickerItem = {
  id: string;
  label: string;
  href: string;
  category?: string;
};

type Props = {
  items: KthNewsTickerItem[];
};

export function KthLiveNewsTickerClient({ items }: Props) {
  const unique = items.filter(
    (item, index, arr) => arr.findIndex((entry) => entry.id === item.id) === index,
  );

  if (unique.length === 0) return null;

  return (
    <div
      className="relative overflow-hidden border-t border-kth-navy/15 bg-gradient-to-r from-sky-100 via-sky-200 to-sky-400"
      aria-label="Live travel news"
    >
      <div className="mx-auto flex max-w-7xl items-stretch">
        <div className="flex shrink-0 items-center gap-2 border-r border-white/40 bg-sky-500/25 px-4 py-2.5">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-kth-navy">
            Live
          </span>
        </div>

        <div className="relative min-w-0 flex-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-8 px-4">
            {unique.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-kth-navy transition hover:text-kth-navy-light"
              >
                {item.category && (
                  <span className="rounded bg-white/55 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-kth-navy/80">
                    {item.category}
                  </span>
                )}
                <span className="font-semibold group-hover:underline">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
