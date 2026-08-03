"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  JOB_TYPE_LABELS,
  JOB_TYPES,
  type JobType,
  type PersonalJob,
} from "@/lib/personal-ledger/types";

type FormState = {
  type: JobType;
  date: string;
  driver: string;
  customer: string;
  pickup: string;
  destination: string;
  price: string;
  notes: string;
};

const emptyForm = (date = todayIso()): FormState => ({
  type: "account_job",
  date,
  driver: "",
  customer: "",
  pickup: "",
  destination: "",
  price: "",
  notes: "",
});

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function money(value: number): string {
  return `£${value.toFixed(2)}`;
}

function formatDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PersonalJobLedger() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [configured, setConfigured] = useState(true);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [jobs, setJobs] = useState<PersonalJob[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [filterType, setFilterType] = useState<JobType | "all">("all");
  const [filterDriver, setFilterDriver] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const checkSetup = useCallback(async () => {
    try {
      const response = await fetch("/api/personal-ledger/auth");
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

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const alreadyAuthed = await checkSetup();
      if (alreadyAuthed) {
        const response = await fetch("/api/personal-ledger/jobs");
        const data = (await response.json()) as {
          ok?: boolean;
          jobs?: PersonalJob[];
          total?: number;
          error?: string;
        };
        if (!response.ok || !data.ok) {
          throw new Error(data.error || "Nepodařilo se načíst záznamy.");
        }
        setJobs(data.jobs ?? []);
        setTotal(data.total ?? 0);
        return;
      }

      const response = await fetch("/api/personal-ledger/jobs");
      const data = (await response.json()) as {
        ok?: boolean;
        jobs?: PersonalJob[];
        total?: number;
        error?: string;
      };

      if (response.status === 401) {
        setAuthed(false);
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Nepodařilo se načíst záznamy.");
      }

      setAuthed(true);
      setJobs(data.jobs ?? []);
      setTotal(data.total ?? 0);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Chyba načítání.");
    } finally {
      setLoading(false);
    }
  }, [checkSetup]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  const drivers = useMemo(() => {
    const names = new Set(jobs.map((job) => job.driver).filter(Boolean));
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (filterType !== "all" && job.type !== filterType) return false;
      if (filterDriver && job.driver !== filterDriver) return false;
      return true;
    });
  }, [jobs, filterType, filterDriver]);

  const filteredTotal = useMemo(
    () => filteredJobs.reduce((sum, job) => sum + job.price, 0),
    [filteredJobs],
  );

  const totalsByType = useMemo(() => {
    const map = Object.fromEntries(JOB_TYPES.map((type) => [type, 0])) as Record<
      JobType,
      number
    >;
    for (const job of filteredJobs) {
      map[job.type] += job.price;
    }
    return map;
  }, [filteredJobs]);

  async function onLogin(event: FormEvent) {
    event.preventDefault();
    setAuthError("");
    const response = await fetch("/api/personal-ledger/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !data.ok) {
      setAuthError(data.error || "Špatné heslo.");
      return;
    }
    setPassword("");
    await loadJobs();
  }

  async function onLogout() {
    await fetch("/api/personal-ledger/auth", { method: "DELETE" });
    setAuthed(false);
    setJobs([]);
    setTotal(0);
    setEditingId(null);
    setForm(emptyForm());
  }

  function startEdit(job: PersonalJob) {
    setEditingId(job.id);
    setForm({
      type: job.type,
      date: job.date,
      driver: job.driver,
      customer: job.customer,
      pickup: job.pickup,
      destination: job.destination,
      price: String(job.price),
      notes: job.notes,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    const payload = {
      type: form.type,
      date: form.date,
      driver: form.driver.trim(),
      customer: form.customer.trim(),
      pickup: form.pickup.trim(),
      destination: form.destination.trim(),
      price: Number(form.price),
      notes: form.notes.trim(),
    };

    const url = editingId
      ? `/api/personal-ledger/jobs/${editingId}`
      : "/api/personal-ledger/jobs";
    const method = editingId ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };

    if (!response.ok || !data.ok) {
      setMessage(data.error || "Uložení se nezdařilo.");
      return;
    }

    setMessage(editingId ? "Záznam upraven." : "Záznam přidán.");
    cancelEdit();
    await loadJobs();
  }

  async function onDelete(id: string) {
    if (!window.confirm("Smazat tento záznam?")) return;
    const response = await fetch(`/api/personal-ledger/jobs/${id}`, {
      method: "DELETE",
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !data.ok) {
      setMessage(data.error || "Smazání se nezdařilo.");
      return;
    }
    if (editingId === id) cancelEdit();
    await loadJobs();
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(jobs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `personal-jobs-${todayIso()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (authed === null && loading) {
    return <p className="text-muted">Načítám…</p>;
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-navy">Soukromá evidence jízd</h1>
        <p className="mt-2 text-sm text-muted">
          Sklon jízdy, SAGA Transport a account joby mimo dispatch.
        </p>
        {!configured ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-medium">Chybí nastavení hesla</p>
            <p className="mt-2">
              V kořeni projektu vytvořte soubor <code>.env.local</code> a přidejte:
            </p>
            <pre className="mt-2 overflow-x-auto rounded bg-white p-2 text-xs">
              PERSONAL_LEDGER_PASSWORD=vase-heslo
            </pre>
            <p className="mt-2">
              Pak restartujte server: <code>npm run dev</code>
            </p>
          </div>
        ) : (
          <form onSubmit={onLogin} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Heslo
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2"
                autoComplete="current-password"
                required
              />
            </label>
            {authError ? <p className="text-sm text-red-700">{authError}</p> : null}
            <button
              type="submit"
              className="w-full rounded-lg bg-navy px-4 py-2 font-medium text-white hover:bg-navy-light"
            >
              Přihlásit
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-navy">Soukromá evidence jízd</h1>
          <p className="mt-1 text-sm text-muted">
            Mimo dispatch — jen pro vaši evidenci cen, řidičů a dat.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportJson}
            className="rounded-lg border border-navy/20 px-3 py-2 text-sm hover:bg-white"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-navy/20 px-3 py-2 text-sm hover:bg-white"
          >
            Odhlásit
          </button>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Celkem (filtr)" value={money(filteredTotal)} />
        <StatCard label="Sklon jízdy" value={money(totalsByType.sklon_jizdy)} />
        <StatCard label="SAGA Transport" value={money(totalsByType.saga_transport)} />
        <StatCard label="Account job" value={money(totalsByType.account_job)} />
      </section>

      <section className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">
          {editingId ? "Upravit záznam" : "Nový záznam"}
        </h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Typ">
            <select
              value={form.type}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, type: event.target.value as JobType }))
              }
              className="w-full rounded-lg border border-navy/20 px-3 py-2"
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {JOB_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Datum">
            <input
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, date: event.target.value }))
              }
              className="w-full rounded-lg border border-navy/20 px-3 py-2"
              required
            />
          </Field>
          <Field label="Řidič">
            <input
              list="driver-suggestions"
              value={form.driver}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, driver: event.target.value }))
              }
              className="w-full rounded-lg border border-navy/20 px-3 py-2"
              placeholder="Jméno řidiče"
              required
            />
            <datalist id="driver-suggestions">
              {drivers.map((driver) => (
                <option key={driver} value={driver} />
              ))}
            </datalist>
          </Field>
          <Field label="Cena (£)">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, price: event.target.value }))
              }
              className="w-full rounded-lg border border-navy/20 px-3 py-2"
              required
            />
          </Field>
          <Field label="Zákazník / účet">
            <input
              value={form.customer}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, customer: event.target.value }))
              }
              className="w-full rounded-lg border border-navy/20 px-3 py-2"
              placeholder="SAGA, account název…"
            />
          </Field>
          <Field label="Odkud">
            <input
              value={form.pickup}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, pickup: event.target.value }))
              }
              className="w-full rounded-lg border border-navy/20 px-3 py-2"
            />
          </Field>
          <Field label="Kam">
            <input
              value={form.destination}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, destination: event.target.value }))
              }
              className="w-full rounded-lg border border-navy/20 px-3 py-2"
            />
          </Field>
          <Field label="Poznámka" className="sm:col-span-2">
            <textarea
              value={form.notes}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, notes: event.target.value }))
              }
              rows={2}
              className="w-full rounded-lg border border-navy/20 px-3 py-2"
            />
          </Field>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-gold px-4 py-2 font-medium text-white hover:bg-gold-dark"
            >
              {editingId ? "Uložit změny" : "Přidat záznam"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-navy/20 px-4 py-2"
              >
                Zrušit
              </button>
            ) : null}
          </div>
        </form>
        {message ? <p className="mt-3 text-sm text-navy">{message}</p> : null}
      </section>

      <section className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Filtr typ">
            <select
              value={filterType}
              onChange={(event) =>
                setFilterType(event.target.value as JobType | "all")
              }
              className="rounded-lg border border-navy/20 px-3 py-2"
            >
              <option value="all">Vše</option>
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {JOB_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Filtr řidič">
            <select
              value={filterDriver}
              onChange={(event) => setFilterDriver(event.target.value)}
              className="rounded-lg border border-navy/20 px-3 py-2"
            >
              <option value="">Všichni</option>
              {drivers.map((driver) => (
                <option key={driver} value={driver}>
                  {driver}
                </option>
              ))}
            </select>
          </Field>
          <p className="text-sm text-muted">
            {filteredJobs.length} záznamů · celkem v databázi {money(total)}
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-navy/10 text-muted">
                <th className="px-2 py-2">Datum</th>
                <th className="px-2 py-2">Typ</th>
                <th className="px-2 py-2">Řidič</th>
                <th className="px-2 py-2">Zákazník</th>
                <th className="px-2 py-2">Trasa</th>
                <th className="px-2 py-2">Cena</th>
                <th className="px-2 py-2">Pozn.</th>
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-2 py-6 text-center text-muted">
                    Zatím žádné záznamy.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="border-b border-navy/5 align-top">
                    <td className="px-2 py-3 whitespace-nowrap">
                      {formatDate(job.date)}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {JOB_TYPE_LABELS[job.type]}
                    </td>
                    <td className="px-2 py-3">{job.driver}</td>
                    <td className="px-2 py-3">{job.customer || "—"}</td>
                    <td className="px-2 py-3">
                      {job.pickup || job.destination
                        ? `${job.pickup || "?"} → ${job.destination || "?"}`
                        : "—"}
                    </td>
                    <td className="px-2 py-3 font-medium whitespace-nowrap">
                      {money(job.price)}
                    </td>
                    <td className="px-2 py-3 max-w-[12rem] truncate" title={job.notes}>
                      {job.notes || "—"}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => startEdit(job)}
                        className="mr-2 text-navy hover:underline"
                      >
                        Upravit
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(job.id)}
                        className="text-red-700 hover:underline"
                      >
                        Smazat
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-navy/10 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-navy">{value}</p>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm font-medium ${className}`}>
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
