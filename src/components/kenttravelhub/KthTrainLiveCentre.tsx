"use client";

import {
  formatTrainStatus,
  formatTrainTime,
  KTH_NATIONAL_RAIL_TICKETS_URL,
  KTH_SOUTHEASTERN_HOME_URL,
  KTH_SOUTHEASTERN_TICKETS_URL,
  KTH_TRAIN_OFFICIAL_LINKS,
  nationalRailBoardUrl,
  type KthStationId,
  type KthTrainLiveBoard,
  type KthTrainLiveDashboard,
  type KthTrainService,
} from "@/lib/kenttravelhub/train-live";
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

function TrainRow({ train }: { train: KthTrainService }) {
  return (
    <tr className="border-b border-kth-navy/6 text-sm last:border-0">
      <td className="py-2 pr-2 font-bold text-kth-navy">{train.routeLabel}</td>
      <td className="hidden py-2 pr-2 text-kth-muted sm:table-cell">
        {train.operator}
      </td>
      <td className="py-2 pr-2 tabular-nums">
        {formatTrainTime(train.scheduledTime)}
      </td>
      <td className="hidden py-2 pr-2 tabular-nums text-kth-muted md:table-cell">
        {train.expectedTime ? formatTrainTime(train.expectedTime) : "—"}
      </td>
      <td className="hidden py-2 pr-2 text-kth-muted lg:table-cell">
        {train.platform ?? "—"}
      </td>
      <td className="py-2">
        <span
          className={
            train.cancelled
              ? "font-semibold text-red-700"
              : train.delayed
                ? "font-semibold text-amber-700"
                : "text-kth-muted"
          }
        >
          {formatTrainStatus(train.status, train.expectedTime)}
        </span>
      </td>
    </tr>
  );
}

function TrainLiveCard({
  board,
  bookUrl,
  highlight,
}: {
  board: KthTrainLiveBoard;
  bookUrl: string;
  highlight?: boolean;
}) {
  const delayed = [...board.arrivals, ...board.departures].filter(
    (t) => t.delayed && !t.cancelled,
  ).length;
  const cancelled = [...board.arrivals, ...board.departures].filter(
    (t) => t.cancelled,
  ).length;
  const noLiveFeed =
    !board.liveAvailable &&
    board.arrivals.length === 0 &&
    board.departures.length === 0;

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
              {board.crs} · {highlight ? "Main station" : "Live board"}
            </p>
            <h3 className="mt-1 font-serif text-2xl font-bold">{board.name}</h3>
          </div>
          <p className="text-[10px] text-white/70">
            Updated {formatUpdated(board.updatedAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-3 border-b border-kth-navy/8 bg-kth-sand/50 p-4 sm:grid-cols-0 sm:p-5 lg:grid-cols-2">
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
          <p className="text-sm font-semibold text-kth-navy">Live train board</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-kth-muted">
            Live train data is being connected — use the official National Rail
            board below.
          </p>
          <a
            href={board.officialBoardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-kth-navy px-5 py-2.5 text-sm font-extrabold text-white hover:bg-kth-navy/90"
          >
            Open official {board.crs} board
          </a>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2">
          <div className="border-b border-kth-navy/6 p-4 sm:p-5 lg:border-b-0 lg:border-r">
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-kth-sea">
              Live departures
            </h4>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[320px] text-left">
                <thead className="text-[10px] uppercase text-kth-muted">
                  <tr>
                    <th className="pb-2">To</th>
                    <th className="hidden pb-2 sm:table-cell">Operator</th>
                    <th className="pb-2">Sched</th>
                    <th className="hidden pb-2 md:table-cell">Exp</th>
                    <th className="hidden pb-2 lg:table-cell">Plat</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {board.departures.length ? (
                    board.departures.map((t) => <TrainRow key={t.id} train={t} />)
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 text-sm text-kth-muted">
                        No departures loaded —{" "}
                        <a
                          href={nationalRailBoardUrl(board.crs, "dep")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-kth-sea hover:underline"
                        >
                          open official board
                        </a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-kth-sea">
              Live arrivals
            </h4>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[320px] text-left">
                <thead className="text-[10px] uppercase text-kth-muted">
                  <tr>
                    <th className="pb-2">From</th>
                    <th className="hidden pb-2 sm:table-cell">Operator</th>
                    <th className="pb-2">Sched</th>
                    <th className="hidden pb-2 md:table-cell">Exp</th>
                    <th className="hidden pb-2 lg:table-cell">Plat</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {board.arrivals.length ? (
                    board.arrivals.map((t) => <TrainRow key={t.id} train={t} />)
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 text-sm text-kth-muted">
                        No arrivals loaded —{" "}
                        <a
                          href={nationalRailBoardUrl(board.crs, "arr")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-kth-sea hover:underline"
                        >
                          open official board
                        </a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-kth-navy/8 bg-kth-sand/40 p-4 sm:flex-row sm:p-5">
        <a
          href={board.officialBoardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-lg border border-kth-navy/15 bg-white px-4 py-2.5 text-center text-sm font-bold text-kth-navy hover:border-kth-sea/40"
        >
          Official {board.crs} station board
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

function StationCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-kth-navy/10 bg-white shadow-sm"
      aria-hidden
    >
      <div className="h-24 animate-pulse bg-kth-navy/20" />
      <div className="grid min-h-[280px] lg:grid-cols-2">
        <div className="border-b border-kth-navy/6 p-5 lg:border-b-0 lg:border-r">
          <div className="h-4 w-28 animate-pulse rounded bg-kth-navy/10" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-kth-navy/6" />
            ))}
          </div>
        </div>
        <div className="p-5">
          <div className="h-4 w-24 animate-pulse rounded bg-kth-navy/10" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-kth-navy/6" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type GuideLink = KthTrainLiveDashboard["guides"][number];

type Props = {
  bookUrls: Record<KthStationId, string>;
  guides: GuideLink[];
};

export function KthTrainLiveCentre({ bookUrls, guides }: Props) {
  const [data, setData] = useState<KthTrainLiveDashboard | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load(background = false) {
      if (background) setRefreshing(true);
      try {
        const res = await fetch("/api/kenttravelhub/trains/live", {
          cache: "no-store",
        });
        if (!cancelled && res.ok) {
          setData((await res.json()) as KthTrainLiveDashboard);
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

  const cruiseTransfer = data?.transfers.find((t) => t.id === "cruise-terminal");
  const ferryTransfer = data?.transfers.find((t) => t.id === "ferry-terminal");
  const topDisruption = data?.disruptions[0];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-kth-navy/10 bg-kth-navy p-5 text-white sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-gold">
              Train live dashboard
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
              Dover Priory &amp; Kent stations right now
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

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          <DashboardBox
            emoji="🚆"
            label="Next from Dover Priory"
            value={
              data?.nextDeparture
                ? formatTrainTime(
                    data.nextDeparture.expectedTime ?? data.nextDeparture.scheduledTime,
                  )
                : "—"
            }
            detail={
              data?.nextDeparture
                ? `${data.nextDeparture.routeLabel} · plat ${data.nextDeparture.platform ?? "TBC"}`
                : undefined
            }
          />
          <DashboardBox
            emoji="🚄"
            label="Trains to London"
            value={data ? String(data.londonDepartures.length) : "—"}
            detail={
              data?.londonDepartures[0]
                ? `Next: ${data.londonDepartures[0].routeLabel} ${formatTrainTime(data.londonDepartures[0].scheduledTime)}`
                : "St Pancras & Victoria services"
            }
          />
          <DashboardBox
            emoji="⚠"
            label="Delayed trains"
            value={data ? String(data.delayed) : "—"}
          />
          <DashboardBox
            emoji="❌"
            label="Cancelled trains"
            value={data ? String(data.cancelled) : "—"}
          />
          <DashboardBox
            emoji="📢"
            label="Southeastern alerts"
            value={topDisruption ? "Active" : "—"}
            detail={topDisruption?.title}
          />
          <DashboardBox
            emoji="🚢"
            label="Priory → Cruise Terminal"
            value={
              cruiseTransfer ? `${cruiseTransfer.journeyMinutes} min` : "—"
            }
            detail={
              cruiseTransfer?.delayMinutes
                ? `+${cruiseTransfer.delayMinutes} min traffic`
                : cruiseTransfer?.staticEstimate
            }
          />
          <DashboardBox
            emoji="⛴"
            label="Priory → Ferry Terminal"
            value={ferryTransfer ? `${ferryTransfer.journeyMinutes} min` : "—"}
            detail={
              ferryTransfer?.delayMinutes
                ? `+${ferryTransfer.delayMinutes} min traffic`
                : ferryTransfer?.staticEstimate
            }
          />
        </div>
      </section>

      {data?.disruptions.length ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">
            Southeastern disruption alerts
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
            Train tickets
          </p>
          <h2 className="mt-2 font-serif text-xl font-bold text-kth-navy sm:text-2xl">
            Buy train tickets online — save with advance fares
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-kth-muted">
            Dover Priory to London St Pancras, Victoria and Ashford connections —
            book on{" "}
            <a
              href={KTH_SOUTHEASTERN_HOME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-kth-sea hover:underline"
            >
              Southeastern
            </a>{" "}
            or compare fares on National Rail. Advance tickets are usually cheaper
            than buying on the day at the station.
          </p>
        </div>
        <div className="mt-4 flex shrink-0 flex-col gap-2 sm:mt-0">
          <a
            href={KTH_SOUTHEASTERN_TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-kth-gold px-5 py-2.5 text-center text-sm font-extrabold text-kth-navy shadow-sm transition hover:bg-kth-gold-dark"
          >
            Buy Southeastern tickets
          </a>
          <a
            href={KTH_NATIONAL_RAIL_TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-kth-navy/15 bg-white px-5 py-2.5 text-center text-sm font-bold text-kth-navy hover:border-kth-sea/40"
          >
            National Rail tickets
          </a>
        </div>
      </section>

      <section className="rounded-2xl border border-kth-navy/10 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-sea">
          Official rail links
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {KTH_TRAIN_OFFICIAL_LINKS.map((link) => (
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
          From Dover Priory to port, castle &amp; London
        </h2>
        <p className="mt-2 text-sm text-kth-muted">
          Live train boards are the focus — use these links when you need a taxi
          or connection after your train arrives.
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
        {data?.stations.map((board) => (
          <TrainLiveCard
            key={board.id}
            board={board}
            bookUrl={bookUrls[board.id]}
            highlight={board.id === data.mainStationId}
          />
        )) ??
          (initialLoad ? (
            <>
              <StationCardSkeleton />
              <StationCardSkeleton />
              <StationCardSkeleton />
            </>
          ) : (
            <p className="text-sm text-kth-muted">
              Live train boards could not be loaded. Try refreshing the page.
            </p>
          ))}
      </div>
    </div>
  );
}
