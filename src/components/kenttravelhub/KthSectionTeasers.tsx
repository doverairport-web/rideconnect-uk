import type { LiveSeverity } from "@/lib/kenttravelhub/content";
import { getLiveTravelSnapshot } from "@/lib/kenttravelhub/live-data";
import {
  KTH_DASHBOARD_SECTIONS,
  buildSiteSectionLive,
} from "@/lib/kenttravelhub/sections";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

const STATUS_DOT: Record<LiveSeverity | "neutral", string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  alert: "bg-red-500",
  neutral: "bg-kth-muted/40",
};

export async function KthSectionTeasers() {
  const [sections, live] = await Promise.all([
    Promise.all(
      KTH_DASHBOARD_SECTIONS.map(async (section) => ({
        section,
        href: await kthPath(section.path),
      })),
    ),
    getLiveTravelSnapshot().catch(() => null),
  ]);

  const updated = live
    ? new Date(live.updatedAt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <section className="border-t border-kth-navy/8 bg-kth-sand py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
              Live windows
            </h2>
            <p className="mt-1 max-w-xl text-sm text-kth-muted">
              Snapshot from live feeds — tap for full section.
            </p>
          </div>
          {updated && (
            <p className="text-[11px] font-medium text-kth-muted">
              Updated {updated}
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map(({ section, href }) => {
            const snapshot = buildSiteSectionLive(section.id, live);
            return (
              <Link
                key={section.id}
                href={href}
                className={`group flex flex-col rounded-xl border-l-4 bg-white p-4 shadow-sm transition hover:shadow-md ${section.accent}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden>
                    {section.emoji}
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wide text-kth-muted">
                    {section.number}. {section.shortLabel}
                  </span>
                  <span
                    className={`ml-auto h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[snapshot.severity]}`}
                    aria-hidden
                  />
                </div>
                <p className="mt-2 font-bold text-kth-navy group-hover:text-kth-sea">
                  {snapshot.headline}
                </p>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-kth-muted line-clamp-2">
                  {snapshot.detail}
                </p>
                <span className="mt-3 text-xs font-bold text-kth-sea">
                  Open {section.shortLabel} →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
