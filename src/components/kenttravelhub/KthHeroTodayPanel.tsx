"use client";

import { KthHeroLiveCard } from "@/components/kenttravelhub/KthHeroLiveCard";
import type { LiveSeverity, LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import { useEffect, useMemo, useState } from "react";

type SnapshotRow = {
  emoji: string;
  text: string;
  detail?: string;
};

function portWaitLabel(data: LiveTravelSnapshot): string {
  const detail = data.doverPortTraffic.detail;
  const waitMatch = detail.match(/(\d+)\s*[–-]\s*(\d+)\s*min|(\d+)\s*min/i);
  if (waitMatch) {
    const mins = waitMatch[3] ?? waitMatch[1];
    return `${mins} min`;
  }

  if (data.doverPortTraffic.severity === "alert") return "Heavy";
  if (data.doverPortTraffic.severity === "warn") return "Moderate";

  return "Normal";
}

function m20Label(data: LiveTravelSnapshot): { text: string; detail?: string } {
  if (data.m20JourneyMinutes) {
    const delay =
      data.m20DelayMinutes && data.m20DelayMinutes > 0
        ? ` (+${data.m20DelayMinutes} min)`
        : "";
    return {
      text: `M20 ${data.m20JourneyMinutes} min${delay}`,
      detail: "Junction 11A–Dover",
    };
  }

  const severity: Record<LiveSeverity, string> = {
    ok: "Light traffic",
    warn: "Moderate traffic",
    alert: "Heavy traffic",
  };

  return {
    text: `M20 ${severity[data.m20Traffic.severity] ?? "No reports"}`,
    detail: "Junction 11A–Dover",
  };
}

function buildRows(data: LiveTravelSnapshot | null): SnapshotRow[] {
  if (!data) {
    return [
      { emoji: "🚦", text: "Loading port wait…" },
      { emoji: "🛣", text: "Loading M20…" },
      { emoji: "🛡", text: "Loading Operation Brock…" },
      { emoji: "🌤", text: "Loading weather…" },
    ];
  }

  const m20 = m20Label(data);
  const brock = data.operationBrock.active
    ? { text: "Operation Brock active", detail: "Check M20 before travel" }
    : { text: "Operation Brock not active", detail: "Normal traffic conditions" };

  return [
    {
      emoji: "🚦",
      text: `Port wait ${portWaitLabel(data)}`,
      detail: data.doverPortTraffic.detail.slice(0, 48),
    },
    { emoji: "🛣", text: m20.text, detail: m20.detail },
    { emoji: "🛡", text: brock.text, detail: brock.detail },
    {
      emoji: "🌤",
      text: `${data.weather.tempC}°C · ${data.weather.label}`,
      detail: `Feels like ${Math.max(data.weather.tempC - 1, data.weather.tempC)}°C`,
    },
  ];
}

export function KthHeroTodayPanel({ liveHref }: { liveHref: string }) {
  const [data, setData] = useState<LiveTravelSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/kenttravelhub/live");
        if (!cancelled && res.ok) {
          setData((await res.json()) as LiveTravelSnapshot);
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

  const rows = useMemo(() => buildRows(data), [data]);

  return (
    <KthHeroLiveCard
      title="Dover · Right now"
      subtitle="Port, M20, Brock & weather"
      footerHref={liveHref}
      footerLabel="Open live board →"
    >
      <ul className="space-y-2.5">
        {rows.map((row) => (
          <li key={row.text} className="flex gap-2.5">
            <span className="mt-0.5 text-sm" aria-hidden>
              {row.emoji}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-snug text-white">{row.text}</p>
              {row.detail && (
                <p className="mt-0.5 text-[10px] leading-snug text-white/60">
                  {row.detail}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </KthHeroLiveCard>
  );
}
