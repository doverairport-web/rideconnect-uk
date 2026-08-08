"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SeoLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/seo/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "Přihlášení se nezdařilo.");
        return;
      }
      router.replace("/seo/dashboard");
      router.refresh();
    } catch {
      setError("Síťová chyba — zkuste to znovu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#12284a] p-8 shadow-xl"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a017]">
        RideConnect SEO
      </p>
      <h1 className="mt-3 text-3xl font-bold text-white">Přihlášení</h1>
      <p className="mt-2 text-sm text-white/65">
        Interní SEO dashboard — Search Console, konkurence a přehled webů.
      </p>

      {!configured ? (
        <p className="mt-6 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
          Chybí <code className="font-mono">SEO_PASSWORD</code> v{" "}
          <code className="font-mono">.env.local</code>.
        </p>
      ) : null}

      <label className="mt-6 block text-sm text-white/70">
        Heslo
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={!configured || loading}
          className="mt-2 w-full rounded-lg border border-white/15 bg-[#0b1f3a] px-3 py-2.5 text-white outline-none ring-[#d4a017] focus:ring-2 disabled:opacity-50"
          placeholder="••••••••"
        />
      </label>

      {error ? (
        <p className="mt-3 text-sm text-rose-300" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!configured || loading || !password}
        className="mt-6 w-full rounded-lg bg-[#d4a017] px-4 py-2.5 text-sm font-semibold text-[#0b1f3a] hover:bg-[#e0b12a] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Přihlašuji…" : "Přihlásit se"}
      </button>
    </form>
  );
}
