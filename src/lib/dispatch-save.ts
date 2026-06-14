import type { WebBookingInput } from "@/lib/booking";
import { siteHost } from "@/lib/brand";

const DISPATCH_BOOKING_URL =
  process.env.DISPATCH_BOOKING_URL?.trim() ||
  "https://dispatch.rideconnectuk.com/api/public/bookings";

/** Save booking through dispatch API (uses dispatch Airtable credentials). */
export async function saveBookingViaDispatch(
  booking: WebBookingInput,
  estimatedFare?: number | null,
  options?: { squarePaymentId?: string },
): Promise<{ recordId?: string; created: boolean }> {
  const notes = [
    booking.notes?.trim(),
    booking.payment_method ? `Payment: ${booking.payment_method}` : null,
    `Source: ${siteHost()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(DISPATCH_BOOKING_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_name: booking.customer_name,
      phone: booking.phone,
      email: booking.email ?? "",
      pickup: booking.pickup,
      destination: booking.destination,
      pickup_date: booking.pickup_date,
      pickup_time: booking.pickup_time,
      passengers: booking.passengers,
      luggage: booking.luggage ?? "",
      luggage_small: booking.luggage_small,
      luggage_large: booking.luggage_large,
      payment_method: booking.payment_method,
      return_trip: booking.return_trip,
      return_mode: booking.return_mode,
      fare: estimatedFare != null && estimatedFare > 0 ? estimatedFare : undefined,
      notes,
      square_payment_id: options?.squarePaymentId?.trim() || undefined,
    }),
  });

  const data = (await response.json()) as {
    ok?: boolean;
    error?: string;
    record_id?: string;
    created?: boolean;
  };

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "Could not save booking to dispatch.");
  }

  return {
    recordId: data.record_id,
    created: data.created !== false,
  };
}
