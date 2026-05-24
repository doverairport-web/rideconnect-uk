"use client";

import { FormEvent, useState } from "react";
import { BRAND_NAME } from "@/lib/brand";

type FormState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "mt-1 w-full rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-navy shadow-sm outline-none ring-gold/30 placeholder:text-muted/60 focus:border-gold focus:ring-2";

export function BookingForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [needsReview, setNeedsReview] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    if (data.get("gdpr") !== "on") {
      setState("error");
      setErrorMessage("Please confirm you agree to us using your details for this booking.");
      return;
    }

    const payload = {
      customer_name: String(data.get("customer_name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      pickup: String(data.get("pickup") ?? ""),
      destination: String(data.get("destination") ?? ""),
      pickup_date: String(data.get("pickup_date") ?? ""),
      pickup_time: String(data.get("pickup_time") ?? ""),
      passengers: data.get("passengers") ? Number(data.get("passengers")) : undefined,
      luggage: String(data.get("luggage") ?? ""),
      notes: String(data.get("notes") ?? ""),
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Could not send your booking.");
      }

      setNeedsReview(Boolean(result.needs_review));
      setState("success");
      form.reset();
    } catch (error) {
      setState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Could not send your booking.",
      );
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-xl font-semibold text-navy">Booking received</p>
        <p className="mt-3 text-muted">
          Thank you. Your request has been sent to our dispatch team.
          {needsReview
            ? " A dispatcher will confirm the details shortly."
            : " We will confirm your pickup time as soon as possible."}
        </p>
        <p className="mt-2 text-sm text-muted">
          A driver is assigned only after dispatch accepts the job — not at the
          moment you submit this form.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-light"
        >
          Book another journey
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-navy">
          Full name
          <input
            name="customer_name"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="John Smith"
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          Mobile number
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={inputClass}
            placeholder="07..."
          />
        </label>
        <label className="block text-sm font-medium text-navy sm:col-span-2">
          Email (optional)
          <input
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm font-medium text-navy sm:col-span-2">
          Pickup address
          <input
            name="pickup"
            required
            className={inputClass}
            placeholder="e.g. Dover Priory Station"
          />
        </label>
        <label className="block text-sm font-medium text-navy sm:col-span-2">
          Destination
          <input
            name="destination"
            required
            className={inputClass}
            placeholder="e.g. London Gatwick Airport"
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          Pickup date
          <input
            name="pickup_date"
            type="date"
            required
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          Pickup time
          <input
            name="pickup_time"
            type="time"
            required
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          Passengers
          <input
            name="passengers"
            type="number"
            min={1}
            max={8}
            defaultValue={1}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          Luggage
          <input
            name="luggage"
            className={inputClass}
            placeholder="e.g. 2 large suitcases"
          />
        </label>
        <label className="block text-sm font-medium text-navy sm:col-span-2">
          Notes
          <textarea
            name="notes"
            rows={3}
            className={inputClass}
            placeholder="Flight number, wheelchair access, return trip..."
          />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input
          name="gdpr"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-navy/20 text-gold focus:ring-gold"
        />
        <span>
          I agree that {BRAND_NAME} may use my contact details to process this
          booking and contact me about this journey.
        </span>
      </label>

      {state === "error" && errorMessage ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded-full bg-brand-green py-3.5 text-base font-semibold text-white shadow-md hover:bg-brand-green-dark disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {state === "submitting" ? "Sending to dispatch…" : "Send booking request"}
      </button>
    </form>
  );
}
