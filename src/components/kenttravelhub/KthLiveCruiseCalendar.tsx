"use client";

import type { CruiseCalendar, CruiseScheduleEntry } from "@/lib/kenttravelhub/content";
import { useEffect, useMemo, useState } from "react";

type TabId = "tomorrow" | "week" | "month";

const TABS: { id: TabId; label: string }[] = [
  { id: "tomorrow", label: "Tomorrow" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

const EMPTY_CALENDAR: CruiseCalendar = {
  today: [],
  tomorrow: [],
  thisWeek: [],
  thisMonth: [],
  scheduleDate: "",
};

function groupByDate(entries: CruiseScheduleEntry[]): [string, CruiseScheduleEntry[]][] {
  const map = new Map<string, CruiseScheduleEntry[]>();
  for (const entry of entries) {
    const group = map.get(entry.dateLabel) ?? [];
    group.push(entry);
    map.set(entry.dateLabel, group);
  }
  return [...map.entries()];
}

function ShipRow({ entry }: { entry: CruiseScheduleEntry }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div className="min-w-0">
        <p className="font-semibold text-kth-navy">{entry.name}</p>
        <p className="mt-0.5 text-sm text-kth-muted">
          {entry.line} · {entry.terminal}
        </p>
      </div>
      <div className="text-right text-sm">
        <p className="font-bold text-kth-sea">Arr {entry.arrives}</p>
        {entry.departs && entry.departs !== "—" && (
          <p className="text-kth-muted">Dep {entry.departs}</p>
        )}
      </div>
    </li>
  );
}

function TabContent({
  entries,
  emptyMessage,
}: {
  entries: CruiseScheduleEntry[];
  emptyMessage: string;
}) {
  if (entries.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-sm text-kth-muted">{emptyMessage}</p>
    );
  }

  const grouped = groupByDate(entries);
  const showDateHeaders = grouped.length > 1;

  return (
    <ul className="divide-y divide-kth-navy/8">
      {grouped.map(([dateLabel, ships]) => (
        <li key={dateLabel}>
          {showDateHeaders && (
            <p className="border-b border-kth-navy/8 bg-kth-sand/60 px-5 py-2 text-xs font-bold uppercase tracking-wide text-kth-sea">
              {dateLabel}
            </p>
          )}
          <ul className="divide-y divide-kth-navy/8">
            {ships.map((ship) => (
              <ShipRow key={`${ship.date}-${ship.name}-${ship.arrives}`} entry={ship} />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export function KthLiveCruiseCalendar() {
  const [calendar, setCalendar] = useState<CruiseCalendar>(EMPTY_CALENDAR);
  const [tab, setTab] = useState<TabId>("tomorrow");
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
    const interval = setInterval(load, 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const todayHeadline = useMemo(() => {
    if (loading) return "Checking live schedule…";
    if (calendar.today.length === 0) return "No cruise ships at Dover today";
    if (calendar.today.length === 1) return calendar.today[0].name;
    return `${calendar.today.length} ships in port today`;
  }, [calendar.today, loading]);

  const tabEntries = useMemo(() => {
    switch (tab) {
      case "tomorrow":
        return calendar.tomorrow;
      case "week":
        return calendar.thisWeek;
      case "month":
        return calendar.thisMonth;
    }
  }, [tab, calendar]);

  const tabEmptyMessage = useMemo(() => {
    switch (tab) {
      case "tomorrow":
        return "No cruise ships scheduled at Dover tomorrow.";
      case "week":
        return "No further cruise calls in the next seven days.";
      case "month":
        return "No more cruise ships scheduled this month.";
    }
  }, [tab]);

  return (
    <section
      id="cruise"
      className="scroll-mt-24 border-b border-kth-navy/8 bg-white py-10 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-kth-sea">
              Live Cruise Calendar
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-kth-navy sm:text-3xl">
              Dover cruise ship schedule
            </h2>
          </div>
          {calendar.scheduleDate && (
            <p className="text-xs text-kth-muted">
              Updated from Port of Dover · {calendar.scheduleDate}
            </p>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-kth-navy/10 bg-gradient-to-br from-kth-navy to-kth-navy-light p-6 text-white shadow-lg sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wider text-kth-gold">
            Today
          </p>
          <p className="mt-2 text-2xl font-extrabold sm:text-3xl">
            <span aria-hidden className="mr-2">
              🚢
            </span>
            {todayHeadline}
          </p>
          {calendar.today.length > 0 && (
            <ul className="mt-4 space-y-2 border-t border-white/15 pt-4">
              {calendar.today.map((ship) => (
                <li
                  key={`${ship.name}-${ship.arrives}`}
                  className="flex flex-wrap items-center justify-between gap-2 text-sm text-white/90"
                >
                  <span className="font-semibold">{ship.name}</span>
                  <span>
                    Arr {ship.arrives}
                    {ship.departs && ship.departs !== "—" ? ` · Dep ${ship.departs}` : ""}
                    {" · "}
                    {ship.terminal}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-kth-navy/8 bg-white shadow-sm">
          <div
            className="flex border-b border-kth-navy/8"
            role="tablist"
            aria-label="Cruise schedule period"
          >
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={`flex-1 px-4 py-3.5 text-sm font-bold transition sm:px-6 ${
                  tab === item.id
                    ? "border-b-2 border-kth-sea bg-kth-sand/50 text-kth-navy"
                    : "text-kth-muted hover:bg-kth-sand/30 hover:text-kth-navy"
                }`}
              >
                {item.label}
                <span className="ml-1.5 text-xs font-semibold text-kth-muted">
                  ({item.id === "tomorrow"
                    ? calendar.tomorrow.length
                    : item.id === "week"
                      ? calendar.thisWeek.length
                      : calendar.thisMonth.length})
                </span>
              </button>
            ))}
          </div>

          <TabContent entries={tabEntries} emptyMessage={tabEmptyMessage} />
        </div>

        <p className="mt-4 text-center text-xs text-kth-muted">
          <a
            href="/cruise-terminal"
            className="font-semibold text-kth-sea hover:text-kth-navy"
          >
            Dover Cruise Terminal Guide
          </a>
          {" · "}
          Schedule from{" "}
          <a
            href="https://www.portofdover.com/cruise/schedule-tickets/"
            className="font-semibold text-kth-sea hover:text-kth-navy"
            target="_blank"
            rel="noopener noreferrer"
          >
            portofdover.com
          </a>
          {" · "}
          Refreshes every 5 minutes
        </p>
      </div>
    </section>
  );
}
