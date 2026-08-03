"use client";

import type { CruiseCalendar } from "@/lib/kenttravelhub/content";
import Link from "next/link";
import { useEffect, useState } from "react";

const EMPTY: CruiseCalendar = {
  today: [],
  tomorrow: [],
  thisWeek: [],
  thisMonth: [],
  scheduleDate: "",
};

type Props = {
  cruiseHref: string;
};

export function KthCruiseTerminalLive({ cruiseHref }: Props) {
  const [calendar, setCalendar] = useState<CruiseCalendar>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/kenttravelhub/live");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.cruiseCalendar) {
          setCalendar(data.cruiseCalendar);
        }
      } catch {
        /* ignore */
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

  const headline = loading
    ? "Checking live schedule…"
    : calendar.today.length === 0
      ? "No cruise ships at Dover today"
      : calendar.today.length === 1
        ? calendar.today[0].name
        : `${calendar.today.length} ships in port today`;

  return (
    <div
      id="live"
      className="scroll-mt-24 rounded-2xl border border-kth-navy/10 bg-gradient-to-br from-kth-navy to-kth-navy-light p-6 text-white shadow-lg sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-kth-gold">
            Live cruise schedule
          </p>
          <p className="mt-3 text-2xl font-extrabold sm:text-3xl">
            <span aria-hidden className="mr-2">
              🚢
            </span>
            Today: {headline}
          </p>
        </div>
        <Link
          href={cruiseHref}
          className="text-sm font-semibold text-kth-gold hover:text-white"
        >
          Full calendar →
        </Link>
      </div>

      {calendar.today.length > 0 && (
        <ul className="mt-5 divide-y divide-white/10 border-t border-white/10 pt-4">
          {calendar.today.map((ship) => (
            <li
              key={`${ship.name}-${ship.arrives}`}
              className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-semibold">{ship.name}</p>
                <p className="text-sm text-white/75">
                  {ship.line} · {ship.terminal}
                </p>
              </div>
              <p className="text-sm font-bold text-kth-gold">
                Arr {ship.arrives}
                {ship.departs && ship.departs !== "—" ? ` · Dep ${ship.departs}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      {!loading && calendar.tomorrow.length > 0 && (
        <p className="mt-4 text-sm text-white/80">
          Tomorrow:{" "}
          <span className="font-semibold text-white">
            {calendar.tomorrow.map((s) => s.name).join(", ")}
          </span>
        </p>
      )}
    </div>
  );
}
