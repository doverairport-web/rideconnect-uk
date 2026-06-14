"use client";

import type { LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import {
  KTH_HERO_HEADLINE,
  KTH_HERO_IMAGE,
  KTH_HERO_IMAGE_ALT,
  KTH_HERO_SUBHEADLINE,
} from "@/lib/kenttravelhub/brand";
import {
  KTH_DASHBOARD_SECTIONS,
  buildSiteSectionLive,
  type KthSiteSectionId,
} from "@/lib/kenttravelhub/sections";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const STATUS_DOT = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  alert: "bg-red-500",
  neutral: "bg-kth-muted/40",
} as const;

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  sectionHrefs: Record<KthSiteSectionId, string>;
};

export function KthLiveDashboard({ sectionHrefs }: Props) {
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

  const liveBySection = useMemo(
    () =>
      Object.fromEntries(
        KTH_DASHBOARD_SECTIONS.map((section) => [
          section.id,
          buildSiteSectionLive(section.id, data),
        ]),
      ) as Record<KthSiteSectionId, ReturnType<typeof buildSiteSectionLive>>,
    [data],
  );

  return (
    <>
      <section className="relative min-h-[280px] overflow-hidden sm:min-h-[340px] lg:min-h-[380px]">
        <div className="absolute inset-0">
          <Image
            src={KTH_HERO_IMAGE}
            alt={KTH_HERO_IMAGE_ALT}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/45 to-white/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-kth-sand via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
          <div className="max-w-xl rounded-2xl bg-white/75 p-6 shadow-sm backdrop-blur-[2px] sm:max-w-lg sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-kth-sea">
              Kent Travel Hub
            </p>
            <h1 className="mt-2 font-serif text-2xl font-bold leading-tight text-kth-navy sm:text-3xl lg:text-4xl">
              {KTH_HERO_HEADLINE}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-kth-navy/85 sm:text-base">
              {KTH_HERO_SUBHEADLINE}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-kth-sand pb-10 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3 pt-2">
            <div>
              <h2 className="font-serif text-xl font-bold text-kth-navy sm:text-2xl">
                Live travel windows
              </h2>
              <p className="mt-1 text-sm text-kth-muted">
                Tap a window for full guides, links and booking options.
              </p>
            </div>
            {data && (
              <p className="text-xs font-medium text-kth-muted">
                Updated {formatUpdated(data.updatedAt)}
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {KTH_DASHBOARD_SECTIONS.map((section) => {
              const live = liveBySection[section.id];
              return (
                <Link
                  key={section.id}
                  href={sectionHrefs[section.id]}
                  className={`group rounded-2xl border border-kth-navy/8 border-l-4 bg-white p-5 shadow-sm transition hover:shadow-md active:scale-[0.99] ${section.accent}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white ${section.panelBg}`}
                      >
                        {section.number}
                      </span>
                      <span className="text-lg" aria-hidden>
                        {section.emoji}
                      </span>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-kth-muted">
                        {section.label}
                      </p>
                    </div>
                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[live.severity]}`}
                      aria-hidden
                    />
                  </div>

                  <p className="mt-4 text-xl font-extrabold leading-snug text-kth-navy group-hover:text-kth-sea sm:text-2xl">
                    {live.headline}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-kth-muted">
                    {live.detail}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-kth-sea">
                    Open section {section.number} →
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
