"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { PlatformJob } from "@/lib/platform/types";
import { formatGbp } from "@/lib/platform/fees";
import { DRIVER_STATUS_LABELS, PAYMENT_LABELS } from "@/lib/platform/labels";
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

type CompletionSuccess = {
  reference: string;
  fareGbp: number;
  payoutGbp: number;
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
  const [confirmJob, setConfirmJob] = useState<PlatformJob | null>(null);
  const [completionSuccess, setCompletionSuccess] =
    useState<CompletionSuccess | null>(null);

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
    setConfirmJob(null);
    setCompletionSuccess(null);
  }

  async function postJobAction(
    jobId: string,
    action: "accept" | "start" | "complete",
  ): Promise<{ ok: boolean; job?: PlatformJob; error?: string }> {
    const response = await fetch(`/api/driver/jobs/${jobId}/${action}`, {
      method: "POST",
    });
    const data = (await response.json()) as {
      ok?: boolean;
      job?: PlatformJob;
      error?: string;
    };
    if (!response.ok || !data.ok) {
      return { ok: false, error: data.error || `Could not ${action} job.` };
    }
    return { ok: true, job: data.job };
  }

  async function acceptJob(jobId: string) {
    setActingId(jobId);
    setMessage("");
    try {
      const accepted = await postJobAction(jobId, "accept");
      if (!accepted.ok) {
        setMessage(accepted.error || "Could not accept job.");
        return;
      }
      await postJobAction(jobId, "start");
      await loadJobs();
    } catch {
      setMessage("Could not accept job.");
    } finally {
      setActingId(null);
    }
  }

  async function confirmCompleteJob() {
    if (!confirmJob) return;

    const job = confirmJob;
    setConfirmJob(null);
    setActingId(job.id);
    setMessage("");
    try {
      const result = await postJobAction(job.id, "complete");
      if (!result.ok) {
        setMessage(result.error || "Could not complete job.");
        return;
      }

      const completed = result.job ?? job;
      setCompletionSuccess({
        reference: completed.reference,
        fareGbp: completed.offeredFareGbp,
        payoutGbp: completed.driverPayoutGbp,
      });
      setMine([]);
      await loadJobs();
    } catch {
      setMessage("Could not complete job.");
    } finally {
      setActingId(null);
    }
  }

  function dismissCompletion() {
    setCompletionSuccess(null);
    void loadJobs();
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
              Your active job
            </h2>
            {mine.map((job) => (
              <article
                key={job.id}
                className="rounded-2xl border-2 border-brand-green/40 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-xs text-muted">{job.reference}</p>
                      {job.status === "accepted" || job.status === "in_progress" ? (
                        <span className="rounded-full bg-navy/10 px-2 py-0.5 text-xs font-semibold text-navy">
                          {DRIVER_STATUS_LABELS[job.status]}
                        </span>
                      ) : null}
                    </div>
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
                <button
                  type="button"
                  disabled={actingId === job.id}
                  onClick={() => setConfirmJob(job)}
                  className="mt-4 w-full rounded-xl bg-brand-green py-3.5 text-base font-bold text-white hover:bg-brand-green-dark disabled:opacity-60"
                >
                  Complete job
                </button>
              </article>
            ))}
          </section>
        ) : null}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              {mine.length > 0 ? "More jobs" : "Available jobs"}
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
              {mine.length > 0
                ? "Finish your current job to see more offers."
                : "No open jobs right now. Pull to refresh in a moment."}
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
                  onClick={() => void acceptJob(job.id)}
                  className="mt-4 w-full rounded-xl bg-brand-green py-3.5 text-base font-bold text-white hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {mine.length > 0 ? "Finish current job first" : "Accept job"}
                </button>
              </article>
            ))
          )}
        </section>
      </main>

      {confirmJob ? (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-navy/50 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="complete-job-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 id="complete-job-title" className="text-xl font-bold text-navy">
              Complete this journey?
            </h2>
            <p className="mt-2 text-sm text-muted">
              {confirmJob.pickup}
              {confirmJob.destination ? ` → ${confirmJob.destination}` : ""}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmJob(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-navy hover:bg-cream"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actingId === confirmJob.id}
                onClick={() => void confirmCompleteJob()}
                className="flex-1 rounded-xl bg-brand-green py-3 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {completionSuccess ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-navy/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="journey-complete-title"
            className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl"
          >
            <p className="text-4xl text-brand-green" aria-hidden="true">
              ✓
            </p>
            <h2 id="journey-complete-title" className="mt-3 text-2xl font-bold text-navy">
              Journey completed
            </h2>
            <p className="mt-1 font-mono text-xs text-muted">
              {completionSuccess.reference}
            </p>
            <p className="mt-6 text-sm text-muted">Fare amount</p>
            <p className="mt-1 text-4xl font-bold text-navy">
              {formatGbp(completionSuccess.fareGbp)}
            </p>
            <p className="mt-2 text-sm text-brand-green">
              You keep {formatGbp(completionSuccess.payoutGbp)}
            </p>
            <button
              type="button"
              onClick={dismissCompletion}
              className="mt-8 w-full rounded-xl bg-navy py-3.5 text-base font-bold text-white hover:bg-navy/90"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
