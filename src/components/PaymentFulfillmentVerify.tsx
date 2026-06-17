"use client";

import { useEffect, useState } from "react";

type FulfillState =
  | { status: "idle" | "pending" }
  | { status: "ok"; recordId?: string }
  | { status: "error"; message: string };

/** After Square redirect, confirm payment and create booking if webhook was delayed. */
export function PaymentFulfillmentVerify({
  paymentId,
}: {
  paymentId: string | null | undefined;
}) {
  const [state, setState] = useState<FulfillState>(
    paymentId ? { status: "pending" } : { status: "idle" },
  );

  useEffect(() => {
    if (!paymentId?.trim()) return;

    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/square/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_id: paymentId.trim() }),
        });
        const data = (await response.json()) as { ok?: boolean; error?: string; record_id?: string };
        if (cancelled) return;
        if (!response.ok || !data.ok) {
          setState({
            status: "error",
            message:
              data.error ??
              "Payment received but booking confirmation is delayed. Please call 01304 350125.",
          });
          return;
        }
        setState({ status: "ok", recordId: data.record_id });
      } catch {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              "Payment received but we could not confirm your booking online. Please call 01304 350125.",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  if (state.status === "idle" || state.status === "pending") {
    return paymentId ? (
      <p className="mt-3 text-sm text-muted">Confirming your booking with dispatch…</p>
    ) : null;
  }

  if (state.status === "error") {
    return (
      <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        {state.message}
      </p>
    );
  }

  if (state.status === "ok") {
    return (
      <p className="mt-3 text-sm font-medium text-green-800">
        Booking confirmed{state.recordId ? ` (ref ${state.recordId.slice(0, 12)}…)` : ""}.
      </p>
    );
  }

  return null;
}
