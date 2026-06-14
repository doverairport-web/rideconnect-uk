"use client";

import { trackKthSubscribe } from "@/lib/kenttravelhub/analytics-client";
import { useState } from "react";

type Props = {
  source?: string;
  compact?: boolean;
  variant?: "light" | "dark";
};

export function KthEmailCapture({
  source = "footer",
  compact = false,
  variant = "light",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/kenttravelhub/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("done");
      setMessage(
        data.alreadySubscribed
          ? "You are already on the list."
          : "Subscribed — check your inbox for a confirmation email.",
      );
      setEmail("");
      if (!data.alreadySubscribed) {
        trackKthSubscribe(source);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const isDark = variant === "dark";

  return (
    <div
      className={
        compact
          ? ""
          : `rounded-xl border p-5 sm:p-6 ${
              isDark
                ? "border-white/10 bg-white/5"
                : "border-kth-navy/10 bg-kth-sand/60"
            }`
      }
    >
      <p
        className={`text-sm font-extrabold ${isDark ? "text-white" : "text-kth-navy"}`}
      >
        Get Dover Travel Updates
      </p>
      {!compact && (
        <p className={`mt-1 text-xs ${isDark ? "text-white/70" : "text-kth-muted"}`}>
          Join the list — we&apos;ll email you cruise, ferry and M20 alerts for
          Dover.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />
        <label className="sr-only" htmlFor={`kth-email-${source}`}>
          Email
        </label>
        <input
          id={`kth-email-${source}`}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          disabled={status === "loading" || status === "done"}
          className="min-w-0 flex-1 rounded-lg border border-kth-navy/15 bg-white px-4 py-2.5 text-sm text-kth-navy placeholder:text-kth-muted/70 focus:border-kth-sea focus:outline-none focus:ring-2 focus:ring-kth-sea/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "done"}
          className={`shrink-0 rounded-lg px-5 py-2.5 text-sm font-bold transition disabled:opacity-60 ${
            isDark
              ? "bg-kth-gold text-kth-navy hover:bg-kth-gold-dark"
              : "bg-kth-navy text-white hover:bg-kth-navy-light"
          }`}
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-xs ${
            status === "error"
              ? "text-red-400"
              : isDark
                ? "text-kth-gold"
                : "text-kth-sea"
          }`}
          role="status"
        >
          {message}
        </p>
      )}

      {!compact && (
        <p
          className={`mt-3 text-[11px] ${isDark ? "text-white/50" : "text-kth-muted/80"}`}
        >
          No spam. Ferry, cruise and traffic alerts for Dover and Kent only.
        </p>
      )}
    </div>
  );
}
