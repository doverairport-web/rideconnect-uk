"use client";

import type { LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import type { LiveSeverity } from "@/lib/kenttravelhub/content";
import {
  buildTodayInDoverBoxes,
  buildTodayInDoverHeadline,
  type KthTodayBox,
} from "@/lib/kenttravelhub/home-dashboard";
import Link from "next/link";

const SEVERITY_STYLES = {
  ok: "border-emerald-300/80 bg-emerald-50",
  warn: "border-amber-300/80 bg-amber-50",
  alert: "border-red-300/80 bg-red-50",
  neutral: "border-kth-navy/10 bg-white",
} as const;

const DOT = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  alert: "bg-red-500",
  neutral: "bg-kth-muted/50",
} as const;

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function TodayBoxCard({ box }: { box: KthTodayBox }) {
  const severity: LiveSeverity | "neutral" = box.severity;
  return (
    <a
      href={box.sectionAnchor}
      className={`block min-h-[108px] rounded-xl border p-3.5 shadow-sm transition hover:shadow-md active:scale-[0.99] ${SEVERITY_STYLES[severity]}`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${DOT[severity]}`}
          aria-hidden
        />
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-kth-navy/70">
          {box.label}
        </p>
      </div>
      <p className="mt-2 text-base font-extrabold leading-tight text-kth-navy">
        {box.value}
      </p>
      <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-kth-muted">
        {box.detail}
      </p>
    </a>
  );
}

type Props = {
  data: LiveTravelSnapshot | null;
};

export function KthTodayInDover({ data }: Props) {
  const headline = buildTodayInDoverHeadline(data);
  const boxes = buildTodayInDoverBoxes(data);

  return (
    <section
      id="today-in-dover"
      className="scroll-mt-[7.5rem] border-b border-kth-navy/8 bg-kth-navy text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-kth-gold">
              Today in Dover
            </p>
            <p className="mt-1 text-sm font-semibold text-white/75">
              {todayLabel()}
            </p>
            <p className="mt-3 max-w-3xl text-lg font-extrabold leading-snug sm:text-xl">
              {headline}
            </p>
            <p className="mt-2 max-w-2xl text-sm text-white/65">
              Bookmark this page — check here before every crossing, cruise
              pickup or drive to the port.
            </p>
          </div>
          {data && (
            <p className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white/90">
              Live · updated {formatUpdated(data.updatedAt)}
            </p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {boxes.map((box) => (
            <TodayBoxCard key={box.id} box={box} />
          ))}
        </div>

        <p className="mt-4 text-center text-[11px] text-white/50">
          Tap a box for detail ·{" "}
          <Link href="#home-cruise" className="font-semibold text-kth-gold hover:underline">
            Cruise
          </Link>
          {" · "}
          <Link href="#home-ferries" className="font-semibold text-kth-gold hover:underline">
            Ferries
          </Link>
          {" · "}
          <Link href="#home-live" className="font-semibold text-kth-gold hover:underline">
            Live
          </Link>
          {" · "}
          <Link href="#home-weather" className="font-semibold text-kth-gold hover:underline">
            Weather
          </Link>
        </p>
      </div>
    </section>
  );
}
