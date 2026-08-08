"use client";

import { KthHeroLiveCard } from "@/components/kenttravelhub/KthHeroLiveCard";
import type { LiveSeverity, LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
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

const PORT_STATUS_COLOR = {
  ok: "text-emerald-300",
  warn: "text-amber-300",
  alert: "text-red-300",
} as const;

function portHeadline(severity: LiveSeverity, ok: string, warn: string, alert: string) {
  if (severity === "alert") return alert;
  if (severity === "warn") return warn;
  return ok;
}

function FerryRow({
  ferry,
  href,
}: {
  ferry: FerryArrivalEntry;
  href: string;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-2 py-2 transition hover:bg-white/5"
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
  portHref: string;
  ferryHref: string;
  ferryLabel: string;
};

export function KthHeroPortTrafficPanel({
  portHref,
  ferryHref,
  ferryLabel,
}: Props) {
  const [snapshot, setSnapshot] = useState<LiveTravelSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/kenttravelhub/live");
        if (!res.ok) return;
        const data = (await res.json()) as LiveTravelSnapshot;
        if (!cancelled) setSnapshot(data);
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

  const port = snapshot?.doverPortTraffic;
  const arrivals = snapshot?.ferryArrivals ?? [];

  return (
    <KthHeroLiveCard
      title="Ferry & Port Traffic"
      titleHref={portHref}
      titleExternal
      subtitle="Live Dover Eastern Docks · Calais & Dunkirk"
      footerHref={ferryHref}
      footerLabel={`${ferryLabel} →`}
      footerExternal
    >
      {!snapshot ? (
        <p className="py-3 text-[11px] text-white/70">Loading live port data…</p>
      ) : (
        <>
          <div className="rounded-lg bg-white/5 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-white/55">
              Dover Port Traffic
            </p>
            {port && (
              <>
                <p
                  className={`mt-1 text-sm font-extrabold ${PORT_STATUS_COLOR[port.severity]}`}
                >
                  {portHeadline(
                    port.severity,
                    "Moving normally",
                    "Moderate traffic",
                    "Heavy traffic",
                  )}
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-white/70">
                  {port.detail.slice(0, 72)}
                </p>
              </>
            )}
          </div>

          {arrivals.length > 0 && (
            <ul className="mt-2 divide-y divide-white/10">
              {arrivals.slice(0, 2).map((ferry) => (
                <FerryRow
                  key={`${ferry.operator}-${ferry.route}-${ferry.arrives}`}
                  ferry={ferry}
                  href={ferryHref}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </KthHeroLiveCard>
  );
}
