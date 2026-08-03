"use client";

import { KTH_HOME_SNAPSHOT_CARDS } from "@/lib/kenttravelhub/content";
import type { LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import Link from "next/link";
import { useEffect, useState } from "react";

const SEVERITY_DOT = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  alert: "bg-red-500",
} as const;

function cardDetail(
  card: (typeof KTH_HOME_SNAPSHOT_CARDS)[number],
  data: LiveTravelSnapshot | null,
): string {
  if (!data) return "Loading live data…";

  if (card.liveKey === "doverPortTraffic") {
    return data.doverPortTraffic.detail;
  }

  if (card.liveKey === "cruise") {
    const count = data.cruiseArrivals.length;
    if (count === 0) return "No cruise ships scheduled at Dover today";
    const first = data.cruiseArrivals[0];
    return count === 1
      ? `${first.name} · ${first.time}`
      : `${count} ships today — next: ${first.name} at ${first.time}`;
  }

  if (card.id === "airports") {
    return "Gatwick, Heathrow, Stansted & Luton — routes, times and travel options from Dover.";
  }

  return "White Cliffs, Dover Castle, Canterbury Cathedral and the Kent coast.";
}

export function KthHomeSnapshot() {
  const [data, setData] = useState<LiveTravelSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/kenttravelhub/live");
        if (!res.ok) return;
        const json = (await res.json()) as LiveTravelSnapshot;
        if (!cancelled) setData(json);
      } catch {
        /* ignore */
      }
    }

    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative z-10 -mt-10 pb-4 sm:-mt-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KTH_HOME_SNAPSHOT_CARDS.map((card) => {
            const severity =
              card.liveKey === "doverPortTraffic" && data
                ? data.doverPortTraffic.severity
                : card.liveKey === "cruise" && data
                  ? data.cruiseArrivals.length > 0
                    ? "ok"
                    : "warn"
                  : null;

            return (
              <Link
                key={card.id}
                href={card.href}
                className="group rounded-2xl border border-kth-navy/8 bg-white p-6 shadow-lg transition hover:border-kth-sea/40 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-kth-sea">
                      {card.subtitle}
                    </p>
                    <h2 className="mt-1 font-serif text-xl font-bold text-kth-navy group-hover:text-kth-sea">
                      {card.title}
                    </h2>
                  </div>
                  {severity && (
                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${SEVERITY_DOT[severity]}`}
                      aria-hidden
                    />
                  )}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-kth-muted">
                  {cardDetail(card, data)}
                </p>
                <p className="mt-4 text-sm font-semibold text-kth-sea">
                  View details →
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
