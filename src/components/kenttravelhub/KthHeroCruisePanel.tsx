"use client";

import { KthHeroLiveCard } from "@/components/kenttravelhub/KthHeroLiveCard";
import type { CruiseCalendar, CruiseScheduleEntry } from "@/lib/kenttravelhub/content";
import { useEffect, useMemo, useState } from "react";

const EMPTY: CruiseCalendar = {
  today: [],
  tomorrow: [],
  thisWeek: [],
  thisMonth: [],
  scheduleDate: "",
};

type Props = {
  scheduleHref: string;
  guideHref: string;
  terminalHref: string;
  scheduleLabel: string;
};

type DisplayShip = {
  ship: CruiseScheduleEntry;
  isToday: boolean;
};

function upcomingShips(calendar: CruiseCalendar, limit = 3): DisplayShip[] {
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

  return result;
}

function shipStatusColor(ship: CruiseScheduleEntry, isToday: boolean): "green" | "amber" {
  if (!isToday) return "amber";

  const now = new Date();
  const [h, m] = ship.arrives.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return "green";

  const arrival = new Date(now);
  arrival.setHours(h, m, 0, 0);

  if (ship.departs && ship.departs !== "—") {
    const [dh, dm] = ship.departs.split(":").map(Number);
    if (Number.isFinite(dh) && Number.isFinite(dm)) {
      const departure = new Date(now);
      departure.setHours(dh, dm, 0, 0);
      if (now >= arrival && now < departure) return "green";
    }
  }

  return now >= arrival ? "green" : "amber";
}

const STATUS_BAR = {
  green: "bg-emerald-400",
  amber: "bg-amber-400",
} as const;

function ShipRow({
  item,
  href,
  external,
}: {
  item: DisplayShip;
  href: string;
  external?: boolean;
}) {
  const { ship, isToday } = item;
  const status = shipStatusColor(ship, isToday);
  const departs = ship.departs && ship.departs !== "—" ? ship.departs : "—";

  return (
    <li>
      <a
        href={href}
        className="flex gap-2 py-2 transition hover:bg-white/5"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span
          className={`mt-0.5 w-1 shrink-0 self-stretch rounded-full ${STATUS_BAR[status]}`}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-white">{ship.name}</p>
          {!isToday && (
            <p className="mt-0.5 text-[10px] text-white/55">{ship.dateLabel}</p>
          )}
          <div className="mt-1 grid grid-cols-2 gap-x-2 text-[10px] text-white/75">
            <span>Arrives {ship.arrives}</span>
            <span>Departs {departs}</span>
          </div>
        </div>
      </a>
    </li>
  );
}

export function KthHeroCruisePanel({
  scheduleHref,
  guideHref,
  terminalHref,
  scheduleLabel,
}: Props) {
  const [calendar, setCalendar] = useState<CruiseCalendar>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/kenttravelhub/live");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setCalendar(data.cruiseCalendar ?? EMPTY);
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

  const ships = useMemo(() => upcomingShips(calendar, 3), [calendar]);
  const hasToday = calendar.today.length > 0;

  return (
    <KthHeroLiveCard
      title="Cruise · Dover today"
      titleHref={guideHref}
      subtitle={!hasToday && ships.length > 0 ? "Next scheduled calls" : "Ships in port & arrivals"}
      footerHref={scheduleHref}
      footerLabel={`${scheduleLabel} →`}
      footerExternal
      secondaryFooterHref={terminalHref}
      secondaryFooterLabel="Cruise terminal guide →"
    >
      {ships.length === 0 ? (
        <p className="py-3 text-[11px] text-white/70">No cruise ships scheduled soon.</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {ships.map((item) => (
            <ShipRow
              key={`${item.ship.date}-${item.ship.name}-${item.ship.arrives}`}
              item={item}
              href={guideHref}
            />
          ))}
        </ul>
      )}
    </KthHeroLiveCard>
  );
}
