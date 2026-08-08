function asText(value: unknown): string {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

export type BookingSourceMeta = {
  sourceDomain: string;
  sourceApp: string;
};

/** Resolve booking source from an incoming API request. */
export function requestBookingSource(
  request: Request,
  body?: Record<string, unknown>,
): BookingSourceMeta {
  const fromBodyDomain =
    asText(body?.source_domain) || asText(body?.sourceDomain) || "";
  const fromBodyApp = asText(body?.source_app) || asText(body?.sourceApp) || "";

  const host =
    fromBodyDomain ||
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host")?.trim() ||
    "";

  return {
    sourceDomain: host || "unknown",
    sourceApp: fromBodyApp || "website/book",
  };
}

/** Client-side source for booking forms (browser). */
export function clientBookingSource(): BookingSourceMeta {
  if (typeof window === "undefined") {
    return { sourceDomain: "unknown", sourceApp: "website/book" };
  }
  const { hostname, pathname } = window.location;
  let app = "website";
  if (pathname.startsWith("/book")) app = "website/book";
  else if (pathname === "/" || pathname === "") app = "website/home";
  return { sourceDomain: hostname, sourceApp: app };
}

export function serviceTypeFromTripType(
  tripType: "local" | "airport" | "cruise",
): "standard" | "airport_transfer" | "cruise_transfer" {
  if (tripType === "airport") return "airport_transfer";
  if (tripType === "cruise") return "cruise_transfer";
  return "standard";
}
