"use client";

import { KthHeroLiveCard } from "@/components/kenttravelhub/KthHeroLiveCard";
import type { FerryArrivalEntry } from "@/lib/kenttravelhub/fetchers/ferry-arrivals";
import { useEffect, useState } from "react";

const STATUS_BAR = {
  "in-port": "bg-emerald-400",
  arriving: "bg-emerald-400",
  scheduled: "bg-amber-400",
} as const;

const STATUS_LABEL = {
  "in-port": "In port",
  arriving: "Arriving",
  scheduled: "Scheduled",
} as const;

function FerryRow({
  ferry,
  href,
  external,
}: {
  ferry: FerryArrivalEntry;
  href: string;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        className="flex gap-2 py-2 transition hover:bg-white/5"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span
          className={`mt-0.5 w-1 shrink-0 self-stretch rounded-full ${STATUS_BAR[ferry.status]}`}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white">
            {ferry.operator} · {ferry.route}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-white/75">
            <span>From France</span>
            <span className="font-semibold text-white/90">
              {STATUS_LABEL[ferry.status]} {ferry.arrives}
            </span>
          </div>
        </div>
      </a>
    </li>
  );
}

type Props = {
  guideHref: string;
  timetableHref: string;
  timetableLabel: string;
};

export function KthHeroFerryPanel({
  guideHref,
  timetableHref,
  timetableLabel,
}: Props) {
  const [arrivals, setArrivals] = useState<FerryArrivalEntry[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/kenttravelhub/live");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.ferryArrivals) {
          setArrivals(data.ferryArrivals);
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

  return (
    <KthHeroLiveCard
      title="Ferry · Channel"
      titleHref={guideHref}
      subtitle="Arrivals from France today"
      footerHref={timetableHref}
      footerLabel={`${timetableLabel} →`}
      footerExternal
    >
      {arrivals.length === 0 ? (
        <p className="py-3 text-[11px] text-white/70">Loading ferry arrivals…</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {arrivals.slice(0, 3).map((ferry) => (
            <FerryRow
              key={`${ferry.operator}-${ferry.route}-${ferry.arrives}`}
              ferry={ferry}
              href={guideHref}
            />
          ))}
        </ul>
      )}
    </KthHeroLiveCard>
  );
}
