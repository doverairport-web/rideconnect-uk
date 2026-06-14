"use client";

import { HOMEKENT_EMAIL } from "@/lib/homekent/brand";
import { QUOTE_SERVICE_OPTIONS } from "@/lib/homekent/content";
import { FormEvent, useState } from "react";

type FormState = "idle" | "sending" | "success" | "error";

export function HomeKentQuoteForm({ id }: { id?: string }) {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/homekent/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          service: data.get("service"),
          message: data.get("message"),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <div
      id={id}
      className="rounded-2xl bg-homekent-navy p-6 text-white shadow-2xl sm:p-8"
    >
      <h2 className="font-serif text-2xl font-bold">Get a Free Quote</h2>
      <p className="mt-1 text-sm text-white/70">
        Fast response · No obligation · Or email{" "}
        <a
          href={`mailto:${HOMEKENT_EMAIL}`}
          className="text-homekent-gold hover:underline"
        >
          {HOMEKENT_EMAIL}
        </a>
      </p>

      {state === "success" ? (
        <div className="mt-6 rounded-xl border border-homekent-gold/40 bg-white/10 p-5 text-sm">
          <p className="font-semibold text-homekent-gold">Thank you!</p>
          <p className="mt-2 text-white/85">
            We&apos;ve received your message and will get back to you shortly.
          </p>
          <button
            type="button"
            onClick={() => setState("idle")}
            className="mt-4 text-sm font-medium text-homekent-gold hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="hk-name" className="sr-only">
              Name
            </label>
            <input
              id="hk-name"
              name="name"
              type="text"
              required
              placeholder="Name"
              className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-homekent-gold focus:outline-none focus:ring-1 focus:ring-homekent-gold"
            />
          </div>
          <div>
            <label htmlFor="hk-email" className="sr-only">
              Email
            </label>
            <input
              id="hk-email"
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-homekent-gold focus:outline-none focus:ring-1 focus:ring-homekent-gold"
            />
          </div>
          <div>
            <label htmlFor="hk-phone" className="sr-only">
              Phone
            </label>
            <input
              id="hk-phone"
              name="phone"
              type="tel"
              required
              placeholder="Phone"
              className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-homekent-gold focus:outline-none focus:ring-1 focus:ring-homekent-gold"
            />
          </div>
          <div>
            <label htmlFor="hk-service" className="sr-only">
              Service
            </label>
            <select
              id="hk-service"
              name="service"
              required
              defaultValue=""
              className="w-full rounded-lg border border-white/15 bg-homekent-navy px-4 py-3 text-sm text-white focus:border-homekent-gold focus:outline-none focus:ring-1 focus:ring-homekent-gold"
            >
              <option value="" disabled>
                Service
              </option>
              {QUOTE_SERVICE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hk-message" className="sr-only">
              Message
            </label>
            <textarea
              id="hk-message"
              name="message"
              rows={3}
              placeholder="Message (optional)"
              className="w-full resize-none rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-homekent-gold focus:outline-none focus:ring-1 focus:ring-homekent-gold"
            />
          </div>

          {state === "error" && error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={state === "sending"}
            className="w-full rounded-lg bg-homekent-gold px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-homekent-navy transition hover:bg-homekent-gold-light disabled:opacity-60"
          >
            {state === "sending" ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
