/** Bookings table columns known to exist in Airtable (avoids 422 UNKNOWN_FIELD_NAME). */
export const ALLOWED_AIRTABLE_FIELDS = new Set([
  "Name",
  "Status",
  "Date",
  "Pickup",
  "Destination",
  "Phone",
  "Fare",
  "Needs Review",
  "Dispatch Mode",
  "Driver Response",
  "AI Booking Summary",
  "AI Call Transcript",
  "AI Confidence",
  "Luggage",
  "Passengers",
  "Driver",
  "Meter State",
]);

export function sanitizeAirtableFields(
  fields: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!ALLOWED_AIRTABLE_FIELDS.has(key)) continue;
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    out[key] = value;
  }
  return out;
}
