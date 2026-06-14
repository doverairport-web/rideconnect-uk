import { BRAND_LEGAL, siteHost } from "@/lib/brand";
import { sanitizeAirtableFields } from "@/lib/airtable-fields";
import { formatLuggageSummary, paymentMethodLabel, type PaymentMethod } from "@/lib/booking-options";

export type WebBookingInput = {
  customer_name: string;
  phone: string;
  email?: string;
  pickup: string;
  destination: string;
  pickup_date: string;
  pickup_time: string;
  passengers?: number;
  luggage?: string;
  luggage_small?: number;
  luggage_large?: number;
  payment_method?: PaymentMethod;
  return_trip?: boolean;
  return_mode?: "same" | "reverse";
  notes?: string;
};

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "appp3gYwPeng1JnRG";
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Bookings";
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;

function asText(value: unknown): string {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function asNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function shouldReviewWebBooking(booking: WebBookingInput): boolean {
  if (!asText(booking.pickup)) return true;
  if (!asText(booking.destination)) return true;
  if (!asText(booking.pickup_date)) return true;
  if (!asText(booking.pickup_time)) return true;
  if (!asText(booking.phone)) return true;
  if (!asText(booking.customer_name)) return true;
  return false;
}

function makeWebBookingName(booking: WebBookingInput): string {
  const customerName = asText(booking.customer_name);
  const pickup = asText(booking.pickup);
  const destination = asText(booking.destination);

  const prefix = `${BRAND_LEGAL} Web`;

  if (customerName && pickup && destination) {
    return `${prefix} - ${customerName}: ${pickup} to ${destination}`;
  }
  if (pickup && destination) return `${prefix} - ${pickup} to ${destination}`;
  if (customerName) return `${prefix} - ${customerName}`;
  return `${prefix} - Needs details`;
}

export function buildWebBookingSummary(
  booking: WebBookingInput,
  estimatedFare?: number | null,
): string {
  const lines = [
    `Customer: ${asText(booking.customer_name)}`,
    `Phone: ${asText(booking.phone)}`,
    booking.email ? `Email: ${asText(booking.email)}` : null,
    `Pickup: ${asText(booking.pickup)}`,
    `Destination: ${asText(booking.destination)}`,
    `When: ${asText(booking.pickup_date)} at ${asText(booking.pickup_time)}`,
    booking.passengers ? `Passengers: ${booking.passengers}` : null,
    booking.luggage_small || booking.luggage_large
      ? `Luggage: ${formatLuggageSummary(booking.luggage_small ?? 0, booking.luggage_large ?? 0)}`
      : booking.luggage
        ? `Luggage: ${asText(booking.luggage)}`
        : null,
    booking.payment_method
      ? `Payment: ${paymentMethodLabel(booking.payment_method)}`
      : null,
    booking.return_trip
      ? `Return trip: ${booking.return_mode === "reverse" ? "reverse route" : "same route back"}`
      : null,
    estimatedFare != null
      ? `Estimated meter fare: £${estimatedFare.toFixed(2)} (approx., incl. traffic/waiting)`
      : null,
    booking.notes ? `Notes: ${asText(booking.notes)}` : null,
    `Source: ${siteHost()}`,
  ].filter(Boolean);

  return lines.join("\n");
}

export function toAirtableFields(
  booking: WebBookingInput,
  estimatedFare?: number | null,
) {
  const needsReview = shouldReviewWebBooking(booking);
  const passengers = asNumber(booking.passengers);
  const fare = asNumber(estimatedFare);

  return sanitizeAirtableFields({
    Name: makeWebBookingName(booking),
    Status: "Pending",
    Date: asText(booking.pickup_date),
    Pickup: asText(booking.pickup),
    Destination: asText(booking.destination),
    Phone: asText(booking.phone),
    ...(fare === null ? {} : { Fare: fare }),
    "Needs Review": needsReview ? "Yes" : "No",
    "Dispatch Mode": "Web",
    "Driver Response": "Not offered",
    "AI Booking Summary": buildWebBookingSummary(booking, estimatedFare),
    "AI Call Transcript": "",
    "AI Confidence": "",
    ...(passengers === null ? {} : { Passengers: passengers }),
    ...(booking.luggage || booking.luggage_small || booking.luggage_large
      ? {
          Luggage:
            booking.luggage_small || booking.luggage_large
              ? formatLuggageSummary(booking.luggage_small ?? 0, booking.luggage_large ?? 0)
              : asText(booking.luggage),
        }
      : {}),
  });
}

export function canCreateAirtableBooking(): boolean {
  return Boolean(AIRTABLE_TOKEN?.trim());
}

function escapeAirtableFormula(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

/** Idempotency for Square card payments — webhook can fire many times. */
export async function listBookingsBySquarePaymentId(
  paymentId: string,
): Promise<{ id: string; createdTime: string }[]> {
  if (!AIRTABLE_TOKEN?.trim() || !paymentId.trim()) return [];

  const token = escapeAirtableFormula(paymentId.trim());
  const params = new URLSearchParams({
    pageSize: "10",
    filterByFormula: `FIND('${token}', {AI Booking Summary})`,
  });
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_TABLE_NAME,
  )}?${params}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    cache: "no-store",
  });
  if (!response.ok) return [];

  const data = (await response.json()) as {
    records?: { id: string; createdTime?: string }[];
  };
  return (data.records ?? [])
    .map((row) => ({ id: row.id, createdTime: row.createdTime ?? "" }))
    .sort((a, b) => a.createdTime.localeCompare(b.createdTime));
}

export async function findBookingBySquarePaymentId(
  paymentId: string,
): Promise<string | null> {
  const rows = await listBookingsBySquarePaymentId(paymentId);
  return rows[0]?.id ?? null;
}

/** Only the oldest Airtable row for a Square payment should trigger emails. */
export async function isPrimarySquarePaymentBooking(
  paymentId: string,
  recordId: string,
): Promise<boolean> {
  const rows = await listBookingsBySquarePaymentId(paymentId);
  if (rows.length === 0) return true;
  return rows[0].id === recordId;
}

export async function createAirtableBooking(
  booking: WebBookingInput,
  estimatedFare?: number | null,
) {
  if (!AIRTABLE_TOKEN) {
    throw new Error("Missing AIRTABLE_TOKEN environment variable.");
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_TABLE_NAME,
  )}`;

  async function postFields(fields: Record<string, unknown>) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ fields: sanitizeAirtableFields(fields) }],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Airtable create failed: ${response.status} ${body}`);
    }

    return response.json();
  }

  const fields = toAirtableFields(booking, estimatedFare);

  try {
    return await postFields(fields);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (
      !message.includes("422") &&
      !message.includes("INVALID_MULTIPLE_CHOICE_OPTIONS")
    ) {
      throw error;
    }

    const fallback: Record<string, unknown> = {
      Name: fields.Name,
      Status: "Pending",
      Date: fields.Date,
      Pickup: fields.Pickup,
      Destination: fields.Destination,
      Phone: fields.Phone,
      "Needs Review": fields["Needs Review"],
      "Driver Response": "Not offered",
      "AI Booking Summary": fields["AI Booking Summary"],
    };
    if (fields.Fare != null) fallback.Fare = fields.Fare;

    return postFields(fallback);
  }
}

export function parseWebBookingBody(body: unknown): WebBookingInput | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  const customer_name = asText(data.customer_name);
  const phone = asText(data.phone);
  const pickup = asText(data.pickup);
  const destination = asText(data.destination);
  const pickup_date = asText(data.pickup_date);
  const pickup_time = asText(data.pickup_time);

  if (!customer_name || !phone || !pickup || !destination || !pickup_date || !pickup_time) {
    return null;
  }

  const passengers = asNumber(data.passengers);
  const luggageSmall = asNumber(data.luggage_small);
  const luggageLarge = asNumber(data.luggage_large);
  const paymentRaw = asText(data.payment_method);
  const payment_method = paymentRaw ? (paymentRaw as PaymentMethod) : undefined;
  const return_trip = data.return_trip === true || data.return_trip === "true";
  const returnModeRaw = asText(data.return_mode);
  const return_mode =
    returnModeRaw === "same" || returnModeRaw === "reverse" ? returnModeRaw : undefined;

  const luggageParts: string[] = [];
  if (luggageSmall && luggageSmall > 0) luggageParts.push(`${luggageSmall} cabin`);
  if (luggageLarge && luggageLarge > 0) luggageParts.push(`${luggageLarge} large`);

  return {
    customer_name,
    phone,
    email: asText(data.email) || undefined,
    pickup,
    destination,
    pickup_date,
    pickup_time,
    passengers: passengers ?? undefined,
    luggage: luggageParts.length ? luggageParts.join(", ") : asText(data.luggage) || undefined,
    luggage_small: luggageSmall ?? undefined,
    luggage_large: luggageLarge ?? undefined,
    payment_method,
    return_trip: return_trip || undefined,
    return_mode: return_trip ? return_mode ?? "same" : undefined,
    notes: asText(data.notes) || undefined,
  };
}
