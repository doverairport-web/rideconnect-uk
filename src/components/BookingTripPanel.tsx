"use client";

import {
  formatDuration,
  PAYMENT_METHODS,
  paymentMethodLabel,
  type PaymentMethod,
} from "@/lib/booking-options";
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

type BookingTripPanelMainProps = Pick<
  BookingTripPanelProps,
  | "distanceMiles"
  | "durationMinutes"
  | "fareFormatted"
  | "fareLoading"
  | "tariffLabel"
  | "passengers"
  | "onPassengersChange"
  | "paymentMethod"
  | "onPaymentMethodChange"
>;

const compactInputClass =
  "h-10 w-full rounded-lg border border-navy/15 bg-white px-2.5 text-sm text-navy shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";

const statBoxClass =
  "flex min-h-[2.75rem] flex-1 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-center text-sm font-medium text-navy";

export function BookingFareSummary({
  distanceMiles,
  durationMinutes,
  fareFormatted,
  fareLoading,
  tariffLabel,
  compact = false,
}: Pick<
  BookingTripPanelProps,
  "distanceMiles" | "durationMinutes" | "fareFormatted" | "fareLoading" | "tariffLabel"
> & { compact?: boolean }) {
  const duration =
    durationMinutes != null ? formatDuration(durationMinutes) : null;

  if (compact) {
    return (
      <div className="rounded-xl border border-gold/25 bg-gold/10 px-4 py-3 text-sm text-navy lg:hidden">
        {fareLoading ? (
          <p className="font-medium">Calculating fare…</p>
        ) : fareFormatted ? (
          <p>
            Approx. fare: <span className="font-bold">{fareFormatted}</span>
            {distanceMiles != null ? (
              <span className="text-muted">
                {" "}
                · {distanceMiles} mi
                {duration ? ` · ${duration.label}` : ""}
              </span>
            ) : null}
          </p>
        ) : (
          <p className="text-muted">
            Fare confirmed by phone if not shown — you can still request your booking.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <div className={statBoxClass}>
        Distance:{" "}
        <span className="ml-1 font-semibold">
          {distanceMiles != null ? `${distanceMiles} miles` : "—"}
        </span>
      </div>
      <div className={statBoxClass}>
        Duration:{" "}
        <span className="ml-1 font-semibold">
          {duration ? duration.label : "—"}
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
          "Fare: quote by phone"
        )}
      </div>
      {tariffLabel ? (
        <p className="w-full text-center text-xs text-muted">{tariffLabel} · incl. traffic</p>
      ) : null}
    </div>
  );
}

export function BookingTripPanel({
  distanceMiles,
  durationMinutes,
  fareFormatted,
  fareLoading,
  tariffLabel,
  passengers,
  onPassengersChange,
  paymentMethod,
  onPaymentMethodChange,
}: BookingTripPanelMainProps) {
  const paymentOptions = PAYMENT_METHODS.filter(
    (m) => m.value === "cash" || m.value === "card",
  );

  return (
    <div className="space-y-3 rounded-xl border border-navy/10 bg-slate-50/80 p-3 sm:p-4">
      <BookingFareSummary
        distanceMiles={distanceMiles}
        durationMinutes={durationMinutes}
        fareFormatted={fareFormatted}
        fareLoading={fareLoading}
        tariffLabel={tariffLabel}
      />

      <div className="grid gap-3 sm:grid-cols-2">
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
          Payment
          <select
            value={paymentMethod}
            onChange={(event) => onPaymentMethodChange(event.target.value as PaymentMethod)}
            className={`${compactInputClass} mt-1`}
          >
            {paymentOptions.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
          {requiresOnlineCardPayment(paymentMethod) ? (
            <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-violet-800">
              Pay estimated fare online (Square). Cash in car also available — switch payment above.
            </span>
          ) : (
            <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-muted">
              Pay driver by cash or card in the car — most airport &amp; cruise customers choose this.
            </span>
          )}
        </label>
      </div>
    </div>
  );
}

export function BookingTripAdvanced({
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
}: Pick<
  BookingTripPanelProps,
  | "luggageSmall"
  | "luggageLarge"
  | "onLuggageSmallChange"
  | "onLuggageLargeChange"
  | "paymentMethod"
  | "onPaymentMethodChange"
  | "returnTrip"
  | "onReturnTripChange"
  | "onReturnSame"
  | "onReturnReverse"
  | "returnNote"
>) {
  const extraPaymentMethods = PAYMENT_METHODS.filter(
    (m) => m.value !== "cash" && m.value !== "card",
  );

  return (
    <div className="space-y-3 border-t border-navy/10 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-2 rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-medium text-navy">
          <input
            type="checkbox"
            checked={returnTrip}
            onChange={(event) => onReturnTripChange(event.target.checked)}
            className="h-4 w-4 rounded border-navy/20 text-brand-green focus:ring-gold"
          />
          Return journey
        </label>
        <button
          type="button"
          disabled={!returnTrip}
          onClick={onReturnSame}
          className="rounded-lg border border-brand-green/30 bg-brand-green/10 px-3 py-2 text-sm font-medium text-brand-green-dark disabled:opacity-40"
        >
          Same route back
        </button>
        <button
          type="button"
          disabled={!returnTrip}
          onClick={onReturnReverse}
          className="rounded-lg border border-brand-green/30 bg-brand-green/10 px-3 py-2 text-sm font-medium text-brand-green-dark disabled:opacity-40"
        >
          Reverse route
        </button>
        {returnNote ? <span className="text-xs text-muted">{returnNote}</span> : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
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
      </div>

      {extraPaymentMethods.length > 0 ? (
        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Other payment
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
              {paymentMethodLabel(paymentMethod)}: pay securely online. Email required.
            </span>
          ) : null}
        </label>
      ) : null}
    </div>
  );
}
