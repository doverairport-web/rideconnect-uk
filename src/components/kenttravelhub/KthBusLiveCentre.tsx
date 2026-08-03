"use client";

import {
  formatBusStatus,
  formatBusTime,
  KTH_LONDON_COACH_STOP_IDS,
  KTH_NATIONAL_EXPRESS_HOME_URL,
  KTH_NATIONAL_EXPRESS_TICKETS_URL,
  KTH_STAGECOACH_HOME_URL,
  KTH_STAGECOACH_TICKETS_URL,
  type KthBusDeparture,
  type KthBusLiveBoard,
  type KthBusLiveDashboard,
  type KthBusStopId,
} from "@/lib/kenttravelhub/bus-live";
import Link from "next/link";
import { useEffect, useState } from "react";

const SEVERITY_DOT = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  alert: "bg-red-500",
} as const;

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DashboardBox({
  emoji,
  label,
  value,
  detail,
}: {
  emoji: string;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-xl border border-kth-navy/10 bg-white p-3.5 shadow-sm">
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-kth-muted">
        {emoji} {label}
      </p>
      <p className="mt-1.5 text-xl font-extrabold text-kth-navy">{value}</p>
      {detail ? (
        <p className="mt-1 line-clamp-2 text-[11px] text-kth-muted">{detail}</p>
      ) : null}
    </div>
  );
}

function BusRow({ bus }: { bus: KthBusDeparture }) {
  return (
    <tr className="border-b border-kth-navy/6 text-sm last:border-0">
      <td className="py-2 pr-2 font-bold text-kth-navy">{bus.routeNumber}</td>
      <td className="py-2 pr-2 text-kth-navy">{bus.destination}</td>
      <td className="hidden py-2 pr-2 text-kth-muted sm:table-cell">
        {bus.operator}
      </td>
      <td className="py-2 pr-2 tabular-nums">
        {formatBusTime(bus.scheduledTime)}
      </td>
      <td className="hidden py-2 pr-2 tabular-nums text-kth-muted md:table-cell">
        {bus.expectedTime ? formatBusTime(bus.expectedTime) : "—"}
      </td>
      <td className="py-2">
        <span
          className={
            bus.cancelled
              ? "font-semibold text-red-700"
              : bus.delayed
                ? "font-semibold text-amber-700"
                : "text-kth-muted"
          }
        >
          {formatBusStatus(bus.status, bus.expectedTime)}
        </span>
      </td>
    </tr>
  );
}

function BusLiveCard({
  board,
  bookUrl,
  highlight,
}: {
  board: KthBusLiveBoard;
  bookUrl: string;
  highlight?: boolean;
}) {
  const delayed = board.departures.filter((b) => b.delayed && !b.cancelled).length;
  const cancelled = board.departures.filter((b) => b.cancelled).length;
  const noLiveFeed = !board.liveAvailable && board.departures.length === 0;

  return (
    <article
      id={board.id}
      className={`scroll-mt-24 overflow-hidden rounded-2xl border bg-white shadow-sm ${
        highlight ? "border-kth-sea/40 ring-1 ring-kth-sea/20" : "border-kth-navy/10"
      }`}
    >
      <div
        className={`border-b border-kth-navy/8 px-5 py-4 text-white sm:px-6 ${
          highlight ? "bg-kth-sea" : "bg-kth-navy"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-gold">
              {board.areaLabel} · {highlight ? "Main stop" : "Live board"}
            </p>
            <h3 className="mt-1 font-serif text-2xl font-bold">{board.name}</h3>
            {board.featuredRoutes.length ? (
              <p className="mt-1 text-xs text-white/75">
                Routes {board.featuredRoutes.join(" · ")}
              </p>
            ) : null}
          </div>
          <p className="text-[10px] text-white/70">
            Updated {formatUpdated(board.updatedAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-3 border-b border-kth-navy/8 bg-kth-sand/50 p-4 sm:grid-cols-2 sm:p-5">
        <div className="rounded-lg border border-kth-navy/6 bg-white px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-kth-muted">Delays</p>
          <p className="mt-0.5 text-lg font-extrabold text-amber-700">{delayed}</p>
        </div>
        <div className="rounded-lg border border-kth-navy/6 bg-white px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-kth-muted">Cancelled</p>
          <p className="mt-0.5 text-lg font-extrabold text-red-700">{cancelled}</p>
        </div>
      </div>

      {noLiveFeed ? (
        <div className="border-b border-kth-navy/6 bg-kth-sand/30 px-5 py-8 text-center sm:px-6 sm:py-10">
          <p className="text-sm font-semibold text-kth-navy">Live bus board</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-kth-muted">
            Live bus data is being connected — use the official Stagecoach journey
            planner below.
          </p>
          <a
            href="https://www.stagecoachbus.com/journey-planner"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-kth-navy px-5 py-2.5 text-sm font-extrabold text-white hover:bg-kth-navy/90"
          >
            Stagecoach journey planner
          </a>
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          <h4 className="text-xs font-extrabold uppercase tracking-wide text-kth-sea">
            Live departures
          </h4>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[320px] text-left">
              <thead className="text-[10px] uppercase text-kth-muted">
                <tr>
                  <th className="pb-2">Route</th>
                  <th className="pb-2">Destination</th>
                  <th className="hidden pb-2 sm:table-cell">Operator</th>
                  <th className="pb-2">Sched</th>
                  <th className="hidden pb-2 md:table-cell">Exp</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {board.departures.length ? (
                  board.departures.map((bus) => <BusRow key={bus.id} bus={bus} />)
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-sm text-kth-muted">
                      No departures loaded —{" "}
                      <a
                        href={board.officialBoardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-kth-sea hover:underline"
                      >
                        open official timetable
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-kth-navy/8 bg-kth-sand/40 p-4 sm:flex-row sm:p-5">
        <a
          href={board.officialTimetableUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-lg border border-kth-navy/15 bg-white px-4 py-2.5 text-center text-sm font-bold text-kth-navy hover:border-kth-sea/40"
        >
          Official timetable
        </a>
        <Link
          href={bookUrl}
          className="inline-flex flex-1 items-center justify-center rounded-lg border border-kth-navy/15 bg-white px-4 py-2.5 text-center text-sm font-bold text-kth-navy hover:border-kth-sea/40"
        >
          Book taxi from {board.name}
        </Link>
      </div>
      <p className="border-t border-kth-navy/6 bg-kth-sand/20 px-5 py-2.5 text-[11px] text-kth-muted sm:px-6">
        Live data from{" "}
        <span className="font-semibold text-kth-navy">{board.source}</span>
        {" · "}last refreshed {formatUpdated(board.updatedAt)}
      </p>
    </article>
  );
}

function StopCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-kth-navy/10 bg-white shadow-sm"
      aria-hidden
    >
      <div className="h-24 animate-pulse bg-kth-navy/20" />
      <div className="p-5">
        <div className="h-4 w-28 animate-pulse rounded bg-kth-navy/10" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-kth-navy/6" />
          ))}
        </div>
      </div>
    </div>
  );
}

type GuideLink = KthBusLiveDashboard["guides"][number];
type OfficialLink = KthBusLiveDashboard["officialLinks"][number];

type Props = {
  bookUrls: Record<KthBusStopId, string>;
  guides: GuideLink[];
  officialLinks: OfficialLink[];
  bookBase: string;
};

export function KthBusLiveCentre({
  bookUrls,
  guides,
  officialLinks,
  bookBase,
}: Props) {
  const [data, setData] = useState<KthBusLiveDashboard | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load(background = false) {
      if (background) setRefreshing(true);
      try {
        const res = await fetch("/api/kenttravelhub/buses/live", {
          cache: "no-store",
        });
        if (!cancelled && res.ok) {
          setData((await res.json()) as KthBusLiveDashboard);
        }
      } catch {
        /* keep existing dashboard on background refresh failure */
      } finally {
        if (!cancelled) {
          setInitialLoad(false);
          setRefreshing(false);
        }
      }
    }

    void load(false);
    const interval = setInterval(() => void load(true), 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const topDisruption = data?.disruptions[0];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-kth-navy/10 bg-kth-navy p-5 text-white sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-gold">
              Bus live dashboard
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
              Dover &amp; Kent buses right now
            </h2>
          </div>
          {data ? (
            <p
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-opacity ${
                refreshing ? "bg-white/20 text-white/90" : "bg-white/10"
              }`}
              aria-live="polite"
            >
              {refreshing
                ? "Refreshing…"
                : `Updated ${formatUpdated(data.updatedAt)} · auto-refresh 60s`}
            </p>
          ) : initialLoad ? (
            <p className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold">
              Loading live data…
            </p>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9">
          <DashboardBox
            emoji="🚌"
            label="Next from town centre"
            value={
              data?.nextDeparture
                ? formatBusTime(
                    data.nextDeparture.expectedTime ?? data.nextDeparture.scheduledTime,
                  )
                : "—"
            }
            detail={
              data?.nextDeparture
                ? `${data.nextDeparture.routeNumber} → ${data.nextDeparture.destination}`
                : undefined
            }
          />
          <DashboardBox
            emoji="🏙"
            label="Next coach to London"
            value={
              data?.nextLondonDeparture
                ? formatBusTime(
                    data.nextLondonDeparture.expectedTime ??
                      data.nextLondonDeparture.scheduledTime,
                  )
                : "—"
            }
            detail={
              data?.nextLondonDeparture
                ? `NX ${data.nextLondonDeparture.routeNumber} → ${data.nextLondonDeparture.destination}`
                : "National Express 007 · Victoria"
            }
          />
          <DashboardBox
            emoji="🚆"
            label="Buses to Priory"
            value={data ? String(data.toPriory.length) : "—"}
            detail={data?.toPriory[0] ? `Next: ${data.toPriory[0].routeNumber} ${formatBusTime(data.toPriory[0].scheduledTime)}` : "Routes 63 · 66 · D"}
          />
          <DashboardBox
            emoji="🚢"
            label="Buses to Cruise Terminal"
            value={data ? String(data.toCruiseTerminal.length) : "—"}
            detail={data?.toCruiseTerminal[0] ? `Route ${data.toCruiseTerminal[0].routeNumber}` : "Route 66 · Gateway"}
          />
          <DashboardBox
            emoji="⛴"
            label="Buses to Ferry Terminal"
            value={data ? String(data.toFerryTerminal.length) : "—"}
            detail={data?.toFerryTerminal[0] ? `Route ${data.toFerryTerminal[0].routeNumber}` : "Route 66 · Eastern Docks"}
          />
          <DashboardBox
            emoji="⚠"
            label="Delayed buses"
            value={data ? String(data.delayed) : "—"}
          />
          <DashboardBox
            emoji="❌"
            label="Cancelled buses"
            value={data ? String(data.cancelled) : "—"}
          />
          <DashboardBox
            emoji="📢"
            label="Stagecoach alerts"
            value={topDisruption ? "Check" : "—"}
            detail={topDisruption?.title}
          />
          <DashboardBox
            emoji="🚕"
            label="Taxi if buses delayed"
            value="Book"
            detail="Pre-book if route 66 or 15 is late"
          />
        </div>

        {data && data.delayed > 0 ? (
          <div className="mt-4 rounded-xl border border-amber-300/30 bg-amber-500/10 p-4">
            <p className="text-sm text-white/90">
              Buses are running late on today&apos;s boards —{" "}
              <Link href={bookBase} className="font-bold text-kth-gold hover:underline">
                book a taxi
              </Link>{" "}
              if you have a ship or train connection.
            </p>
          </div>
        ) : null}
      </section>

      {data?.disruptions.length ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">
            Stagecoach service alerts
          </p>
          <ul className="mt-3 space-y-3">
            {data.disruptions.slice(0, 4).map((alert) => (
              <li key={alert.id} className="flex items-start gap-2 text-sm">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[alert.severity]}`}
                />
                <div>
                  <p className="font-bold text-kth-navy">{alert.title}</p>
                  <p className="text-kth-muted">{alert.detail}</p>
                  {alert.url ? (
                    <a
                      href={alert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs font-semibold text-kth-sea hover:underline"
                    >
                      Full update
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-kth-sea/25 bg-kth-sand p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-sea">
            Stagecoach tickets
          </p>
          <h2 className="mt-2 font-serif text-xl font-bold text-kth-navy sm:text-2xl">
            Buy bus tickets online — save vs paying on the bus
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-kth-muted">
            Dover routes 15, 63, 66, 91 and more — buy on{" "}
            <a
              href={KTH_STAGECOACH_HOME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-kth-sea hover:underline"
            >
              stagecoachbus.com
            </a>{" "}
            or the Stagecoach app. Online and app fares are usually cheaper than
            cash on board.
          </p>
        </div>
        <div className="mt-4 flex shrink-0 flex-col gap-2 sm:mt-0">
          <a
            href={KTH_STAGECOACH_TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-kth-gold px-5 py-2.5 text-center text-sm font-extrabold text-kth-navy shadow-sm transition hover:bg-kth-gold-dark"
          >
            Buy Stagecoach tickets
          </a>
          <a
            href="https://www.stagecoachbus.com/journey-planner"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-kth-navy/15 bg-white px-5 py-2.5 text-center text-sm font-bold text-kth-navy hover:border-kth-sea/40"
          >
            Journey planner
          </a>
        </div>
      </section>

      <section className="rounded-2xl border border-kth-navy/10 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-sea">
          Official bus links
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {officialLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-kth-navy/10 bg-kth-sand/40 px-4 py-2.5 text-sm font-bold text-kth-navy hover:border-kth-sea/30"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-kth-navy/10 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-sea">
          Dover transfer guide
        </p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-kth-navy">
          Buses between port, station, Kent towns &amp; London
        </h2>
        <p className="mt-2 text-sm text-kth-muted">
          Live Stagecoach boards for Dover and Kent — plus National Express coaches
          to London Victoria from Dover, Folkestone and Canterbury.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) =>
            guide.external ? (
              <a
                key={guide.id}
                href={guide.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-kth-navy/10 bg-kth-sand/40 p-4 transition hover:border-kth-sea/30"
              >
                <p className="font-bold text-kth-navy">{guide.label}</p>
                <p className="mt-1 text-sm text-kth-muted">{guide.detail}</p>
              </a>
            ) : (
              <Link
                key={guide.id}
                href={guide.href}
                className="rounded-xl border border-kth-navy/10 bg-kth-sand/40 p-4 transition hover:border-kth-sea/30"
              >
                <p className="font-bold text-kth-navy">{guide.label}</p>
                <p className="mt-1 text-sm text-kth-muted">{guide.detail}</p>
              </Link>
            ),
          )}
        </div>
      </section>

      <div className="grid gap-8">
        {data?.stops
          .filter((board) => !KTH_LONDON_COACH_STOP_IDS.includes(board.id))
          .map((board) => (
            <BusLiveCard
              key={board.id}
              board={board}
              bookUrl={bookUrls[board.id]}
              highlight={board.id === data.mainStopId}
            />
          ))}

        {data?.stops.some((board) => KTH_LONDON_COACH_STOP_IDS.includes(board.id)) ? (
          <section className="rounded-2xl border border-[#D40511]/25 bg-[#D40511]/5 p-5 sm:p-6">
            <div className="sm:flex sm:items-start sm:justify-between sm:gap-6">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D40511]">
                  National Express · London Victoria
                </p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-kth-navy">
                  Coaches to London
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-kth-muted">
                  Route 007 from Dover Pencester Road (Stop Y), Folkestone and Canterbury —
                  about 2½–3 hours to Victoria Coach Station. Book in advance on{" "}
                  <a
                    href={KTH_NATIONAL_EXPRESS_HOME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-kth-sea hover:underline"
                  >
                    nationalexpress.com
                  </a>{" "}
                  — online fares are often cheaper than buying at the coach station.
                </p>
              </div>
              <div className="mt-4 flex shrink-0 flex-col gap-2 sm:mt-0">
                <a
                  href={KTH_NATIONAL_EXPRESS_TICKETS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#D40511] px-5 py-2.5 text-center text-sm font-extrabold text-white shadow-sm transition hover:bg-[#b8040e]"
                >
                  Buy National Express tickets
                </a>
                <a
                  href="https://timetables.nationalexpress.com/routes/NX/007/Dover_Town_Centre-London/I"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-kth-navy/15 bg-white px-5 py-2.5 text-center text-sm font-bold text-kth-navy hover:border-kth-sea/40"
                >
                  Route 007 timetable
                </a>
              </div>
            </div>
            <div className="mt-6 grid gap-8">
              {data.stops
                .filter((board) => KTH_LONDON_COACH_STOP_IDS.includes(board.id))
                .map((board) => (
                  <BusLiveCard
                    key={board.id}
                    board={board}
                    bookUrl={bookUrls[board.id]}
                  />
                ))}
            </div>
          </section>
        ) : null}

        {!data &&
          (initialLoad ? (
            <>
              <StopCardSkeleton />
              <StopCardSkeleton />
              <StopCardSkeleton />
            </>
          ) : (
            <p className="text-sm text-kth-muted">
              Live bus boards could not be loaded. Try refreshing the page.
            </p>
          ))}
      </div>
    </div>
  );
}
