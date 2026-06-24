import type { WebBookingInput } from "@/lib/booking";
import type { BookingSourceMeta } from "@/lib/booking-source";

const DISPATCH_BOOKING_URL =
  process.env.DISPATCH_BOOKING_URL?.trim() ||
  "https://dispatch.rideconnectuk.com/api/bookings/create";

/** Save booking through the central dispatch API (Airtable + notifications). */
export async function saveBookingViaDispatch(
  booking: WebBookingInput,
  estimatedFare?: number | null,
  options?: {
    squarePaymentId?: string;
    source?: BookingSourceMeta;
    serviceType?: "standard" | "airport_transfer" | "cruise_transfer";
  },
): Promise<{
  recordId?: string;
  created: boolean;
  dispatchEmailSent?: boolean;
  customerEmailSent?: boolean;
}> {
  const source = options?.source;
  const notes = [
    booking.notes?.trim(),
    booking.payment_method ? `Payment: ${booking.payment_method}` : null,
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
      service_type: options?.serviceType,
      source_domain: source?.sourceDomain,
      source_app: source?.sourceApp,
      square_payment_id: options?.squarePaymentId?.trim() || undefined,
    }),
  });

  const data = (await response.json()) as {
    ok?: boolean;
    error?: string;
    record_id?: string;
    booking_id?: string;
    created?: boolean;
    dispatch_email_sent?: boolean;
    customer_email_sent?: boolean;
  };

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "Could not save booking to dispatch.");
  }

  const recordId = data.record_id ?? data.booking_id;
  if (recordId) {
    console.info(`Booking saved successfully: ${recordId}`);
    if (data.dispatch_email_sent) {
      console.info(`Internal email sent successfully: ${recordId}`);
    }
    if (data.customer_email_sent) {
      console.info(`Customer email sent successfully: ${recordId}`);
    }
  }

  return {
    recordId,
    created: data.created !== false,
    dispatchEmailSent: data.dispatch_email_sent === true,
    customerEmailSent: data.customer_email_sent === true,
  };
}
