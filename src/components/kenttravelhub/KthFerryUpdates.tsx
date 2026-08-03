"use client";

import { KTH_FERRY_TOPICS } from "@/lib/kenttravelhub/content";
import type { LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import Link from "next/link";
import { useEffect, useState } from "react";

const SEVERITY_STYLES = {
  ok: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warn: "border-amber-200 bg-amber-50 text-amber-900",
  alert: "border-red-200 bg-red-50 text-red-900",
} as const;

type Props = {
  guideLinks: Record<string, string>;
};

export function KthFerryUpdates({ guideLinks }: Props) {
  const [snapshot, setSnapshot] = useState<LiveTravelSnapshot | null>(null);

  useEffect(() => {
    fetch("/api/kenttravelhub/live")
      .then((res) => res.json())
      .then((data: LiveTravelSnapshot) => setSnapshot(data))
      .catch(() => {});
  }, []);

  const ferry = snapshot?.ferryDelays;
  const port = snapshot?.doverPortTraffic;

  return (
    <section id="ferries" className="scroll-mt-24 border-t border-kth-navy/8 bg-kth-sand py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
          Ferries
        </h2>
        <p className="mt-1 text-2xl font-extrabold text-kth-navy sm:text-3xl">
          Dover ferry &amp; port updates
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {ferry && (
            <div
              className={`rounded-xl border px-6 py-4 text-sm ${SEVERITY_STYLES[ferry.severity]}`}
            >
              <p className="text-xs font-bold uppercase tracking-wide opacity-80">
                Ferry sailings
              </p>
              <p className="mt-2 leading-relaxed">{ferry.detail}</p>
            </div>
          )}
          {port && (
            <div
              className={`rounded-xl border px-6 py-4 text-sm ${SEVERITY_STYLES[port.severity]}`}
            >
              <p className="text-xs font-bold uppercase tracking-wide opacity-80">
                Port traffic
              </p>
              <p className="mt-2 leading-relaxed">{port.detail}</p>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {KTH_FERRY_TOPICS.map((topic) => {
            const href =
              "guideSlug" in topic && topic.guideSlug
                ? guideLinks[topic.guideSlug]
                : undefined;

            const inner = (
              <>
                <h3 className="font-serif text-lg font-bold text-kth-navy group-hover:text-kth-sea">
                  {topic.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-kth-muted">
                  {topic.description}
                </p>
                {href && (
                  <p className="mt-3 text-sm font-semibold text-kth-sea">
                    Read guide →
                  </p>
                )}
              </>
            );

            if (href) {
              return (
                <Link
                  key={topic.id}
                  href={href}
                  className="group rounded-xl border border-kth-navy/8 bg-white p-5 shadow-sm transition hover:border-kth-sea/30 hover:shadow-md"
                >
                  {inner}
                </Link>
              );
            }

            return (
              <div
                key={topic.id}
                className="rounded-xl border border-kth-navy/8 bg-white p-5 shadow-sm"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
