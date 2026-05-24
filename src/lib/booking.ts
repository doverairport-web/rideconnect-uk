import { BRAND_LEGAL, siteHost } from "@/lib/brand";

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

export function buildWebBookingSummary(booking: WebBookingInput): string {
  const lines = [
    `Customer: ${asText(booking.customer_name)}`,
    `Phone: ${asText(booking.phone)}`,
    booking.email ? `Email: ${asText(booking.email)}` : null,
    `Pickup: ${asText(booking.pickup)}`,
    `Destination: ${asText(booking.destination)}`,
    `When: ${asText(booking.pickup_date)} at ${asText(booking.pickup_time)}`,
    booking.passengers ? `Passengers: ${booking.passengers}` : null,
    booking.luggage ? `Luggage: ${asText(booking.luggage)}` : null,
    booking.notes ? `Notes: ${asText(booking.notes)}` : null,
    `Source: ${siteHost()}`,
  ].filter(Boolean);

  return lines.join("\n");
}

export function toAirtableFields(booking: WebBookingInput) {
  const needsReview = shouldReviewWebBooking(booking);
  const passengers = asNumber(booking.passengers);

  return {
    Name: makeWebBookingName(booking),
    Status: needsReview ? "Needs Review" : "Pending",
    Date: asText(booking.pickup_date),
    Pickup: asText(booking.pickup),
    Destination: asText(booking.destination),
    Phone: asText(booking.phone),
    "Needs Review": needsReview ? "Yes" : "No",
    "Dispatch Mode": "RideConnect Web",
    "Driver Response": "Not offered",
    "AI Booking Summary": buildWebBookingSummary(booking),
    "AI Call Transcript": "",
    "AI Confidence": "",
    ...(passengers === null ? {} : { Passengers: passengers }),
    ...(booking.luggage ? { Luggage: asText(booking.luggage) } : {}),
  };
}

export async function createAirtableBooking(booking: WebBookingInput) {
  if (!AIRTABLE_TOKEN) {
    throw new Error("Missing AIRTABLE_TOKEN environment variable.");
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_TABLE_NAME,
  )}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [{ fields: toAirtableFields(booking) }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Airtable create failed: ${response.status} ${body}`);
  }

  return response.json();
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

  return {
    customer_name,
    phone,
    email: asText(data.email) || undefined,
    pickup,
    destination,
    pickup_date,
    pickup_time,
    passengers: passengers ?? undefined,
    luggage: asText(data.luggage) || undefined,
    notes: asText(data.notes) || undefined,
  };
}
