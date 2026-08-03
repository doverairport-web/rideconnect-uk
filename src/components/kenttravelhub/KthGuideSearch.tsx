"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type KthGuideSearchItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  href: string;
};

export type KthSearchTopic = {
  id: string;
  label: string;
  href: string;
};

type Props = {
  guides: KthGuideSearchItem[];
  topics: KthSearchTopic[];
  guidesIndexHref: string;
};

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase();
}

export function KthGuideSearch({ guides, topics, guidesIndexHref }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const normalized = normalizeQuery(query);

  const results = useMemo(() => {
    if (!normalized) return [];
    return guides
      .filter((guide) => {
        const haystack = `${guide.title} ${guide.excerpt} ${guide.category}`.toLowerCase();
        return haystack.includes(normalized);
      })
      .slice(0, 6);
  }, [guides, normalized]);

  return (
    <div className="relative max-w-xl">
      <label htmlFor="kth-guide-search" className="sr-only">
        Search guides and travel topics
      </label>
      <div className="flex overflow-hidden rounded-lg border border-white/20 bg-white/95 shadow-lg backdrop-blur-sm">
        <span className="flex items-center pl-3.5 text-kth-muted" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" strokeLinecap="round" />
          </svg>
        </span>
        <input
          id="kth-guide-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          placeholder="Search guides — M20, ferries, cruise, port queues…"
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-kth-navy placeholder:text-kth-muted/70 focus:outline-none"
          autoComplete="off"
        />
      </div>

      {open && normalized && results.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-kth-navy/10 bg-white py-1 shadow-xl">
          {results.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={guide.href}
                className="block px-4 py-2.5 transition hover:bg-kth-sand"
                onClick={() => setOpen(false)}
              >
                <p className="text-sm font-semibold text-kth-navy">{guide.title}</p>
                <p className="text-[11px] text-kth-muted">{guide.category}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {open && normalized && results.length === 0 && (
        <p className="absolute z-20 mt-1 w-full rounded-lg border border-kth-navy/10 bg-white px-4 py-3 text-sm text-kth-muted shadow-xl">
          No guides match —{" "}
          <Link href={guidesIndexHref} className="font-semibold text-kth-sea hover:underline">
            browse all guides
          </Link>
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={topic.href}
            className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90 transition hover:border-kth-gold/50 hover:bg-white/20"
          >
            {topic.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
