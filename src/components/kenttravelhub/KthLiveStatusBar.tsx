"use client";

import type { LiveSeverity, LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import type { KthLiveDetailLinks } from "@/lib/kenttravelhub/live-links";
import { useEffect, useState, type ReactNode } from "react";

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

function statusTone(severity: LiveSeverity): "ok" | "warn" | "alert" {
  return severity;
}

const STATUS_COLOR = {
  ok: "text-emerald-600",
  warn: "text-amber-600",
  alert: "text-red-600",
  neutral: "text-kth-muted",
} as const;

function CardIcon({ children }: { children: ReactNode }) {
  return (
    <span className="shrink-0 text-kth-muted/55" aria-hidden>
      {children}
    </span>
  );
}

const ICONS = {
  port: (
    <CardIcon>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 17h14v2H5z" />
        <path d="M7 17V9l3-4h4l3 4v8" />
        <circle cx="8" cy="19" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="16" cy="19" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    </CardIcon>
  ),
  ferry: (
    <CardIcon>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 18h18" />
        <path d="M5 18l2-8h10l2 8" />
        <path d="M8 10V7h8v3" />
        <path d="M12 3v4" />
      </svg>
    </CardIcon>
  ),
  m20: (
    <CardIcon>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12h18" />
        <path d="M6 12l2-4h8l2 4" />
        <path d="M9 8V5h6v3" />
      </svg>
    </CardIcon>
  ),
  weather: (
    <CardIcon>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
        <circle cx="9" cy="9" r="4" fill="#f5a623" stroke="#f5a623" />
        <path
          d="M6 16a4 4 0 0 1 8 0h1a3 3 0 1 0 0-6h-.5"
          fill="#e8edf2"
          stroke="#9aa8b5"
        />
      </svg>
    </CardIcon>
  ),
  brock: (
    <CardIcon>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </CardIcon>
  ),
} as const;

type SnapshotCard = {
  id: string;
  title: string;
  status?: string;
  statusTone: keyof typeof STATUS_COLOR;
  value: string;
  subtext: string;
  icon: ReactNode;
  href?: string;
  external?: boolean;
  linkLabel?: string;
};

function portValue(data: LiveTravelSnapshot): { value: string; subtext: string } {
  const detail = data.doverPortTraffic.detail;
  const waitMatch = detail.match(/(\d+)\s*[–-]\s*(\d+)\s*min|(\d+)\s*min/i);
  if (waitMatch) {
    const mins = waitMatch[3] ?? waitMatch[1];
    return { value: `${mins} min`, subtext: "Estimated wait" };
  }

  if (data.cruiseArrivals.length >= 2) {
    return {
      value: `${data.cruiseArrivals.length} cruise ships`,
      subtext: "Busy port day — allow extra time",
    };
  }

  return {
    value: "Moving normally",
    subtext: "Estimated wait · live port signals",
  };
}

function m20Value(data: LiveTravelSnapshot): { value: string; subtext: string } {
  const severity = data.m20Traffic.severity;
  const delay = data.m20DelayMinutes ?? 0;

  if (data.m20JourneyMinutes) {
    const delaySuffix = delay > 0 ? ` (+${delay} min)` : "";
    const value = `${data.m20JourneyMinutes} min${delaySuffix}`;

    if (severity === "alert") {
      return {
        value,
        subtext:
          data.m20Traffic.detail.slice(0, 72) ||
          "Significant delays on M20 to Dover",
      };
    }
    if (severity === "warn" || delay > 0) {
      return {
        value,
        subtext:
          delay > 0
            ? `${delay} min slower than usual · Junction 11A–Dover`
            : "Moderate congestion — allow extra time on M20",
      };
    }
    return {
      value,
      subtext: "Junction 11A–Dover · flowing normally",
    };
  }

  if (severity === "alert") {
    return {
      value: "Delays reported",
      subtext: data.m20Traffic.detail.slice(0, 72) || "Check before you travel",
    };
  }
  if (severity === "warn") {
    return {
      value: "Some congestion",
      subtext: data.m20Traffic.detail.slice(0, 72) || "Allow extra time to Dover",
    };
  }

  return {
    value: "Junction 11A–Dover",
    subtext: "No significant delays reported",
  };
}

function brockValue(data: LiveTravelSnapshot): { value: string; subtext: string } {
  if (data.operationBrock.active) {
    return {
      value: "Traffic management in place",
      subtext: data.operationBrock.detail,
    };
  }

  return {
    value: "Standby — not deployed",
    subtext: data.operationBrock.detail,
  };
}

function ferryValue(data: LiveTravelSnapshot): { value: string; subtext: string } {
  const next = data.ferryArrivals[0];
  if (next && data.ferryDelays.severity !== "ok") {
    return {
      value: `${next.operator} · ${next.arrives}`,
      subtext: `Next arrival from ${next.route} — ${next.status.replace("-", " ")}`,
    };
  }

  return {
    value: "All services",
    subtext: "Running on time",
  };
}

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildCards(
  data: LiveTravelSnapshot | null,
  links: KthLiveDetailLinks,
): SnapshotCard[] {
  if (!data) {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `loading-${i}`,
      title: "Loading…",
      statusTone: "neutral" as const,
      value: "—",
      subtext: "Fetching live data",
      icon: ICONS.port,
    }));
  }

  const portSeverity = data.doverPortTraffic.severity;
  const ferrySeverity = data.ferryDelays.severity;
  const m20Severity = data.m20Traffic.severity;
  const port = portValue(data);
  const m20 = m20Value(data);
  const ferry = ferryValue(data);
  const brock = brockValue(data);
  const feelsLike = Math.max(data.weather.tempC - 1, data.weather.tempC);

  return [
    {
      id: "port",
      icon: ICONS.port,
      title: "Dover Port Traffic",
      href: links.port.href,
      external: true,
      linkLabel: links.port.label,
      status: severityHeadline(portSeverity, "Normal Traffic", "Moderate Traffic", "Heavy Traffic"),
      statusTone: statusTone(portSeverity),
      value: port.value,
      subtext: port.subtext,
    },
    {
      id: "ferry",
      icon: ICONS.ferry,
      title: "Ferry Updates",
      href: links.ferry.href,
      external: true,
      linkLabel: links.ferry.label,
      status: severityHeadline(ferrySeverity, "No Delays", "Some Delays", "Significant Delays"),
      statusTone: statusTone(ferrySeverity),
      value: ferry.value,
      subtext: ferry.subtext,
    },
    {
      id: "m20",
      icon: ICONS.m20,
      title: "M20 Traffic",
      href: links.m20.href,
      external: true,
      linkLabel: links.m20.label,
      status: severityHeadline(m20Severity, "Light Traffic", "Moderate Traffic", "Heavy Traffic"),
      statusTone: statusTone(m20Severity),
      value: m20.value,
      subtext: m20.subtext,
    },
    {
      id: "weather",
      icon: ICONS.weather,
      title: "Weather in Dover",
      href: links.weather.href,
      external: true,
      linkLabel: links.weather.label,
      statusTone: "neutral",
      value: `${data.weather.tempC}°C`,
      subtext: `Feels like ${feelsLike}°C`,
      status: data.weather.label,
    },
    {
      id: "brock",
      icon: ICONS.brock,
      title: "Operation Brock",
      href: links.brock.href,
      external: true,
      linkLabel: links.brock.label,
      status: data.operationBrock.active ? "Active" : "Not Active",
      statusTone: data.operationBrock.active ? "warn" : "ok",
      value: brock.value,
      subtext: brock.subtext,
    },
  ];
}

function SnapshotCardView({ card }: { card: SnapshotCard }) {
  const isWeather = card.id === "weather";
  const content = (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-extrabold uppercase tracking-wide text-kth-navy">
          {card.title}
        </p>

        {isWeather ? (
          <>
            <p className="mt-2 text-base font-extrabold text-kth-navy">{card.value}</p>
            <p className="mt-0.5 text-sm font-extrabold text-kth-navy">{card.status}</p>
            <p className="mt-0.5 text-xs text-kth-muted">{card.subtext}</p>
          </>
        ) : (
          <>
            {card.status && (
              <p className={`mt-2 text-sm font-semibold ${STATUS_COLOR[card.statusTone]}`}>
                {card.status}
              </p>
            )}
            <p className="mt-0.5 text-base font-extrabold text-kth-navy">{card.value}</p>
            <p className="mt-0.5 text-xs text-kth-muted">{card.subtext}</p>
          </>
        )}

        {card.href && card.linkLabel && (
          <p className="mt-2 text-[11px] font-semibold text-kth-sea group-hover:underline">
            {card.linkLabel} →
          </p>
        )}
      </div>
      {card.icon}
    </>
  );

  const className =
    "group flex items-start justify-between gap-3 rounded-xl border border-kth-navy/10 bg-white px-4 py-4 shadow-sm ring-1 ring-kth-navy/5 transition hover:border-kth-sea/40 hover:shadow-md";

  if (!card.href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a
      href={card.href}
      className={className}
      {...(card.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {content}
    </a>
  );
}

type Props = {
  links: KthLiveDetailLinks;
};

export function KthLiveStatusBar({ links }: Props) {
  const [data, setData] = useState<LiveTravelSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const liveRes = await fetch("/api/kenttravelhub/live");
        if (!cancelled && liveRes.ok) {
          setData((await liveRes.json()) as LiveTravelSnapshot);
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

  const cards = buildCards(data, links);

  return (
    <section id="live" className="scroll-mt-20 border-b border-kth-navy/8 bg-kth-sand py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-kth-sea">
              Dover live board
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-kth-navy sm:text-xl">
              Check before you leave
            </h2>
            <p className="mt-1 text-sm text-kth-muted">
              Port, ferries, M20, weather and Operation Brock — refreshed throughout the day.
            </p>
          </div>
          {data && (
            <p className="text-[11px] font-medium text-kth-muted">
              Updated {formatUpdated(data.updatedAt)}
            </p>
          )}
        </div>
        <div className="-mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
          {cards.map((card) => (
            <div key={card.id} className="w-[min(78vw,280px)] shrink-0 snap-start sm:w-auto sm:shrink">
              <SnapshotCardView card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
