"use client";

import type { LiveSeverity, LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import { useEffect, useState } from "react";

const SEVERITY_DOT = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  alert: "bg-red-500",
} as const;

function severityHeadline(
  severity: LiveSeverity,
  ok: string,
  warn: string,
  alert: string,
) {
  if (severity === "alert") return alert;
  if (severity === "warn") return warn;
  return ok;
}

function shortDetail(text: string, max = 64): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type SnapshotRow = {
  id: string;
  icon: string;
  label: string;
  status: string;
  detail: string;
  severity: LiveSeverity | null;
  href: string;
};

function buildRows(data: LiveTravelSnapshot | null): SnapshotRow[] {
  if (!data) {
    return [
      { id: "cruise", icon: "🚢", label: "Cruise ship in port", status: "—", detail: "Loading…", severity: null, href: "#cruise" },
      { id: "ferry", icon: "⛴", label: "Ferry delays", status: "—", detail: "Loading…", severity: null, href: "#ferries" },
      { id: "m20", icon: "🛣", label: "M20 status", status: "—", detail: "Loading…", severity: null, href: "#live" },
      { id: "weather", icon: "🌤", label: "Weather", status: "—", detail: "Loading…", severity: null, href: "#live" },
      { id: "brock", icon: "🛡", label: "Operation Brock", status: "—", detail: "Loading…", severity: null, href: "#live" },
    ];
  }

  const today = data.cruiseCalendar.today;
  const cruiseStatus =
    today.length === 0
      ? "None today"
      : today.length === 1
        ? today[0].name
        : `${today.length} ships`;
  const cruiseDetail =
    today.length === 0
      ? "No cruise ships scheduled at Dover today"
      : today.length === 1
        ? `Arr ${today[0].arrives} · ${today[0].terminal}`
        : `Next: ${today[0].name} at ${today[0].arrives}`;

  return [
    {
      id: "cruise",
      icon: "🚢",
      label: "Cruise ship in port",
      status: cruiseStatus,
      detail: cruiseDetail,
      severity: today.length > 0 ? "ok" : "warn",
      href: "#cruise",
    },
    {
      id: "ferry",
      icon: "⛴",
      label: "Ferry delays",
      status: severityHeadline(
        data.ferryDelays.severity,
        "No delays",
        "Some delays",
        "Significant delays",
      ),
      detail: shortDetail(data.ferryDelays.detail),
      severity: data.ferryDelays.severity,
      href: "#ferries",
    },
    {
      id: "m20",
      icon: "🛣",
      label: "M20 status",
      status: severityHeadline(
        data.m20Traffic.severity,
        "Light traffic",
        "Moderate traffic",
        "Heavy traffic",
      ),
      detail: shortDetail(data.m20Traffic.detail),
      severity: data.m20Traffic.severity,
      href: "#live",
    },
    {
      id: "weather",
      icon: "🌤",
      label: "Weather",
      status: `${data.weather.tempC}°C`,
      detail: data.weather.label,
      severity: "ok",
      href: "#live",
    },
    {
      id: "brock",
      icon: "🛡",
      label: "Operation Brock",
      status: data.operationBrock.active ? "Active" : "Not active",
      detail: shortDetail(data.operationBrock.detail),
      severity: data.operationBrock.active ? "warn" : "ok",
      href: "#live",
    },
  ];
}

export function KthDoverSnapshot() {
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

  const rows = buildRows(data);

  return (
    <div className="rounded-xl bg-white p-5 shadow-2xl sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-kth-sea">
            Live now
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold text-kth-navy sm:text-2xl">
            Today&apos;s Dover Snapshot
          </h2>
        </div>
        {data && (
          <p className="shrink-0 text-[10px] font-medium text-kth-muted">
            {formatUpdated(data.updatedAt)}
          </p>
        )}
      </div>

      <ul className="mt-5 divide-y divide-kth-navy/8">
        {rows.map((row) => (
          <li key={row.id}>
            <a
              href={row.href}
              className="group -mx-2 flex items-start gap-3 rounded-lg px-2 py-3 transition hover:bg-kth-sand/80"
            >
              <span className="text-lg leading-none" aria-hidden>
                {row.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-kth-muted">
                    {row.label}
                  </p>
                  {row.severity && (
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[row.severity]}`}
                      aria-hidden
                    />
                  )}
                </div>
                <p className="mt-0.5 text-sm font-extrabold text-kth-navy group-hover:text-kth-sea">
                  {row.status}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-kth-muted">
                  {row.detail}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-4 border-t border-kth-navy/8 pt-4 text-center text-xs text-kth-muted">
        Dover travel portal — port, ferries, cruise &amp; roads in one place
      </p>
    </div>
  );
}
