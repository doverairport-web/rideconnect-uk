"use client";

import { KthHeroLiveCard } from "@/components/kenttravelhub/KthHeroLiveCard";
import type { CruiseCalendar, CruiseScheduleEntry } from "@/lib/kenttravelhub/content";
import type { FerryArrivalEntry } from "@/lib/kenttravelhub/fetchers/ferry-arrivals";
import { useEffect, useMemo, useState } from "react";

const EMPTY_CALENDAR: CruiseCalendar = {
  today: [],
  tomorrow: [],
  thisWeek: [],
  thisMonth: [],
  scheduleDate: "",
};

type DisplayShip = {
  ship: CruiseScheduleEntry;
  isToday: boolean;
};

type TickerItem =
  | { kind: "cruise"; id: string; ship: DisplayShip }
  | { kind: "ferry"; id: string; ferry: FerryArrivalEntry };

type Props = {
  cruiseHref: string;
  ferryHref: string;
  cruiseScheduleHref: string;
  cruiseScheduleLabel: string;
  ferryScheduleLabel: string;
};

function upcomingShips(calendar: CruiseCalendar, limit = 6): DisplayShip[] {
  const seen = new Set<string>();
  const result: DisplayShip[] = [];

  const add = (ships: CruiseScheduleEntry[], isToday: boolean) => {
    for (const ship of ships) {
      const key = `${ship.date}-${ship.name}-${ship.arrives}`;
      if (seen.has(key) || result.length >= limit) continue;
      seen.add(key);
      result.push({ ship, isToday });
    }
  };

  add(calendar.today, true);
  add(calendar.tomorrow, false);
  add(calendar.thisWeek, false);
  add(calendar.thisMonth, false);

  return result;
}

function interleaveItems(
  cruises: DisplayShip[],
  ferries: FerryArrivalEntry[],
): TickerItem[] {
  if (cruises.length === 0 && ferries.length === 0) return [];

  if (cruises.length === 0) {
    return ferries.map((ferry, i) => ({
      kind: "ferry" as const,
      id: `f-${ferry.operator}-${ferry.arrives}-${i}`,
      ferry,
    }));
  }

  if (ferries.length === 0) {
    return cruises.map((ship, i) => ({
      kind: "cruise" as const,
      id: `c-${ship.ship.date}-${ship.ship.name}-${i}`,
      ship,
    }));
  }

  const items: TickerItem[] = [];
  const count = Math.max(cruises.length, ferries.length);

  for (let i = 0; i < count; i++) {
    const cruise = cruises[i % cruises.length];
    const ferry = ferries[i % ferries.length];
    items.push({
      kind: "cruise",
      id: `c-${cruise.ship.date}-${cruise.ship.name}-${i}`,
      ship: cruise,
    });
    items.push({
      kind: "ferry",
      id: `f-${ferry.operator}-${ferry.arrives}-${i}`,
      ferry,
    });
  }

  return items;
}

const CRUISE_BAR = {
  green: "bg-emerald-400",
  amber: "bg-amber-400",
} as const;

const FERRY_BAR = {
  "in-port": "bg-emerald-400",
  arriving: "bg-sky-400",
  scheduled: "bg-amber-400",
} as const;

function cruiseBarColor(ship: CruiseScheduleEntry, isToday: boolean): keyof typeof CRUISE_BAR {
  if (!isToday) return "amber";
  const now = new Date();
  const [h, m] = ship.arrives.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return "green";
  const arrival = new Date(now);
  arrival.setHours(h, m, 0, 0);
  return now >= arrival ? "green" : "amber";
}

function TickerRow({
  item,
  cruiseHref,
  ferryHref,
}: {
  item: TickerItem;
  cruiseHref: string;
  ferryHref: string;
}) {
  if (item.kind === "cruise") {
    const { ship, isToday } = item.ship;
    const departs = ship.departs && ship.departs !== "—" ? ship.departs : "—";

    return (
      <a
        href={cruiseHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[4.25rem] shrink-0 gap-2 border-b border-white/10 py-2 transition hover:bg-white/5"
      >
        <span
          className={`w-1 shrink-0 self-stretch rounded-full ${CRUISE_BAR[cruiseBarColor(ship, isToday)]}`}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-white">{ship.name}</p>
          <p className="mt-0.5 text-[10px] text-white/55">
            {isToday ? "Cruise · today" : ship.dateLabel}
          </p>
          <div className="mt-1 grid grid-cols-2 gap-x-2 text-[10px] text-white/75">
            <span>Arrives {ship.arrives}</span>
            <span>Departs {departs}</span>
          </div>
        </div>
      </a>
    );
  }

  const { ferry } = item;
  return (
    <a
      href={ferryHref}
      className="flex h-[4.25rem] shrink-0 gap-2 border-b border-white/10 py-2 transition hover:bg-white/5"
    >
      <span
        className={`w-1 shrink-0 self-stretch rounded-full ${FERRY_BAR[ferry.status]}`}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-white">
          {ferry.operator}
        </p>
        <p className="mt-0.5 text-[10px] text-white/55">
          Ferry · {ferry.route}
        </p>
        <div className="mt-1 grid grid-cols-2 gap-x-2 text-[10px] text-white/75">
          <span>From France</span>
          <span>Arrives {ferry.arrives}</span>
        </div>
      </div>
    </a>
  );
}

export function KthHeroPortTicker({
  cruiseHref,
  ferryHref,
  cruiseScheduleHref,
  cruiseScheduleLabel,
  ferryScheduleLabel,
}: Props) {
  const [calendar, setCalendar] = useState<CruiseCalendar>(EMPTY_CALENDAR);
  const [ferries, setFerries] = useState<FerryArrivalEntry[]>([]);
  const [headerMode, setHeaderMode] = useState<"cruise" | "ferry">("cruise");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/kenttravelhub/live");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setCalendar(data.cruiseCalendar ?? EMPTY_CALENDAR);
          setFerries(data.ferryArrivals ?? []);
        }
      } catch {
        /* ignore */
      }
    }

    load();
    const interval = setInterval(load, 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderMode((mode) => (mode === "cruise" ? "ferry" : "cruise"));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const cruises = useMemo(() => upcomingShips(calendar, 6), [calendar]);
  const items = useMemo(() => interleaveItems(cruises, ferries), [cruises, ferries]);
  const track = items.length > 0 ? [...items, ...items] : [];

  const title =
    headerMode === "cruise" ? "Cruise Arrivals Today" : "Ferry Port Today";
  const subtitle =
    headerMode === "cruise" ? "Cruise ships at Dover" : "Arrivals from France";
  const footerHref = headerMode === "cruise" ? cruiseScheduleHref : ferryHref;
  const footerLabel =
    headerMode === "cruise" ? cruiseScheduleLabel : ferryScheduleLabel;
  const titleHref = headerMode === "cruise" ? cruiseHref : ferryHref;

  return (
    <KthHeroLiveCard
      title={title}
      titleHref={titleHref}
      titleExternal={headerMode === "cruise"}
      subtitle={subtitle}
      footerHref={footerHref}
      footerLabel={`${footerLabel} →`}
      footerExternal={headerMode === "cruise"}
    >
      {items.length === 0 ? (
        <p className="py-3 text-[11px] text-white/70">
          No cruise or ferry movements listed soon.
        </p>
      ) : (
        <div className="relative h-[12.75rem] overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-kth-navy/90 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-kth-navy/90 to-transparent" />
          <div className="kth-port-ticker-track flex flex-col">
            {track.map((item, index) => (
              <TickerRow
                key={`${item.id}-${index}`}
                item={item}
                cruiseHref={cruiseScheduleHref}
                ferryHref={ferryHref}
              />
            ))}
          </div>
        </div>
      )}
    </KthHeroLiveCard>
  );
}
