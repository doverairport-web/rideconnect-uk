"use client";

import type { LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import { useEffect, useState } from "react";

const SEVERITY_STYLES = {
  ok: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warn: "border-amber-200 bg-amber-50 text-amber-900",
  alert: "border-red-200 bg-red-50 text-red-900",
} as const;

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function KthLiveTravel() {
  const [data, setData] = useState<LiveTravelSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/kenttravelhub/live");
        if (!res.ok) return;
        const json = (await res.json()) as LiveTravelSnapshot;
        if (!cancelled) setData(json);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const widgets = data
    ? [
        data.doverPortTraffic,
        data.ferryDelays,
        data.m20Traffic,
        {
          label: data.operationBrock.label,
          detail: data.operationBrock.detail,
          severity: data.operationBrock.severity,
        },
      ]
    : [];

  return (
    <section id="live" className="border-b border-kth-navy/8 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-kth-sea">
              Live now
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-kth-navy sm:text-4xl">
              Kent Travel Updates
            </h2>
          </div>
        {data && (
          <p className="text-sm text-kth-muted">
            Updated {formatUpdated(data.updatedAt)} · Cruise: {data.sources.cruise}
            · M20: {data.sources.m20} · Port: {data.sources.port}
          </p>
        )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl border border-kth-navy/8 bg-white"
              />
            ))}
          {!loading &&
            widgets.map((item) => (
              <div
                key={item.label}
                className={`rounded-xl border p-5 shadow-sm ${SEVERITY_STYLES[item.severity]}`}
              >
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed">{item.detail}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
