"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type {
  DriverPublic,
  PlatformJob,
  PlatformJobInput,
} from "@/lib/platform/types";
import { OPERATOR_NAME, PLATFORM_FEE_RATE } from "@/lib/platform/constants";
import { calculateJobFees, formatGbp } from "@/lib/platform/fees";
import { PAYMENT_LABELS, STATUS_LABELS, statusTone } from "@/lib/platform/labels";
type Stats = {
  totalDrivers: number;
  activeDrivers: number;
  openJobs: number;
  activeJobs: number;
  monthPosted: number;
  monthCompleted: number;
  monthGross: number;
  monthFees: number;
  fillRate: number;
};

type JobForm = {
  pickup: string;
  destination: string;
  scheduleMode: "asap" | "scheduled";
  scheduledAt: string;
  offeredFareGbp: string;
  paymentType: PlatformJobInput["paymentType"];
  passengers: string;
  luggage: string;
  notes: string;
};

type DriverForm = {
  name: string;
  phone: string;
  vehicle: string;
  pin: string;
};

const emptyJobForm = (): JobForm => ({
  pickup: "",
  destination: "",
  scheduleMode: "asap",
  scheduledAt: "",
  offeredFareGbp: "",
  paymentType: "cash",
  passengers: "1",
  luggage: "0",
  notes: "",
});

const emptyDriverForm = (): DriverForm => ({
  name: "",
  phone: "",
  vehicle: "",
  pin: "",
});

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

export function PlatformDashboard() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [configured, setConfigured] = useState(true);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<"jobs" | "post" | "drivers">("jobs");
  const [jobs, setJobs] = useState<PlatformJob[]>([]);
  const [drivers, setDrivers] = useState<DriverPublic[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [jobForm, setJobForm] = useState<JobForm>(emptyJobForm());
  const [driverForm, setDriverForm] = useState<DriverForm>(emptyDriverForm());
  const [newDriverPin, setNewDriverPin] = useState<string | null>(null);

  const previewFees = useMemo(() => {
    const fare = Number(jobForm.offeredFareGbp);
    if (!Number.isFinite(fare) || fare <= 0) return null;
    return calculateJobFees(fare, PLATFORM_FEE_RATE);
  }, [jobForm.offeredFareGbp]);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/platform/auth");
      const data = (await response.json()) as {
        configured?: boolean;
        authenticated?: boolean;
      };
      setConfigured(data.configured ?? false);
      if (data.authenticated) {
        setAuthed(true);
        return true;
      }
    } catch {
      setConfigured(false);
    }
    return false;
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const [jobsRes, driversRes, statsRes] = await Promise.all([
        fetch("/api/platform/jobs"),
        fetch("/api/platform/drivers"),
        fetch("/api/platform/stats"),
      ]);

      if (jobsRes.status === 401) {
        setAuthed(false);
        return;
      }

      const jobsData = (await jobsRes.json()) as { ok?: boolean; jobs?: PlatformJob[] };
      const driversData = (await driversRes.json()) as {
        ok?: boolean;
        drivers?: DriverPublic[];
      };
      const statsData = (await statsRes.json()) as { ok?: boolean; stats?: Stats };

      setJobs(jobsData.jobs ?? []);
      setDrivers(driversData.drivers ?? []);
      setStats(statsData.stats ?? null);
      setAuthed(true);
    } catch {
      setMessage("Failed to load platform data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      const ok = await checkAuth();
      if (ok) await loadData();
      else setAuthed(false);
    })();
  }, [checkAuth, loadData]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setAuthError("");
    try {
      const response = await fetch("/api/platform/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setAuthError(data.error || "Login failed.");
        return;
      }
      setAuthed(true);
      setPassword("");
      await loadData();
    } catch {
      setAuthError("Login failed.");
    }
  }

  async function handleLogout() {
    await fetch("/api/platform/auth", { method: "DELETE" });
    setAuthed(false);
    setJobs([]);
    setDrivers([]);
    setStats(null);
  }

  async function handlePostJob(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      const payload: PlatformJobInput = {
        pickup: jobForm.pickup.trim(),
        destination: jobForm.destination.trim(),
        scheduleMode: jobForm.scheduleMode,
        scheduledAt:
          jobForm.scheduleMode === "scheduled"
            ? jobForm.scheduledAt || null
            : null,
        offeredFareGbp: Number(jobForm.offeredFareGbp),
        paymentType: jobForm.paymentType,
        passengers: Number(jobForm.passengers) || 1,
        luggage: Number(jobForm.luggage) || 0,
        notes: jobForm.notes.trim(),
      };

      const response = await fetch("/api/platform/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        job?: PlatformJob;
      };
      if (!response.ok || !data.ok) {
        setMessage(data.error || "Could not post job.");
        return;
      }

      setMessage(`Job ${data.job?.reference} posted.`);
      setJobForm(emptyJobForm());
      setTab("jobs");
      await loadData();
    } catch {
      setMessage("Could not post job.");
    }
  }

  async function handleCancelJob(id: string) {
    if (!confirm("Cancel this job?")) return;
    setMessage("");
    try {
      const response = await fetch(`/api/platform/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", reason: "Cancelled by dispatch" }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setMessage(data.error || "Could not cancel job.");
        return;
      }
      await loadData();
    } catch {
      setMessage("Could not cancel job.");
    }
  }

  async function handleAddDriver(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setNewDriverPin(null);
    try {
      const response = await fetch("/api/platform/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: driverForm.name,
          phone: driverForm.phone,
          vehicle: driverForm.vehicle,
          pin: driverForm.pin || undefined,
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        pin?: string;
        driver?: DriverPublic;
      };
      if (!response.ok || !data.ok) {
        setMessage(data.error || "Could not add driver.");
        return;
      }

      setNewDriverPin(data.pin ?? null);
      setDriverForm(emptyDriverForm());
      setMessage(`Driver ${data.driver?.name} added.`);
      await loadData();
    } catch {
      setMessage("Could not add driver.");
    }
  }

  async function toggleDriver(id: string, active: boolean) {
    await fetch(`/api/platform/drivers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    await loadData();
  }

  if (authed === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Loading…
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-xl font-semibold text-navy">Platform not configured</h2>
        <p className="mt-3 text-sm text-muted">
          Set <code className="rounded bg-white px-1">PLATFORM_DISPATCH_PASSWORD</code> in
          your environment to enable the RideConnect dispatch platform.
        </p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-navy">Dispatch login</h2>
        <p className="mt-2 text-sm text-muted">
          Post fixed-fare jobs for {OPERATOR_NAME} drivers.
        </p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-navy">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2"
              autoComplete="current-password"
              required
            />
          </label>
          {authError ? (
            <p className="text-sm text-red-700">{authError}</p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-lg bg-navy px-4 py-2.5 font-medium text-white hover:bg-navy-light"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-navy">{OPERATOR_NAME}</h2>
          <p className="mt-1 text-sm text-muted">
            Fixed fares set by dispatch · {PLATFORM_FEE_RATE}% platform fee from driver
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/driver"
            className="rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm font-medium text-navy hover:bg-cream"
          >
            Driver app →
          </a>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="rounded-lg border border-navy/20 px-3 py-2 text-sm text-muted hover:bg-white"
          >
            Sign out
          </button>
        </div>
      </header>

      {stats ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Open jobs", stats.openJobs],
            ["Active jobs", stats.activeJobs],
            ["Completed (month)", stats.monthCompleted],
            ["Fees (month)", formatGbp(stats.monthFees)],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-xl border border-navy/10 bg-white p-4 shadow-sm"
            >
              <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-navy">{value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b border-navy/10 pb-2">
        {(
          [
            ["jobs", "Jobs"],
            ["post", "Post job"],
            ["drivers", "Drivers"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              tab === key
                ? "bg-brand-green text-white shadow-sm hover:bg-brand-green-dark"
                : "border border-navy/20 bg-white text-navy hover:bg-cream"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void loadData()}
          className="ml-auto rounded-lg px-3 py-2 text-sm text-muted hover:bg-white"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {message ? (
        <p className="rounded-lg border border-navy/10 bg-white px-4 py-3 text-sm text-navy shadow-sm">
          {message}
        </p>
      ) : null}

      {tab === "jobs" ? (
        <div className="space-y-3">
          {jobs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-navy/20 bg-white p-8 text-center text-muted">
              No jobs yet. Post your first fixed-fare job.
            </p>
          ) : (
            jobs.map((job) => (
              <article
                key={job.id}
                className="rounded-xl border border-navy/10 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-navy">
                        {job.reference}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusTone(job.status)}`}
                      >
                        {STATUS_LABELS[job.status]}
                      </span>
                    </div>
                    <p className="mt-2 font-medium text-navy">
                      {job.pickup}
                      {job.destination ? ` → ${job.destination}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {formatWhen(job)} · {PAYMENT_LABELS[job.paymentType]} ·{" "}
                      {job.passengers} pax
                      {job.luggage ? ` · ${job.luggage} luggage` : ""}
                    </p>
                    {job.assignedDriverName ? (
                      <p className="mt-1 text-sm text-navy">
                        Driver: <strong>{job.assignedDriverName}</strong>
                      </p>
                    ) : null}
                    {job.notes ? (
                      <p className="mt-2 text-sm text-muted">{job.notes}</p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-navy">
                      {formatGbp(job.offeredFareGbp)}
                    </p>
                    <p className="text-xs text-muted">
                      Driver keeps {formatGbp(job.driverPayoutGbp)}
                    </p>
                    {job.status === "open" || job.status === "accepted" ? (
                      <button
                        type="button"
                        onClick={() => void handleCancelJob(job.id)}
                        className="mt-3 text-sm text-red-600 hover:underline"
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      ) : null}

      {tab === "post" ? (
        <form
          onSubmit={handlePostJob}
          className="max-w-2xl space-y-4 rounded-2xl border border-navy/10 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-navy">Post a fixed-fare job</h2>
          <label className="block text-sm font-medium text-navy">
            Pickup *
            <input
              value={jobForm.pickup}
              onChange={(event) =>
                setJobForm((current) => ({ ...current, pickup: event.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2"
              required
            />
          </label>
          <label className="block text-sm font-medium text-navy">
            Destination
            <input
              value={jobForm.destination}
              onChange={(event) =>
                setJobForm((current) => ({
                  ...current,
                  destination: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <fieldset>
              <legend className="text-sm font-medium text-navy">When</legend>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={jobForm.scheduleMode === "asap"}
                    onChange={() =>
                      setJobForm((current) => ({
                        ...current,
                        scheduleMode: "asap",
                      }))
                    }
                  />
                  ASAP
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={jobForm.scheduleMode === "scheduled"}
                    onChange={() =>
                      setJobForm((current) => ({
                        ...current,
                        scheduleMode: "scheduled",
                      }))
                    }
                  />
                  Scheduled
                </label>
              </div>
            </fieldset>
            {jobForm.scheduleMode === "scheduled" ? (
              <label className="block text-sm font-medium text-navy">
                Date & time
                <input
                  type="datetime-local"
                  value={jobForm.scheduledAt}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      scheduledAt: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2"
                  required
                />
              </label>
            ) : null}
          </div>
          <div className="rounded-lg border border-brand-green/30 bg-brand-green/5 p-4">
            <label className="block text-sm font-medium text-navy">
              Fixed fare offered to driver (£) *
              <input
                type="number"
                min="5"
                max="500"
                step="0.01"
                value={jobForm.offeredFareGbp}
                onChange={(event) =>
                  setJobForm((current) => ({
                    ...current,
                    offeredFareGbp: event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2 text-lg font-semibold"
                required
              />
            </label>
            {previewFees ? (
              <p className="mt-2 text-sm text-muted">
                Driver receives {formatGbp(previewFees.driverPayoutGbp)} after{" "}
                {PLATFORM_FEE_RATE}% fee ({formatGbp(previewFees.platformFeeGbp)}).
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-medium text-navy">
              Payment
              <select
                value={jobForm.paymentType}
                onChange={(event) =>
                  setJobForm((current) => ({
                    ...current,
                    paymentType: event.target.value as JobForm["paymentType"],
                  }))
                }
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2"
              >
                <option value="cash">Cash</option>
                <option value="account">Account</option>
                <option value="card">Card (prepaid)</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-navy">
              Passengers
              <input
                type="number"
                min="1"
                max="8"
                value={jobForm.passengers}
                onChange={(event) =>
                  setJobForm((current) => ({
                    ...current,
                    passengers: event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-medium text-navy">
              Luggage
              <input
                type="number"
                min="0"
                max="10"
                value={jobForm.luggage}
                onChange={(event) =>
                  setJobForm((current) => ({
                    ...current,
                    luggage: event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-navy">
            Notes
            <textarea
              value={jobForm.notes}
              onChange={(event) =>
                setJobForm((current) => ({ ...current, notes: event.target.value }))
              }
              rows={3}
              className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-brand-green px-5 py-2.5 font-semibold text-white shadow-md hover:bg-brand-green-dark"
          >
            Post job
          </button>
        </form>
      ) : null}

      {tab === "drivers" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-navy">Registered drivers</h2>
            {drivers.length === 0 ? (
              <p className="rounded-xl border border-dashed border-navy/20 bg-white p-6 text-sm text-muted">
                No drivers yet. Add one to enable the driver app.
              </p>
            ) : (
              drivers.map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center justify-between rounded-xl border border-navy/10 bg-white p-4 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-navy">{driver.name}</p>
                    <p className="text-sm text-muted">
                      {driver.phone}
                      {driver.vehicle ? ` · ${driver.vehicle}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void toggleDriver(driver.id, driver.active)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      driver.active
                        ? "bg-brand-green/15 text-brand-green-dark"
                        : "bg-navy/10 text-muted"
                    }`}
                  >
                    {driver.active ? "Active" : "Inactive"}
                  </button>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleAddDriver}
            className="space-y-4 rounded-2xl border border-navy/10 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-navy">Add driver</h2>
            <label className="block text-sm font-medium text-navy">
              Name *
              <input
                value={driverForm.name}
                onChange={(event) =>
                  setDriverForm((current) => ({ ...current, name: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2"
                required
              />
            </label>
            <label className="block text-sm font-medium text-navy">
              Phone *
              <input
                value={driverForm.phone}
                onChange={(event) =>
                  setDriverForm((current) => ({ ...current, phone: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2"
                required
              />
            </label>
            <label className="block text-sm font-medium text-navy">
              Vehicle
              <input
                value={driverForm.vehicle}
                onChange={(event) =>
                  setDriverForm((current) => ({
                    ...current,
                    vehicle: event.target.value,
                  }))
                }
                placeholder="AB12 CDE · Toyota Prius"
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-medium text-navy">
              PIN (optional — auto-generated if blank)
              <input
                value={driverForm.pin}
                onChange={(event) =>
                  setDriverForm((current) => ({ ...current, pin: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2"
                minLength={4}
                maxLength={8}
              />
            </label>
            {newDriverPin ? (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                Save this PIN for the driver: <strong>{newDriverPin}</strong>
              </p>
            ) : null}
            <button
              type="submit"
              className="rounded-lg bg-navy px-4 py-2.5 font-medium text-white hover:bg-navy-light"
            >
              Add driver
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
