import type { WebBookingInput } from "@/lib/booking";
import { buildWebBookingSummary } from "@/lib/booking";
import { phones } from "@/lib/contact";
import { paymentMethodLabel } from "@/lib/booking-options";

export function dispatchBookingSubject(booking: WebBookingInput): string {
  return `New web booking: ${booking.customer_name} — ${booking.pickup} → ${booking.destination}`;
}

export function customerConfirmationSubject(booking: WebBookingInput): string {
  return `Booking received — ${booking.pickup_date} at ${booking.pickup_time}`;
}

export function customerConfirmationBody(
  booking: WebBookingInput,
  estimatedFare?: number | null,
): string {
  const phoneLine = phones.slice(0, 2).join(" or ");
  const lines = [
    `Dear ${booking.customer_name},`,
    "",
    "Thank you for booking with RideConnect UK. We have received your request and our dispatch team will confirm your journey shortly.",
    "",
    "Your booking details:",
    `  Pickup: ${booking.pickup}`,
    `  Destination: ${booking.destination}`,
    `  Date: ${booking.pickup_date}`,
    `  Time: ${booking.pickup_time}`,
    booking.passengers ? `  Passengers: ${booking.passengers}` : null,
    booking.payment_method
      ? `  Payment: ${paymentMethodLabel(booking.payment_method)}`
      : null,
    estimatedFare != null
      ? `  Estimated fare: £${estimatedFare.toFixed(2)} (approx., incl. traffic/waiting)`
      : null,
    booking.notes ? `  Notes: ${booking.notes}` : null,
    "",
    `If anything is wrong, please call us on ${phoneLine}.`,
    "",
    "RideConnect UK",
    "https://rideconnectuk.com",
  ].filter(Boolean);

  return lines.join("\n");
}

export function dispatchNotificationBody(
  booking: WebBookingInput,
  estimatedFare?: number | null,
): string {
  return buildWebBookingSummary(booking, estimatedFare);
}

export function isCustomerEmail(value: string | undefined): value is string {
  if (!value?.trim()) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
