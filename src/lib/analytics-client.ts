declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: Record<string, unknown>[];
  }
}

function canTrack(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/** Book Taxi / book-online CTA clicks. */
export function trackBookTaxiClick(params: {
  link_url: string;
  link_text?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_source?: string;
}) {
  if (!canTrack()) return;

  window.gtag!("event", "book_taxi_click", {
    link_url: params.link_url,
    link_text: params.link_text,
    utm_campaign: params.utm_campaign,
    utm_content: params.utm_content,
    utm_source: params.utm_source,
    page_path: window.location.pathname,
  });
}

/** Click-to-call taps. */
export function trackPhoneClick(params?: { phone?: string }) {
  if (!canTrack()) return;

  window.gtag!("event", "phone_click", {
    phone_number: params?.phone,
    page_path: window.location.pathname,
  });
}

/** WhatsApp chat opens. */
export function trackWhatsAppClick() {
  if (!canTrack()) return;

  window.gtag!("event", "whatsapp_click", {
    page_path: window.location.pathname,
  });
}

/** Card checkout started — user redirected to Square. */
export function trackBeginCheckout(params?: {
  estimatedFare?: number | null;
  returnTrip?: boolean;
}) {
  if (!canTrack()) return;

  window.gtag!("event", "begin_checkout", {
    currency: "GBP",
    value: params?.estimatedFare ?? undefined,
    return_trip: params?.returnTrip ?? false,
    payment_method: "card",
  });
}

/** GA4 recommended event for booking / contact form submissions. */
export function trackBookingLead(params?: {
  estimatedFare?: number | null;
  returnTrip?: boolean;
  paymentMethod?: string;
  source?: string;
}) {
  if (!canTrack()) return;

  const payload = {
    currency: "GBP",
    value: params?.estimatedFare ?? undefined,
    return_trip: params?.returnTrip ?? false,
    lead_type: "booking_form",
    payment_method: params?.paymentMethod ?? "cash",
    form_source: params?.source,
  };

  window.gtag!("event", "generate_lead", payload);
  window.gtag!("event", "booking_form_submit", payload);
}
