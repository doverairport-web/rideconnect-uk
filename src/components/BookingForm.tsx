"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AddressField,
  BookingMapsProvider,
  RouteMapPanel,
} from "@/components/BookingMaps";
import { BookingTripPanel } from "@/components/BookingTripPanel";
import { BRAND_NAME } from "@/lib/brand";
import { trackBookingLead } from "@/lib/analytics-client";
import { requiresOnlineCardPayment } from "@/lib/booking-payment";
import { formatMeterFare } from "@/lib/meter";
import type { PaymentMethod } from "@/lib/booking-options";
import type { RouteMapData } from "@/lib/route-estimate";

type FormState = "idle" | "submitting" | "success" | "error";

type FarePreview = {
  fareFormatted: string;
  fareAmount: number;
  tariffLabel: string;
  distanceMiles: number;
  durationMinutes: number;
  note: string;
  source: string;
  map: RouteMapData | null;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-navy shadow-sm outline-none ring-gold/30 placeholder:text-muted/60 focus:border-gold focus:ring-2";

function BookingFormInner() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [needsReview, setNeedsReview] = useState(false);
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const [farePreview, setFarePreview] = useState<FarePreview | null>(null);
  const [fareLoading, setFareLoading] = useState(false);
  const [fareError, setFareError] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupCoord, setPickupCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [destinationCoord, setDestinationCoord] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [passengers, setPassengers] = useState(1);
  const [luggageSmall, setLuggageSmall] = useState(0);
  const [luggageLarge, setLuggageLarge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [returnTrip, setReturnTrip] = useState(false);
  const [returnMode, setReturnMode] = useState<"same" | "reverse" | null>(null);
  const [formSnapshot, setFormSnapshot] = useState({
    pickup: "",
    destination: "",
    pickup_coord: null as { lat: number; lng: number } | null,
    destination_coord: null as { lat: number; lng: number } | null,
    pickup_date: "",
    pickup_time: "",
    passengers: "1",
    luggageArticles: 0,
    returnTrip: false,
  });

  useEffect(() => {
    setFormSnapshot((prev) => ({
      ...prev,
      pickup,
      destination,
      pickup_coord: pickupCoord,
      destination_coord: destinationCoord,
      passengers: String(passengers),
      luggageArticles: luggageSmall + luggageLarge,
      returnTrip,
    }));
  }, [
    pickup,
    destination,
    pickupCoord,
    destinationCoord,
    passengers,
    luggageSmall,
    luggageLarge,
    returnTrip,
  ]);

  useEffect(() => {
    const {
      pickup: p,
      destination: d,
      pickup_coord,
      destination_coord,
      pickup_date,
      pickup_time,
      passengers: passengerCount,
      luggageArticles,
      returnTrip: wantsReturn,
    } = formSnapshot;

    if (!p.trim() || !d.trim()) {
      setFarePreview(null);
      setFareError("");
      return;
    }

    const timer = window.setTimeout(async () => {
      setFareLoading(true);
      setFareError("");
      try {
        const response = await fetch("/api/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pickup: p,
            destination: d,
            pickup_coord,
            destination_coord,
            pickup_date,
            pickup_time,
            passengers: Number(passengerCount) || 1,
            luggageArticles,
          }),
        });
        const result = await response.json();
        if (!response.ok || !result.ok) {
          setFarePreview(null);
          setFareError(result.error || "Could not calculate fare — pick an address from the list.");
          return;
        }

        let fareAmount = result.fare as number;
        let distanceMiles = result.distanceMiles as number;
        let durationMinutes = result.durationMinutes as number;

        if (wantsReturn) {
          const returnResponse = await fetch("/api/estimate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pickup: d,
              destination: p,
              pickup_coord: destination_coord,
              destination_coord: pickup_coord,
              pickup_date,
              pickup_time,
              passengers: Number(passengerCount) || 1,
              luggageArticles,
            }),
          });
          const returnResult = await returnResponse.json();
          if (returnResponse.ok && returnResult.ok) {
            fareAmount += returnResult.fare;
            distanceMiles += returnResult.distanceMiles;
            durationMinutes += returnResult.durationMinutes;
          } else {
            fareAmount *= 2;
            distanceMiles *= 2;
            durationMinutes *= 2;
          }
        }

        setFarePreview({
          fareFormatted: formatMeterFare(fareAmount),
          fareAmount,
          tariffLabel: wantsReturn
            ? `${result.tariffLabel} · outbound + return`
            : result.tariffLabel,
          distanceMiles: Math.round(distanceMiles * 10) / 10,
          durationMinutes,
          note: wantsReturn
            ? "Approx. meter fare for outbound and return. Final fare is the in-car meter."
            : result.note,
          source: result.source,
          map: result.map ?? null,
        });
        setFareError("");
      } catch {
        setFarePreview(null);
        setFareError("Could not calculate fare — pick an address from the list.");
      } finally {
        setFareLoading(false);
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [formSnapshot]);

  function syncFormSnapshot(form: HTMLFormElement) {
    const data = new FormData(form);
    const nextPickup = String(data.get("pickup") ?? "");
    const nextDestination = String(data.get("destination") ?? "");
    setPickup(nextPickup);
    setDestination(nextDestination);
    setFormSnapshot((prev) => ({
      ...prev,
      pickup: nextPickup,
      destination: nextDestination,
      pickup_coord: pickupCoord,
      destination_coord: destinationCoord,
      pickup_date: String(data.get("pickup_date") ?? ""),
      pickup_time: String(data.get("pickup_time") ?? ""),
      passengers: String(passengers),
      luggageArticles: luggageSmall + luggageLarge,
      returnTrip,
    }));
  }

  function handleReturnSame() {
    setReturnTrip(true);
    setReturnMode("same");
  }

  function handleReturnReverse() {
    const nextPickup = destination;
    const nextDestination = pickup;
    const nextPickupCoord = destinationCoord;
    const nextDestinationCoord = pickupCoord;

    setPickup(nextPickup);
    setDestination(nextDestination);
    setPickupCoord(nextPickupCoord);
    setDestinationCoord(nextDestinationCoord);
    setReturnTrip(true);
    setReturnMode("reverse");
  }

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

    const email = String(data.get("email") ?? "").trim();
    if (requiresOnlineCardPayment(paymentMethod) && !email) {
      setState("error");
      setErrorMessage("Email is required for card payment (booking confirmation).");
      return;
    }

    if (requiresOnlineCardPayment(paymentMethod) && !farePreview?.fareAmount) {
      setState("error");
      setErrorMessage(
        "Pick pickup and destination from the address list so we can calculate the fare before card payment.",
      );
      return;
    }

    const payload = {
      customer_name: String(data.get("customer_name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email,
      pickup: String(data.get("pickup") ?? ""),
      destination: String(data.get("destination") ?? ""),
      pickup_date: String(data.get("pickup_date") ?? ""),
      pickup_time: String(data.get("pickup_time") ?? ""),
      passengers,
      luggage_small: luggageSmall,
      luggage_large: luggageLarge,
      payment_method: paymentMethod,
      return_trip: returnTrip,
      return_mode: returnTrip ? returnMode ?? "same" : undefined,
      notes: String(data.get("notes") ?? ""),
      estimated_fare: farePreview?.fareAmount ?? undefined,
    };

    try {
      const payByCard = requiresOnlineCardPayment(paymentMethod);
      const response = await fetch(payByCard ? "/api/square/checkout" : "/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Could not send your booking.");
      }

      if (payByCard && result.checkout_url) {
        window.location.href = result.checkout_url as string;
        return;
      }

      setNeedsReview(Boolean(result.needs_review));
      setConfirmationEmailSent(Boolean(result.email_sent));
      trackBookingLead({
        estimatedFare: result.estimated_fare ?? farePreview?.fareAmount ?? null,
        returnTrip,
      });
      setState("success");
      setPickup("");
      setDestination("");
      setPickupCoord(null);
      setDestinationCoord(null);
      setPassengers(1);
      setLuggageSmall(0);
      setLuggageLarge(0);
      setPaymentMethod("cash");
      setReturnTrip(false);
      setReturnMode(null);
      setFarePreview(null);
      setFareError("");
      form.reset();
    } catch (error) {
      setState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Could not send your booking.",
      );
    }
  }

  const returnNote = returnTrip
    ? returnMode === "reverse"
      ? "Return reverse route"
      : "Return same route back"
    : null;

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-xl font-semibold text-navy">Booking received</p>
        <p className="mt-3 text-muted">
          Thank you. Your request has been sent to our dispatch team.
          {confirmationEmailSent
            ? " A confirmation email has been sent to you."
            : needsReview
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
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form
        onSubmit={onSubmit}
        onChange={(event) => syncFormSnapshot(event.currentTarget)}
        className="space-y-5"
      >
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
            Email (for booking confirmation)
            <input
              name="email"
              type="email"
              autoComplete="email"
              className={inputClass}
              placeholder="you@example.com"
            />
            <span className="mt-1 block text-xs font-normal text-muted">
              We send a confirmation copy to this address when email is provided.
            </span>
          </label>

          <AddressField
            name="pickup"
            label="Pickup address"
            value={pickup}
            onChange={(value, coords) => {
              setPickup(value);
              setPickupCoord(coords ?? null);
            }}
            placeholder="e.g. Dover Priory Station, Dover CT16 1EF"
          />
          <AddressField
            name="destination"
            label="Destination"
            value={destination}
            onChange={(value, coords) => {
              setDestination(value);
              setDestinationCoord(coords ?? null);
            }}
            placeholder="e.g. London Gatwick Airport, RH6 0NP"
          />

          <label className="block text-sm font-medium text-navy">
            Pickup date
            <input name="pickup_date" type="date" required className={inputClass} />
          </label>
          <label className="block text-sm font-medium text-navy">
            Pickup time
            <input name="pickup_time" type="time" required className={inputClass} />
          </label>
        </div>

        <BookingTripPanel
          distanceMiles={farePreview?.distanceMiles ?? null}
          durationMinutes={farePreview?.durationMinutes ?? null}
          fareFormatted={farePreview?.fareFormatted ?? null}
          fareLoading={fareLoading}
          tariffLabel={farePreview?.tariffLabel ?? null}
          passengers={passengers}
          onPassengersChange={setPassengers}
          luggageSmall={luggageSmall}
          luggageLarge={luggageLarge}
          onLuggageSmallChange={setLuggageSmall}
          onLuggageLargeChange={setLuggageLarge}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          returnTrip={returnTrip}
          onReturnTripChange={(value) => {
            setReturnTrip(value);
            if (!value) setReturnMode(null);
            else if (!returnMode) setReturnMode("same");
          }}
          onReturnSame={handleReturnSame}
          onReturnReverse={handleReturnReverse}
          returnNote={returnNote}
        />

        {fareError ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {fareError}
          </p>
        ) : null}

        {farePreview ? (
          <p className="text-xs text-muted">{farePreview.note}</p>
        ) : null}

        <label className="block text-sm font-medium text-navy">
          Notes
          <textarea
            name="notes"
            rows={3}
            className={inputClass}
            placeholder="Flight number, wheelchair access, special instructions..."
          />
        </label>

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
          className="w-full rounded-full bg-brand-green py-3.5 text-base font-semibold text-white shadow-md hover:bg-brand-green-dark disabled:opacity-60 sm:w-auto sm:min-w-[10rem] sm:px-10"
        >
          {state === "submitting"
            ? requiresOnlineCardPayment(paymentMethod)
              ? "Redirecting to secure payment…"
              : "Sending to dispatch…"
            : requiresOnlineCardPayment(paymentMethod)
              ? farePreview?.fareFormatted
                ? `Pay ${farePreview.fareFormatted} by card`
                : "Pay by card"
              : "Book"}
        </button>
      </form>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <RouteMapPanel mapData={farePreview?.map ?? null} />
      </div>
    </div>
  );
}

export function BookingForm() {
  return (
    <BookingMapsProvider>
      <BookingFormInner />
    </BookingMapsProvider>
  );
}
