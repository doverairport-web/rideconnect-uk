"use client";

import type { LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import Link from "next/link";
import { useEffect, useState } from "react";

const SEVERITY_DOT = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  alert: "bg-red-500",
} as const;

export function KthArticleLiveSummary({ liveHref }: { liveHref: string }) {
  const [data, setData] = useState<LiveTravelSnapshot | null>(null);

  useEffect(() => {
    fetch("/api/kenttravelhub/live")
      .then((res) => res.json())
      .then((json: LiveTravelSnapshot) => setData(json))
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="mt-8 rounded-2xl border border-kth-navy/8 bg-white/80 px-5 py-4 text-sm text-kth-muted">
        Checking live Dover travel conditions…
      </div>
    );
  }

  const items = [
    data.doverPortTraffic,
    data.ferryDelays,
    data.m20Traffic,
    {
      label: data.operationBrock.label,
      detail: data.operationBrock.detail,
      severity: data.operationBrock.severity,
    },
  ];

  return (
    <aside
      aria-label="Live Dover travel summary"
      className="mt-8 rounded-2xl border border-kth-navy/8 bg-gradient-to-br from-white to-kth-sand/40 px-5 py-5 shadow-sm sm:px-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-kth-sea">
          Live travel snapshot
        </p>
        <Link
          href={liveHref}
          className="text-xs font-semibold text-kth-navy/70 transition hover:text-kth-sea"
        >
          Full live board →
        </Link>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-start gap-2.5 rounded-xl bg-white/70 px-3 py-2.5"
          >
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[item.severity]}`}
              aria-hidden
            />
            <div className="min-w-0 text-sm leading-snug">
              <span className="font-medium text-kth-navy">{item.label}</span>
              <span className="text-kth-muted"> — {item.detail}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
