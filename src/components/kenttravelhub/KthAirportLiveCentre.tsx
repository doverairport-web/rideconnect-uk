"use client";

import {
  formatFlightTime,
  type KthAirportFlight,
  type KthAirportId,
  type KthAirportLiveBoard,
  type KthAirportLiveDashboard,
} from "@/lib/kenttravelhub/airport-live";
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

function FlightRow({ flight }: { flight: KthAirportFlight }) {
  return (
    <tr className="border-b border-kth-navy/6 text-sm last:border-0">
      <td className="py-2 pr-2 font-bold text-kth-navy">{flight.flightNumber}</td>
      <td className="hidden py-2 pr-2 text-kth-muted sm:table-cell">
        {flight.routeLabel}
      </td>
      <td className="py-2 pr-2 tabular-nums">
        {formatFlightTime(flight.scheduledTime)}
      </td>
      <td className="hidden py-2 pr-2 tabular-nums text-kth-muted md:table-cell">
        {flight.estimatedTime
          ? formatFlightTime(flight.estimatedTime)
          : "—"}
      </td>
      <td className="py-2">
        <span
          className={
            flight.cancelled
              ? "font-semibold text-red-700"
              : flight.delayed
                ? "font-semibold text-amber-700"
                : "text-kth-muted"
          }
        >
          {flight.status}
        </span>
      </td>
      <td className="hidden py-2 text-kth-muted lg:table-cell">
        {flight.terminal ?? "—"}
      </td>
    </tr>
  );
}

function AirportLiveCard({
  board,
  bookUrl,
}: {
  board: KthAirportLiveBoard;
  bookUrl: string;
}) {
  const delayed = [...board.arrivals, ...board.departures].filter(
    (f) => f.delayed && !f.cancelled,
  ).length;
  const cancelled = [...board.arrivals, ...board.departures].filter(
    (f) => f.cancelled,
  ).length;
  const noLiveFeed =
    board.id === "stansted" &&
    board.arrivals.length === 0 &&
    board.departures.length === 0;

  return (
    <article
      id={board.id}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-kth-navy/10 bg-white shadow-sm"
    >
      <div className="border-b border-kth-navy/8 bg-kth-navy px-5 py-4 text-white sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-gold">
              {board.iata} · Live board
            </p>
            <h3 className="mt-1 font-serif text-2xl font-bold">{board.name}</h3>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold">{board.weather.tempC}°C</p>
            <p className="text-white/75">{board.weather.label}</p>
            <p className="mt-2 text-[10px] text-white/60">
              Updated {formatUpdated(board.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-b border-kth-navy/8 bg-kth-sand/50 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
        <div className="rounded-lg border border-kth-navy/6 bg-white px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-kth-muted">
            Dover → {board.iata}
          </p>
          <p className="mt-0.5 text-lg font-extrabold text-kth-navy">
            {board.journey.journeyMinutes} min
            {board.journey.delayMinutes
              ? ` (+${board.journey.delayMinutes})`
              : ""}
          </p>
        </div>
        <div className="rounded-lg border border-kth-navy/6 bg-white px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-kth-muted">
            Leave Dover by
          </p>
          <p className="mt-0.5 text-lg font-extrabold text-kth-navy">
            {board.journey.recommendedDeparture ?? "Plan early"}
          </p>
          <p className="text-[10px] text-kth-muted">Typical 2pm flight + 90 min</p>
        </div>
        <div className="rounded-lg border border-kth-navy/6 bg-white px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-kth-muted">Delays</p>
          <p className="mt-0.5 text-lg font-extrabold text-amber-700">{delayed}</p>
        </div>
        <div className="rounded-lg border border-kth-navy/6 bg-white px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-kth-muted">Cancelled</p>
          <p className="mt-0.5 text-lg font-extrabold text-red-700">{cancelled}</p>
        </div>
      </div>

      {board.terminals && board.terminals.length > 1 ? (
        <p className="border-b border-kth-navy/6 px-5 py-2 text-xs text-kth-muted sm:px-6">
          Terminals: {board.terminals.join(" · ")}
        </p>
      ) : null}

      {noLiveFeed ? (
        <div className="border-b border-kth-navy/6 bg-kth-sand/30 px-5 py-8 text-center sm:px-6 sm:py-10">
          <p className="text-sm font-semibold text-kth-navy">
            Live Stansted flight boards
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-kth-muted">
            Stansted live data will appear here once an Aerodatabox API key is
            configured. Until then, use the official airport board for arrivals
            and departures.
          </p>
          <a
            href={board.officialFlightsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-kth-navy px-5 py-2.5 text-sm font-extrabold text-white hover:bg-kth-navy/90"
          >
            Open live flights on stanstedairport.com
          </a>
        </div>
      ) : (
      <div className="grid lg:grid-cols-2">
        <div className="border-b border-kth-navy/6 p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <h4 className="text-xs font-extrabold uppercase tracking-wide text-kth-sea">
            Live arrivals
          </h4>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[320px] text-left">
              <thead className="text-[10px] uppercase text-kth-muted">
                <tr>
                  <th className="pb-2">Flight</th>
                  <th className="hidden pb-2 sm:table-cell">From</th>
                  <th className="pb-2">Sched</th>
                  <th className="hidden pb-2 md:table-cell">Est</th>
                  <th className="pb-2">Status</th>
                  <th className="hidden pb-2 lg:table-cell">Term</th>
                </tr>
              </thead>
              <tbody>
                {board.arrivals.length ? (
                  board.arrivals.map((f) => <FlightRow key={f.id} flight={f} />)
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-sm text-kth-muted">
                      No arrivals loaded —{" "}
                      <a
                        href={board.officialFlightsUrl}
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
            Live departures
          </h4>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[320px] text-left">
              <thead className="text-[10px] uppercase text-kth-muted">
                <tr>
                  <th className="pb-2">Flight</th>
                  <th className="hidden pb-2 sm:table-cell">To</th>
                  <th className="pb-2">Sched</th>
                  <th className="hidden pb-2 md:table-cell">Est</th>
                  <th className="pb-2">Status</th>
                  <th className="hidden pb-2 lg:table-cell">Term</th>
                </tr>
              </thead>
              <tbody>
                {board.departures.length ? (
                  board.departures.map((f) => (
                    <FlightRow key={f.id} flight={f} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-sm text-kth-muted">
                      No departures loaded —{" "}
                      <a
                        href={board.officialFlightsUrl}
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
          href={board.officialFlightsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-lg border border-kth-navy/15 bg-white px-4 py-2.5 text-center text-sm font-bold text-kth-navy hover:border-kth-sea/40"
        >
          Official {board.iata} flights
        </a>
        <Link
          href={bookUrl}
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-kth-gold px-4 py-2.5 text-center text-sm font-extrabold text-kth-navy hover:bg-kth-gold-dark"
        >
          Book taxi Dover → {board.iata}
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

function FlightTracker({ bookBase }: { bookBase: string }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    query: string;
    flight: KthAirportFlight | null;
    airport: KthAirportId | null;
    airportName: string | null;
  } | null>(null);

  async function search(flightQuery: string) {
    const q = flightQuery.trim();
    if (q.length < 3) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/kenttravelhub/airports/flight?q=${encodeURIComponent(q)}`,
      );
      if (!res.ok) throw new Error("Lookup failed");
      setResult(await res.json());
    } catch {
      setError("Could not look up that flight. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="flight-tracker"
      className="scroll-mt-24 rounded-2xl border border-kth-navy/10 bg-white p-5 shadow-sm sm:p-6"
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-sea">
        Flight tracker
      </p>
      <h2 className="mt-2 font-serif text-2xl font-bold text-kth-navy">
        Track BA215, U28601, KL1001…
      </h2>
      <p className="mt-2 text-sm text-kth-muted">
        Enter a flight number for Heathrow, Gatwick, Stansted or Luton — we
        search live airport feeds, not a generic schedule database.
      </p>

      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void search(query);
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          placeholder="e.g. BA215"
          className="flex-1 rounded-lg border border-kth-navy/15 px-4 py-3 text-sm font-semibold text-kth-navy outline-none focus:border-kth-sea"
        />
        <button
          type="submit"
          disabled={loading || query.trim().length < 3}
          className="rounded-lg bg-kth-navy px-6 py-3 text-sm font-extrabold text-white disabled:opacity-50"
        >
          {loading ? "Searching…" : "Track flight"}
        </button>
      </form>

      <p className="mt-2 text-[11px] text-kth-muted">
        Examples: BA215 · U28601 · KL1001 · EZY603 · FR7805
      </p>

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

      {result?.flight ? (
        <div className="mt-6 rounded-xl border border-kth-sea/20 bg-kth-sand/50 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-kth-muted">
                {result.airportName}
              </p>
              <p className="mt-1 text-2xl font-extrabold text-kth-navy">
                {result.flight.flightNumber}
              </p>
              <p className="text-sm text-kth-muted">{result.flight.airline}</p>
            </div>
            <span
              className={
                result.flight.cancelled
                  ? "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800"
                  : result.flight.delayed
                    ? "rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900"
                    : "rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800"
              }
            >
              {result.flight.status}
            </span>
          </div>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-kth-muted">
                {result.flight.direction === "arrival" ? "From" : "To"}
              </dt>
              <dd className="font-bold text-kth-navy">{result.flight.routeLabel}</dd>
            </div>
            <div>
              <dt className="text-kth-muted">Scheduled</dt>
              <dd className="font-bold text-kth-navy">
                {formatFlightTime(result.flight.scheduledTime)}
              </dd>
            </div>
            <div>
              <dt className="text-kth-muted">Estimated</dt>
              <dd className="font-bold text-kth-navy">
                {result.flight.estimatedTime
                  ? formatFlightTime(result.flight.estimatedTime)
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-kth-muted">Terminal / gate</dt>
              <dd className="font-bold text-kth-navy">
                {[result.flight.terminal, result.flight.gate]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </dd>
            </div>
          </dl>

          <Link
            href={`${bookBase}&utm_content=flight-${result.flight.flightNumber}`}
            className="mt-5 inline-flex rounded-lg bg-kth-gold px-5 py-2.5 text-sm font-extrabold text-kth-navy hover:bg-kth-gold-dark"
          >
            Book taxi for this flight
          </Link>
        </div>
      ) : result && !result.flight ? (
        <p className="mt-4 text-sm text-kth-muted">
          No match for {result.query} on today&apos;s Heathrow, Gatwick, Luton or
          Stansted boards. Check the spelling or try the airline&apos;s app.
        </p>
      ) : null}
    </section>
  );
}

type Props = {
  bookUrls: Record<KthAirportId, string>;
  bookBase: string;
};

function AirportCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-kth-navy/10 bg-white shadow-sm"
      aria-hidden
    >
      <div className="h-24 animate-pulse bg-kth-navy/20" />
      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-kth-navy/8" />
        ))}
      </div>
      <div className="grid min-h-[280px] lg:grid-cols-2">
        <div className="border-b border-kth-navy/6 p-5 lg:border-b-0 lg:border-r">
          <div className="h-4 w-24 animate-pulse rounded bg-kth-navy/10" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-kth-navy/6" />
            ))}
          </div>
        </div>
        <div className="p-5">
          <div className="h-4 w-28 animate-pulse rounded bg-kth-navy/10" />
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

export function KthAirportLiveCentre({ bookUrls, bookBase }: Props) {
  const [data, setData] = useState<KthAirportLiveDashboard | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load(background = false) {
      if (background) setRefreshing(true);
      try {
        const res = await fetch("/api/kenttravelhub/airports/live", {
          cache: "no-store",
        });
        if (!cancelled && res.ok) {
          setData((await res.json()) as KthAirportLiveDashboard);
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

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-kth-navy/10 bg-kth-navy p-5 text-white sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-gold">
              Airport live dashboard
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
              Dover ↔ London airports right now
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

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          <DashboardBox
            emoji="✈"
            label="Flights today"
            value={data ? String(data.flightsToday) : "—"}
          />
          <DashboardBox
            emoji="🛬"
            label="Arrivals"
            value={data ? String(data.arrivals) : "—"}
          />
          <DashboardBox
            emoji="🛫"
            label="Departures"
            value={data ? String(data.departures) : "—"}
          />
          <DashboardBox
            emoji="⚠"
            label="Delayed"
            value={data ? String(data.delayed) : "—"}
          />
          <DashboardBox
            emoji="❌"
            label="Cancelled"
            value={data ? String(data.cancelled) : "—"}
          />
          <DashboardBox
            emoji="🌦"
            label="Airport weather"
            value={data?.weatherLabel ?? "—"}
          />
          <DashboardBox
            emoji="🚗"
            label="Dover → airports"
            value={
              data?.averageDoverMinutes
                ? `${data.averageDoverMinutes} min avg`
                : "—"
            }
            detail={
              data?.m20.journeyMinutes
                ? `M20 leg ${data.m20.journeyMinutes} min now`
                : undefined
            }
          />
        </div>
      </section>

      <FlightTracker bookBase={bookBase} />

      <div className="grid gap-8">
        {data?.airports.map((board) => (
          <AirportLiveCard key={board.id} board={board} bookUrl={bookUrls[board.id]} />
        )) ??
          (initialLoad ? (
            <>
              <AirportCardSkeleton />
              <AirportCardSkeleton />
              <AirportCardSkeleton />
              <AirportCardSkeleton />
            </>
          ) : (
            <p className="text-sm text-kth-muted">
              Live airport boards could not be loaded. Try refreshing the page.
            </p>
          ))}
      </div>

      {data ? (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-kth-navy/10 bg-white p-5 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-kth-navy">
              Today&apos;s busiest airport
            </h3>
            <p className="mt-2 text-2xl font-extrabold text-kth-sea">
              {data.busiestAirport
                ? `${data.busiestAirport.name} (${data.busiestAirport.flights} on board)`
                : "—"}
            </p>
            <p className="mt-2 text-sm text-kth-muted">
              Average Dover → airport drive:{" "}
              <strong>{data.averageDoverMinutes ?? "—"} min</strong> with live
              traffic where available.
            </p>
          </div>

          <div className="rounded-2xl border border-kth-navy/10 bg-white p-5 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-kth-navy">
              M20 &amp; Operation Brock
            </h3>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[data.m20.severity]}`}
                />
                <div>
                  <p className="font-bold text-kth-navy">{data.m20.label}</p>
                  <p className="text-kth-muted">{data.m20.detail}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[data.brock.severity]}`}
                />
                <div>
                  <p className="font-bold text-kth-navy">{data.brock.label}</p>
                  <p className="text-kth-muted">{data.brock.detail}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-kth-navy/10 bg-white p-5 shadow-sm lg:col-span-2">
            <h3 className="font-serif text-lg font-bold text-kth-navy">
              Weather affecting airport journeys
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-kth-muted">
              {data.weatherImpacts.map((line) => (
                <li key={line}>• {line}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
