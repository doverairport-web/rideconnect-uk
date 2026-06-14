"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { PlatformJob } from "@/lib/platform/types";
import { formatGbp } from "@/lib/platform/fees";
import { PAYMENT_LABELS } from "@/lib/platform/labels";
import { OPERATOR_NAME } from "@/lib/platform/constants";

type DriverInfo = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
};

type Earnings = {
  completedJobs: number;
  gross: number;
  fees: number;
  net: number;
};

function formatWhen(job: PlatformJob): string {
  if (job.scheduleMode === "asap") return "ASAP";
  if (!job.scheduledAt) return "Scheduled";
  const date = new Date(job.scheduledAt);
  if (Number.isNaN(date.getTime())) return job.scheduledAt;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DriverApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [authError, setAuthError] = useState("");
  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [available, setAvailable] = useState<PlatformJob[]>([]);
  const [mine, setMine] = useState<PlatformJob[]>([]);
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [actingId, setActingId] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/driver/jobs");
      if (response.status === 401) {
        setAuthed(false);
        setDriver(null);
        return;
      }
      const data = (await response.json()) as {
        ok?: boolean;
        available?: PlatformJob[];
        mine?: PlatformJob[];
        earnings?: Earnings;
        driver?: DriverInfo;
        error?: string;
      };
      if (!response.ok || !data.ok) {
        setMessage(data.error || "Failed to load jobs.");
        return;
      }
      setAvailable(data.available ?? []);
      setMine(data.mine ?? []);
      setEarnings(data.earnings ?? null);
      setDriver(data.driver ?? null);
      setAuthed(true);
    } catch {
      setMessage("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/driver/auth");
        const data = (await response.json()) as { authenticated?: boolean };
        if (data.authenticated) {
          await loadJobs();
        } else {
          setAuthed(false);
        }
      } catch {
        setAuthed(false);
      }
    })();
  }, [loadJobs]);

  useEffect(() => {
    if (!authed) return;
    const timer = window.setInterval(() => {
      void loadJobs();
    }, 15000);
    return () => window.clearInterval(timer);
  }, [authed, loadJobs]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setAuthError("");
    try {
      const response = await fetch("/api/driver/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        driver?: DriverInfo;
      };
      if (!response.ok || !data.ok) {
        setAuthError(data.error || "Login failed.");
        return;
      }
      setDriver(data.driver ?? null);
      setAuthed(true);
      setPin("");
      await loadJobs();
    } catch {
      setAuthError("Login failed.");
    }
  }

  async function handleLogout() {
    await fetch("/api/driver/auth", { method: "DELETE" });
    setAuthed(false);
    setDriver(null);
    setAvailable([]);
    setMine([]);
    setEarnings(null);
  }

  async function runJobAction(
    jobId: string,
    action: "accept" | "start" | "complete",
  ) {
    setActingId(jobId);
    setMessage("");
    try {
      const response = await fetch(`/api/driver/jobs/${jobId}/${action}`, {
        method: "POST",
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setMessage(data.error || `Could not ${action} job.`);
        return;
      }
      await loadJobs();
    } catch {
      setMessage(`Could not ${action} job.`);
    } finally {
      setActingId(null);
    }
  }

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy text-white/70">
        Loading…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen flex-col justify-center bg-navy px-4 py-8 text-white">
        <div className="mx-auto w-full max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
            {OPERATOR_NAME}
          </p>
          <h1 className="mt-2 text-3xl font-bold">Driver</h1>
          <p className="mt-2 text-sm text-white/70">
            Sign in with your phone and PIN to accept fixed-fare jobs.
          </p>
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <label className="block text-sm font-medium">
              Phone
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40"
                placeholder="07700 900123"
                required
              />
            </label>
            <label className="block text-sm font-medium">
              PIN
              <input
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white"
                required
              />
            </label>
            {authError ? <p className="text-sm text-red-300">{authError}</p> : null}
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-green py-3 font-semibold text-white hover:bg-brand-green-dark"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-24">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
              {OPERATOR_NAME}
            </p>
            <h1 className="text-lg font-bold text-navy">{driver?.name}</h1>
            {driver?.vehicle ? (
              <p className="text-xs text-muted">{driver.vehicle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="text-sm text-muted hover:text-navy"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-4">
        {earnings ? (
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-xs text-muted">Jobs</p>
              <p className="text-lg font-bold text-navy">{earnings.completedJobs}</p>
            </div>
            <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-xs text-muted">Net</p>
              <p className="text-lg font-bold text-navy">{formatGbp(earnings.net)}</p>
            </div>
            <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-xs text-muted">Fees</p>
              <p className="text-lg font-bold text-muted">{formatGbp(earnings.fees)}</p>
            </div>
          </div>
        ) : null}

        {message ? (
          <p className="rounded-lg bg-white px-3 py-2 text-sm text-navy ring-1 ring-slate-200">
            {message}
          </p>
        ) : null}

        {mine.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Your active jobs
            </h2>
            {mine.map((job) => (
              <article
                key={job.id}
                className="rounded-2xl border-2 border-brand-green/40 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-muted">{job.reference}</p>
                    <p className="mt-1 font-semibold text-navy">{job.pickup}</p>
                    {job.destination ? (
                      <p className="text-sm text-navy">→ {job.destination}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-muted">
                      {formatWhen(job)} · {PAYMENT_LABELS[job.paymentType]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-navy">
                      {formatGbp(job.offeredFareGbp)}
                    </p>
                    <p className="text-xs text-brand-green">
                      Keep {formatGbp(job.driverPayoutGbp)}
                    </p>
                  </div>
                </div>
                {job.notes ? (
                  <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-sm text-muted">
                    {job.notes}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.status === "accepted" ? (
                    <button
                      type="button"
                      disabled={actingId === job.id}
                      onClick={() => void runJobAction(job.id, "start")}
                      className="flex-1 rounded-xl bg-navy py-3 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Start trip
                    </button>
                  ) : null}
                  {job.status === "accepted" || job.status === "in_progress" ? (
                    <button
                      type="button"
                      disabled={actingId === job.id}
                      onClick={() => void runJobAction(job.id, "complete")}
                      className="flex-1 rounded-xl bg-brand-green py-3 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Complete
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        ) : null}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Available jobs
            </h2>
            <button
              type="button"
              onClick={() => void loadJobs()}
              className="text-xs text-muted hover:text-navy"
            >
              {loading ? "…" : "Refresh"}
            </button>
          </div>

          {available.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-muted">
              No open jobs right now. Pull to refresh in a moment.
            </p>
          ) : (
            available.map((job) => (
              <article
                key={job.id}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-muted">{job.reference}</p>
                    <p className="mt-1 font-semibold text-navy">{job.pickup}</p>
                    {job.destination ? (
                      <p className="text-sm text-navy">→ {job.destination}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-muted">
                      {formatWhen(job)} · {PAYMENT_LABELS[job.paymentType]} ·{" "}
                      {job.passengers} pax
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-navy">
                      {formatGbp(job.offeredFareGbp)}
                    </p>
                    <p className="text-xs font-medium text-brand-green">
                      You keep {formatGbp(job.driverPayoutGbp)}
                    </p>
                  </div>
                </div>
                {job.notes ? (
                  <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-sm text-muted">
                    {job.notes}
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={actingId === job.id || mine.length > 0}
                  onClick={() => void runJobAction(job.id, "accept")}
                  className="mt-4 w-full rounded-xl bg-brand-green py-3.5 text-base font-bold text-white hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {mine.length > 0 ? "Finish current job first" : "Accept job"}
                </button>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
