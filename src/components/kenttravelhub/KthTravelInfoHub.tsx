"use client";

import type { LiveSeverity, LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import { KTH_DOVER_HOTELS, KTH_DOVER_RESTAURANTS } from "@/lib/kenttravelhub/content";
import { KTH_ROAD_CAMERA_LINKS, KTH_WEBCAMS } from "@/lib/kenttravelhub/webcams";
import { KthWebcamStrip } from "@/components/kenttravelhub/KthWebcams";
import { KthDoverHotelLinks } from "@/components/kenttravelhub/KthDoverHotelLinks";
import { KthDoverRestaurantLinks } from "@/components/kenttravelhub/KthDoverRestaurantLinks";
import type {
  ResolvedDoverHotel,
  ResolvedDoverRestaurant,
  ResolvedHubLink,
  ResolvedHubSection,
} from "@/lib/kenttravelhub/resolve-hub-links";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type SectionLive = {
  headline: string;
  detail: string;
  severity: LiveSeverity | "neutral";
};

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function severityLabel(severity: LiveSeverity, ok: string, warn: string, alert: string): string {
  if (severity === "alert") return alert;
  if (severity === "warn") return warn;
  return ok;
}

function buildSectionLive(
  sectionId: ResolvedHubSection["id"],
  data: LiveTravelSnapshot | null,
): SectionLive {
  if (!data) {
    return { headline: "Loading…", detail: "Fetching live data", severity: "neutral" };
  }

  if (sectionId === "cruise") {
    const ships = data.cruiseArrivals;
    if (ships.length === 0) {
      return {
        headline: "No ships listed today",
        detail: "Check Port of Dover schedule for updates",
        severity: "neutral",
      };
    }
    const first = ships[0];
    const more = ships.length > 1 ? ` · +${ships.length - 1} more` : "";
    return {
      headline: `${first.name} · ${first.time}`,
      detail: `${ships.length} ship${ships.length === 1 ? "" : "s"} in port today${more}`,
      severity: ships.length >= 2 ? "warn" : "ok",
    };
  }

  if (sectionId === "ferry") {
    const next = data.ferryArrivals[0];
    if (next) {
      return {
        headline: `${next.operator} arrives ${next.arrives}`,
        detail: `${next.route} · ${next.status.replace("-", " ")}`,
        severity: data.ferryDelays.severity,
      };
    }
    return {
      headline: data.ferryDelays.severity === "ok" ? "Services running" : "Check delays",
      detail: data.ferryDelays.detail.slice(0, 72),
      severity: data.ferryDelays.severity,
    };
  }

  if (sectionId === "airports") {
    const mins = data.m20JourneyMinutes;
    if (mins) {
      const delay =
        data.m20DelayMinutes && data.m20DelayMinutes > 0
          ? ` (+${data.m20DelayMinutes} min on road)`
          : "";
      return {
        headline: `M20 to Dover: ${mins} min${delay}`,
        detail: "Live drive time J11A → port — affects airport transfers",
        severity: data.m20Traffic.severity,
      };
    }
    return {
      headline: "Gatwick, Heathrow, Stansted, Luton",
      detail: "Transfer guides and typical journey times from Dover",
      severity: "neutral",
    };
  }

  if (sectionId === "roads") {
    const port = data.doverPortTraffic;
    const m20 = data.m20JourneyMinutes;
    const brock = data.operationBrock.active;
    const parts: string[] = [];
    if (m20) parts.push(`M20 ${m20} min`);
    parts.push(
      severityLabel(port.severity, "Port moving", "Port busy", "Port heavy"),
    );
    if (brock) parts.push("Brock active");
    return {
      headline: parts.join(" · "),
      detail: port.detail.slice(0, 72),
      severity: brock || port.severity === "alert" ? "warn" : port.severity,
    };
  }

  if (sectionId === "hotels") {
    return {
      headline: "Dover Marina · Holiday Inn · B&Bs",
      detail: `${KTH_DOVER_HOTELS.length} named hotels near the port — from £55/night`,
      severity: "neutral",
    };
  }

  if (sectionId === "cameras") {
    return {
      headline: `${KTH_WEBCAMS.length} Dover views · ${KTH_ROAD_CAMERA_LINKS.length} road feeds`,
      detail: "Port, cliffs, marina — plus M20, Traffic England & Kent CCTV",
      severity: "neutral",
    };
  }

  const areas = [...new Set(KTH_DOVER_RESTAURANTS.map((r) => r.subtitle.split("·")[0].trim()))];
  return {
    headline: `${KTH_DOVER_RESTAURANTS.length} places within 5 miles`,
    detail: `Dover, Deal & coast — ${areas.slice(0, 3).join(", ")}`,
    severity: "neutral",
  };
}

const STATUS_DOT = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  alert: "bg-red-500",
  neutral: "bg-kth-muted/40",
} as const;

function LinkChips({ links }: { links: ResolvedHubLink[] }) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 scrollbar-none">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className="shrink-0 rounded-full border border-kth-navy/10 bg-kth-sand px-3.5 py-2 text-sm font-semibold text-kth-navy transition hover:border-kth-sea/40 hover:bg-white active:scale-[0.98]"
          {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function HubPanel({
  section,
  live,
  doverHotels,
  doverRestaurants,
}: {
  section: ResolvedHubSection;
  live: SectionLive;
  doverHotels: ResolvedDoverHotel[];
  doverRestaurants: ResolvedDoverRestaurant[];
}) {
  const isCameras = section.id === "cameras";
  const isHotels = section.id === "hotels";
  const isRestaurants = section.id === "restaurants";

  return (
    <article
      id={`hub-${section.id}`}
      className={`scroll-mt-36 rounded-2xl border border-kth-navy/8 border-l-4 bg-white shadow-sm ${section.accent} ${
        isCameras || isRestaurants ? "lg:col-span-2" : isHotels ? "lg:col-span-2" : ""
      }`}
    >
      <Link
        href={section.sectionHref}
        className="block px-4 py-4 active:bg-kth-sand/40 sm:px-5 sm:py-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden>
                {section.emoji}
              </span>
              <h2 className="text-xs font-extrabold uppercase tracking-wide text-kth-muted">
                {section.label}
              </h2>
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[live.severity]}`}
                aria-hidden
              />
            </div>
            <p className="mt-2 text-xl font-extrabold leading-snug text-kth-navy sm:text-2xl">
              {live.headline}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-kth-muted">{live.detail}</p>
          </div>
          <span className="shrink-0 pt-1 text-kth-sea" aria-hidden>
            →
          </span>
        </div>
      </Link>

      {(section.links.length > 0 || isHotels || isRestaurants) && (
        <div className="border-t border-kth-navy/6 px-4 py-3 sm:px-5">
          {isCameras && (
            <div className="mb-3">
              <KthWebcamStrip />
            </div>
          )}
          {isHotels && (
            <div className="mb-3">
              <KthDoverHotelLinks hotels={doverHotels} compact />
            </div>
          )}
          {isRestaurants && (
            <div className="mb-3">
              <KthDoverRestaurantLinks places={doverRestaurants} compact />
            </div>
          )}
          {section.links.length > 0 && <LinkChips links={section.links} />}
        </div>
      )}
    </article>
  );
}

type Props = {
  sections: ResolvedHubSection[];
  visitLinks: ResolvedHubLink[];
  doverHotels: ResolvedDoverHotel[];
  doverRestaurants: ResolvedDoverRestaurant[];
};

export function KthTravelInfoHubClient({
  sections,
  visitLinks,
  doverHotels,
  doverRestaurants,
}: Props) {
  const [data, setData] = useState<LiveTravelSnapshot | null>(null);
  const [activeId, setActiveId] = useState<ResolvedHubSection["id"]>("cruise");
  const navRef = useRef<HTMLDivElement>(null);

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

  const liveBySection = useMemo(
    () =>
      Object.fromEntries(
        sections.map((s) => [s.id, buildSectionLive(s.id, data)]),
      ) as Record<ResolvedHubSection["id"], SectionLive>,
    [sections, data],
  );

  function scrollToSection(id: ResolvedHubSection["id"]) {
    setActiveId(id);
    document.getElementById(`hub-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="hub" className="scroll-mt-20 border-b border-kth-navy/8 bg-kth-sand">
      <div className="sticky top-[57px] z-30 border-b border-kth-navy/8 bg-white/95 backdrop-blur-sm">
        <div
          ref={navRef}
          className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 scrollbar-none sm:px-6"
          role="tablist"
          aria-label="Travel information categories"
        >
          {sections.map((section) => {
            const active = activeId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => scrollToSection(section.id)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition active:scale-[0.97] ${
                  active
                    ? section.tabActive
                    : "bg-kth-sand text-kth-navy hover:bg-kth-navy/5"
                }`}
              >
                <span className="mr-1.5" aria-hidden>
                  {section.emoji}
                </span>
                {section.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-kth-sea">
              Live travel information
            </p>
            <p className="mt-1 text-sm text-kth-muted">
              Ships, ferries, airports, roads, hotels, restaurants &amp; live cameras
            </p>
          </div>
          {data && (
            <p className="text-xs font-medium text-kth-muted">
              Updated {formatUpdated(data.updatedAt)}
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2 lg:gap-5">
          {sections.map((section) => (
            <HubPanel
              key={section.id}
              section={section}
              live={liveBySection[section.id]}
              doverHotels={doverHotels}
              doverRestaurants={doverRestaurants}
            />
          ))}
        </div>

        <nav
          id="visit"
          aria-label="Places to visit in Kent"
          className="mt-8 scroll-mt-36 rounded-2xl border border-kth-navy/8 bg-white px-4 py-4 sm:px-5"
        >
          <p className="text-xs font-extrabold uppercase tracking-wide text-kth-muted">
            Visit Kent
          </p>
          <div className="mt-3">
            <LinkChips links={visitLinks} />
          </div>
        </nav>
      </div>
    </section>
  );
}
