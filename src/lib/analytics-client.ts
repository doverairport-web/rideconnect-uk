declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: Record<string, unknown>[];
  }
}

/** GA4 recommended event for booking / contact form submissions. */
export function trackBookingLead(params?: {
  estimatedFare?: number | null;
  returnTrip?: boolean;
}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "generate_lead", {
    currency: "GBP",
    value: params?.estimatedFare ?? undefined,
    return_trip: params?.returnTrip ?? false,
  });
}
