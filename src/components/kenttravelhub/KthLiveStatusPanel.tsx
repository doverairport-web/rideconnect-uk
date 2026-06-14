"use client";

import type { LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import { useEffect, useState } from "react";

const SEVERITY_STYLES = {
  ok: "text-emerald-700",
  warn: "text-amber-800",
  alert: "text-red-800",
} as const;

export function KthLiveStatusPanel() {
  const [data, setData] = useState<LiveTravelSnapshot | null>(null);

  useEffect(() => {
    fetch("/api/kenttravelhub/live")
      .then((res) => res.json())
      .then((json: LiveTravelSnapshot) => setData(json))
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="rounded-xl border border-kth-navy/10 bg-white p-5 text-sm text-kth-muted">
        Loading live Kent travel status…
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
    <div className="rounded-xl border border-kth-sea/20 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-kth-sea">
        Live status now
      </p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.label} className="text-sm">
            <span className="font-semibold text-kth-navy">{item.label}: </span>
            <span className={SEVERITY_STYLES[item.severity]}>{item.detail}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-kth-muted/80">
        Sources: cruise ({data.sources.cruise}), M20 ({data.sources.m20})
      </p>
    </div>
  );
}
