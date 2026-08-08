"use client";

import { KthTodayInDover } from "@/components/kenttravelhub/KthTodayInDover";
import { KthVisitPlannerContent } from "@/components/kenttravelhub/KthVisitPlannerContent";
import type { CruiseScheduleEntry, LiveSeverity, LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import {
  buildWeatherTravelImpacts,
  KTH_CRUISE_PICKUP_BY_TERMINAL,
  KTH_DAILY_QUESTIONS,
  KTH_FERRY_CHECK_IN_TODAY,
  KTH_TAXI_PICKUP_ADVICE,
} from "@/lib/kenttravelhub/home-dashboard";
import { KTH_LIVE_EXTERNAL_LINKS } from "@/lib/kenttravelhub/live-links";
import type { KthSiteSection } from "@/lib/kenttravelhub/sections";
import type { FerryArrivalEntry } from "@/lib/kenttravelhub/fetchers/ferry-arrivals";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

const SEVERITY_DOT = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  alert: "bg-red-500",
  neutral: "bg-kth-muted/40",
} as const;

const ANSWER_STYLES = {
  ok: "border-emerald-200 bg-emerald-50 text-emerald-950",
  warn: "border-amber-200 bg-amber-50 text-amber-950",
  alert: "border-red-200 bg-red-50 text-red-950",
  neutral: "border-kth-navy/10 bg-kth-sand/50 text-kth-navy",
} as const;

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DailySection({
  id,
  section,
  question,
  answer,
  answerSeverity = "neutral",
  updatedAt,
  children,
  bg = "bg-white",
}: {
  id: string;
  section: { homeHeading: string; shortLabel: string; emoji: string };
  question: string;
  answer: string;
  answerSeverity?: LiveSeverity | "neutral";
  updatedAt?: string;
  children: ReactNode;
  bg?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-[7.5rem] border-b border-kth-navy/8 ${bg} py-8 sm:py-10`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-3xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-kth-sea">
              {section.homeHeading}
            </p>
            <h2 className="mt-2 text-base font-semibold leading-snug text-kth-muted sm:text-lg">
              {question}
            </h2>
          </div>
          {updatedAt && (
            <p className="shrink-0 text-[11px] font-bold text-kth-muted">
              Updated {formatUpdated(updatedAt)}
            </p>
          )}
        </div>

        <div
          className={`mt-4 rounded-xl border px-4 py-3.5 sm:px-5 ${ANSWER_STYLES[answerSeverity]}`}
        >
          <div className="flex items-start gap-2">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[answerSeverity]}`}
              aria-hidden
            />
            <p className="text-sm font-extrabold leading-snug sm:text-base">
              {answer}
            </p>
          </div>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-kth-navy/8 bg-white">
      <table className="w-full min-w-[320px] text-left text-sm">
        <thead>
          <tr className="border-b border-kth-navy/8 bg-kth-sand/60">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-kth-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-b border-kth-navy/6 last:border-0">
              {cells.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-kth-navy">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CruiseShipRow({ ship }: { ship: CruiseScheduleEntry }) {
  const departs = ship.departs && ship.departs !== "—" ? ship.departs : "—";
  const terminal = ship.terminal?.trim() || "TBC";
  return (
    <tr className="border-b border-kth-navy/6 last:border-0">
      <td className="px-4 py-3 font-bold">{ship.name}</td>
      <td className="px-4 py-3">{ship.arrives}</td>
      <td className="px-4 py-3">{departs}</td>
      <td className="px-4 py-3 font-semibold text-kth-sea">{terminal}</td>
    </tr>
  );
}

function FerryRow({ ferry }: { ferry: FerryArrivalEntry }) {
  const status =
    ferry.status === "in-port"
      ? "In port"
      : ferry.status === "arriving"
        ? "Arriving"
        : "Scheduled";
  return (
    <tr className="border-b border-kth-navy/6 last:border-0">
      <td className="px-4 py-3 font-bold">
        {ferry.operator}
      </td>
      <td className="px-4 py-3">{ferry.route}</td>
      <td className="px-4 py-3">{ferry.arrives}</td>
      <td className="px-4 py-3 text-kth-sea">{status}</td>
    </tr>
  );
}

function SectionLinks({
  links,
}: {
  links: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="rounded-lg border border-kth-navy/10 bg-white px-3 py-2 text-xs font-bold text-kth-sea hover:border-kth-sea/40"
          {...(link.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {link.label} →
        </Link>
      ))}
    </div>
  );
}

export type KthHomeDashboardPaths = {
  sections: Record<string, string>;
  cruiseSchedule: string;
  cruiseTerminal: string;
  ferryTimetable: string;
};

type Props = {
  sections: KthSiteSection[];
  paths: KthHomeDashboardPaths;
};

export function KthHomeDashboardClient({ sections, paths }: Props) {
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

  const byId = Object.fromEntries(sections.map((s) => [s.id, s])) as Record<
    string,
    KthSiteSection
  >;

  const todayShips = data?.cruiseCalendar.today ?? [];
  const ferryArrivals = data?.ferryArrivals ?? [];
  const weatherImpacts = buildWeatherTravelImpacts(data);

  const cruiseAnswer = (() => {
    if (!data) return "Loading today's ship schedule…";
    if (todayShips.length === 0) {
      return "No cruise ships listed in Dover today — check the full schedule for upcoming calls.";
    }
    const lines = todayShips.map(
      (s) =>
        `${s.name} arrives ${s.arrives}, departs ${s.departs === "—" ? "TBC" : s.departs} at ${s.terminal || "TBC"}`,
    );
    return `${todayShips.length} ship${todayShips.length === 1 ? "" : "s"} today: ${lines.join("; ")}. Pickup at CT1 forecourt rank or CT2 Western Docks approach.`;
  })();

  const ferryAnswer = (() => {
    if (!data) return "Loading ferry status…";
    const delay =
      data.ferryDelays.severity !== "ok"
        ? `Delay warning: ${data.ferryDelays.detail.slice(0, 100)}`
        : "No delays flagged — DFDS and P&O running normally.";
    const next = ferryArrivals
      .slice(0, 2)
      .map((f) => `${f.operator} from ${f.route} at ${f.arrives}`)
      .join("; ");
    const sailings = next ? ` Next arrivals: ${next}.` : "";
    return `${delay}${sailings} Check in 60–90 min before your sailing.`;
  })();

  const liveAnswer = (() => {
    if (!data) return "Loading port and road status…";
    const port =
      data.doverPortTraffic.severity === "ok"
        ? "Port moving normally"
        : data.doverPortTraffic.severity === "warn"
          ? "Port is busy"
          : "Port is very busy";
    const m20 = data.m20JourneyMinutes
      ? `M20 ${data.m20JourneyMinutes} min to Dover${data.m20DelayMinutes ? ` (+${data.m20DelayMinutes} min delay)` : ""}`
      : data.m20Traffic.severity === "ok"
        ? "M20 no major delays"
        : "M20 delays reported";
    const brock = data.operationBrock.active
      ? "Operation Brock is ACTIVE"
      : "Operation Brock is not active";
    return `${port}. ${m20}. ${brock}.`;
  })();

  const weatherAnswer = (() => {
    if (!data) return "Loading weather impact…";
    const bad = weatherImpacts.severity !== "ok";
    return bad
      ? `${data.weather.tempC}°C and ${data.weather.label} — weather may slow driving, port queues and cruise pickup today.`
      : `${data.weather.tempC}°C and ${data.weather.label} — low impact on ferries, port and driving today.`;
  })();

  const visitAnswer =
    "With 2 hours: stay in Dover town or seafront. With 4 hours: Dover Castle or White Cliffs. Full day: Canterbury or Deal — always book a return taxi time.";

  const cruiseSeverity: LiveSeverity | "neutral" =
    todayShips.length >= 2 ? "warn" : todayShips.length ? "ok" : "neutral";
  const ferrySeverity = data?.ferryDelays.severity ?? "neutral";
  const liveSeverity =
    data?.operationBrock.active || data?.doverPortTraffic.severity === "alert"
      ? "warn"
      : data?.doverPortTraffic.severity ?? "neutral";

  const navSections: Array<
    Pick<KthSiteSection, "id" | "shortLabel" | "homeHeading" | "emoji">
  > = [
    byId.cruise,
    byId.ferries,
    byId.live,
    {
      id: "weather",
      shortLabel: "Weather",
      homeHeading: "Weather today",
      emoji: "🌤",
    },
    byId.visit,
  ].filter(Boolean) as Array<
    Pick<KthSiteSection, "id" | "shortLabel" | "homeHeading" | "emoji">
  >;

  return (
    <>
      <KthTodayInDover data={data} />

      <nav
        className="sticky top-[57px] z-40 border-b border-kth-navy/8 bg-white/95 backdrop-blur-sm"
        aria-label="Daily checks"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 scrollbar-none sm:px-6">
          <a
            href="#today-in-dover"
            className="shrink-0 rounded-full bg-kth-navy px-3.5 py-2 text-xs font-bold text-white"
          >
            Today
          </a>
          {navSections.map((section) => (
            <a
              key={section.id}
              href={`#home-${section.id}`}
              className="shrink-0 rounded-full bg-kth-sand px-3.5 py-2 text-xs font-bold text-kth-navy hover:bg-kth-navy hover:text-white"
            >
              {section.shortLabel}
            </a>
          ))}
        </div>
      </nav>

      {byId.cruise && (
        <DailySection
          id="home-cruise"
          section={byId.cruise}
          question={KTH_DAILY_QUESTIONS.cruise}
          answer={cruiseAnswer}
          answerSeverity={cruiseSeverity}
          updatedAt={data?.updatedAt}
        >
          {todayShips.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-kth-navy/8 bg-white">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-kth-navy/8 bg-kth-sand/60">
                    {["Ship", "Arrives", "Departs", "Terminal / pickup"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-kth-muted"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {todayShips.map((ship) => (
                    <CruiseShipRow
                      key={`${ship.name}-${ship.arrives}`}
                      ship={ship}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {KTH_CRUISE_PICKUP_BY_TERMINAL.map((row) => (
              <div
                key={row.terminal}
                className="rounded-lg border border-kth-navy/8 bg-kth-sand/30 px-4 py-3"
              >
                <p className="text-xs font-extrabold text-kth-sea">
                  {row.terminal}
                </p>
                <p className="mt-1 text-sm text-kth-navy/85">{row.pickup}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-kth-muted">{KTH_TAXI_PICKUP_ADVICE.cruise}</p>
          <SectionLinks
            links={[
              { href: paths.sections.cruise, label: "Full cruise schedule" },
              { href: paths.cruiseTerminal, label: "Terminal pickup map" },
              {
                href: paths.cruiseSchedule,
                label: "Port of Dover schedule",
                external: true,
              },
            ]}
          />
        </DailySection>
      )}

      {byId.ferries && (
        <DailySection
          id="home-ferries"
          section={byId.ferries}
          question={KTH_DAILY_QUESTIONS.ferries}
          answer={ferryAnswer}
          answerSeverity={ferrySeverity}
          updatedAt={data?.updatedAt}
          bg="bg-kth-sand/40"
        >
          {ferryArrivals.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-kth-navy/8 bg-white">
              <table className="w-full min-w-[400px] text-left text-sm">
                <thead>
                  <tr className="border-b border-kth-navy/8 bg-kth-sand/60">
                    {["Operator", "Route", "Arrives", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-kth-muted"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ferryArrivals.slice(0, 5).map((ferry) => (
                    <FerryRow
                      key={`${ferry.operator}-${ferry.route}-${ferry.arrives}`}
                      ferry={ferry}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {KTH_FERRY_CHECK_IN_TODAY.map((tip) => (
              <li
                key={tip.id}
                className="rounded-lg border border-kth-navy/8 bg-white px-4 py-3"
              >
                <p className="text-xs font-extrabold text-kth-sea">{tip.title}</p>
                <p className="mt-1 text-sm text-kth-navy/85">{tip.detail}</p>
              </li>
            ))}
          </ul>
          <SectionLinks
            links={[
              { href: paths.sections.ferries, label: "Ferry updates page" },
              {
                href: paths.ferryTimetable,
                label: "DFDS timetables",
                external: true,
              },
              {
                href: KTH_LIVE_EXTERNAL_LINKS.ferry.href,
                label: "DFDS travel updates",
                external: true,
              },
            ]}
          />
        </DailySection>
      )}

      {byId.live && (
        <DailySection
          id="home-live"
          section={byId.live}
          question={KTH_DAILY_QUESTIONS.live}
          answer={liveAnswer}
          answerSeverity={liveSeverity}
          updatedAt={data?.updatedAt}
        >
          <DataTable
            headers={["Check", "Status", "Detail"]}
            rows={[
              [
                "Dover Port",
                data?.doverPortTraffic.severity === "ok" ? "Normal" : "Busy",
                data?.doverPortTraffic.detail.slice(0, 80) ?? "—",
              ],
              [
                "M20 → Dover",
                data?.m20JourneyMinutes
                  ? `${data.m20JourneyMinutes} min`
                  : "Check",
                data?.m20Traffic.detail.slice(0, 80) ?? "—",
              ],
              [
                "Operation Brock",
                data?.operationBrock.active ? "Active" : "Off",
                data?.operationBrock.detail.slice(0, 80) ?? "—",
              ],
            ]}
          />
          <SectionLinks
            links={[
              { href: paths.sections.live, label: "Full live board & cameras" },
              {
                href: KTH_LIVE_EXTERNAL_LINKS.m20.href,
                label: "National Highways",
                external: true,
              },
            ]}
          />
        </DailySection>
      )}

      {byId.live && (
        <DailySection
          id="home-weather"
          section={{
            homeHeading: "Weather today",
            shortLabel: "Weather",
            emoji: "🌤",
          }}
          question={KTH_DAILY_QUESTIONS.weather}
          answer={weatherAnswer}
          answerSeverity={weatherImpacts.severity}
          updatedAt={data?.updatedAt}
          bg="bg-kth-sand/40"
        >
          <DataTable
            headers={["Area", "Today's impact"]}
            rows={[
              ["Ferries", weatherImpacts.ferries],
              ["Port queues", weatherImpacts.portQueues],
              ["Cruise passengers", weatherImpacts.cruisePassengers],
              ["Driving A20/M20", weatherImpacts.driving],
            ]}
          />
          <SectionLinks
            links={[
              {
                href: KTH_LIVE_EXTERNAL_LINKS.weather.href,
                label: "Met Office Dover forecast",
                external: true,
              },
            ]}
          />
        </DailySection>
      )}

      {byId.visit && (
        <DailySection
          id="home-visit"
          section={byId.visit}
          question={KTH_DAILY_QUESTIONS.visit}
          answer={visitAnswer}
          answerSeverity="neutral"
        >
          <KthVisitPlannerContent visitHref={paths.sections.visit} />
        </DailySection>
      )}
    </>
  );
}
