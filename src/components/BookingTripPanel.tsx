"use client";

import { formatDuration, PAYMENT_METHODS, paymentMethodLabel, type PaymentMethod } from "@/lib/booking-options";
import { requiresOnlineCardPayment } from "@/lib/booking-payment";

type BookingTripPanelProps = {
  distanceMiles: number | null;
  durationMinutes: number | null;
  fareFormatted: string | null;
  fareLoading: boolean;
  tariffLabel: string | null;
  passengers: number;
  onPassengersChange: (value: number) => void;
  luggageSmall: number;
  luggageLarge: number;
  onLuggageSmallChange: (value: number) => void;
  onLuggageLargeChange: (value: number) => void;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (value: PaymentMethod) => void;
  returnTrip: boolean;
  onReturnTripChange: (value: boolean) => void;
  onReturnSame: () => void;
  onReturnReverse: () => void;
  returnNote: string | null;
};

const compactInputClass =
  "h-10 w-full rounded-lg border border-navy/15 bg-white px-2.5 text-sm text-navy shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";

const statBoxClass =
  "flex min-h-[2.75rem] flex-1 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-center text-sm font-medium text-navy";

export function BookingTripPanel({
  distanceMiles,
  durationMinutes,
  fareFormatted,
  fareLoading,
  tariffLabel,
  passengers,
  onPassengersChange,
  luggageSmall,
  luggageLarge,
  onLuggageSmallChange,
  onLuggageLargeChange,
  paymentMethod,
  onPaymentMethodChange,
  returnTrip,
  onReturnTripChange,
  onReturnSame,
  onReturnReverse,
  returnNote,
}: BookingTripPanelProps) {
  const duration =
    durationMinutes != null ? formatDuration(durationMinutes) : null;

  return (
    <div className="space-y-3 rounded-xl border border-navy/10 bg-slate-50/80 p-3 sm:p-4">
      <div className="flex flex-wrap gap-2">
        <div className={statBoxClass}>
          Distance:{" "}
          <span className="ml-1 font-semibold">
            {distanceMiles != null ? `${distanceMiles} miles` : "0 miles"}
          </span>
        </div>
        <div className={statBoxClass}>
          Duration:{" "}
          <span className="ml-1 font-semibold">
            {duration ? duration.label : "0 min"}
          </span>
        </div>
        <div className={`${statBoxClass} border-gold/30 bg-gold/10`}>
          {fareLoading ? (
            "Calculating fare…"
          ) : fareFormatted ? (
            <>
              Fare: <span className="ml-1 font-bold">{fareFormatted}</span>
            </>
          ) : (
            "Fare: —"
          )}
        </div>
      </div>

      {tariffLabel ? (
        <p className="text-center text-xs text-muted">{tariffLabel} · incl. traffic</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-2 rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-medium text-navy">
          <input
            type="checkbox"
            checked={returnTrip}
            onChange={(event) => onReturnTripChange(event.target.checked)}
            className="h-4 w-4 rounded border-navy/20 text-brand-green focus:ring-gold"
          />
          Return
        </label>
        <button
          type="button"
          disabled={!returnTrip}
          onClick={onReturnSame}
          className="rounded-lg border border-brand-green/30 bg-brand-green/10 px-3 py-2 text-sm font-medium text-brand-green-dark disabled:opacity-40"
        >
          Same
        </button>
        <button
          type="button"
          disabled={!returnTrip}
          onClick={onReturnReverse}
          className="rounded-lg border border-brand-green/30 bg-brand-green/10 px-3 py-2 text-sm font-medium text-brand-green-dark disabled:opacity-40"
        >
          Reverse
        </button>
        {returnNote ? (
          <span className="text-xs text-muted">{returnNote}</span>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Passengers
          <select
            value={passengers}
            onChange={(event) => onPassengersChange(Number(event.target.value))}
            className={`${compactInputClass} mt-1`}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Cabin bags
          <input
            type="number"
            min={0}
            max={8}
            value={luggageSmall}
            onChange={(event) => onLuggageSmallChange(Number(event.target.value) || 0)}
            className={`${compactInputClass} mt-1`}
          />
        </label>

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Large suitcases
          <input
            type="number"
            min={0}
            max={8}
            value={luggageLarge}
            onChange={(event) => onLuggageLargeChange(Number(event.target.value) || 0)}
            className={`${compactInputClass} mt-1`}
          />
        </label>

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Payment
          <select
            value={paymentMethod}
            onChange={(event) => onPaymentMethodChange(event.target.value as PaymentMethod)}
            className={`${compactInputClass} mt-1`}
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
          {requiresOnlineCardPayment(paymentMethod) ? (
            <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-violet-800">
              {paymentMethodLabel(paymentMethod)}: pay the estimated fare securely online (Square).
              Final meter fare may differ — any balance is settled with the driver.
            </span>
          ) : null}
        </label>
      </div>
    </div>
  );
}
