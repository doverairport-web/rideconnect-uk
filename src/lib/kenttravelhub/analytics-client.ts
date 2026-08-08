"use client";

import type { KthTrackedSection } from "@/lib/kenttravelhub/analytics";
import {
  KTH_CONSENT_STORAGE_KEY,
  KTH_CONSENT_VERSION,
  isValidKthConsentRecord,
  type KthConsentRecord,
} from "@/lib/kenttravelhub/consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    clarity?: (...args: unknown[]) => void;
  }
}

let gaScriptLoaded = false;
let clarityScriptLoaded = false;

export function readKthConsent(): KthConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KTH_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidKthConsentRecord(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasKthAnalyticsConsent(): boolean {
  return readKthConsent()?.analytics === true;
}

export function writeKthConsent(analytics: boolean): KthConsentRecord {
  const record: KthConsentRecord = {
    version: KTH_CONSENT_VERSION,
    analytics,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(KTH_CONSENT_STORAGE_KEY, JSON.stringify(record));
  return record;
}

function ensureGtagStub(): void {
  window.dataLayer = window.dataLayer ?? [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }
}

export function setKthConsentDefaults(): void {
  ensureGtagStub();
  window.gtag?.("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
}

function injectScript(id: string, src: string): void {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function loadKthGoogleAnalytics(gaId: string): void {
  if (!hasKthAnalyticsConsent() || gaScriptLoaded) return;

  ensureGtagStub();
  injectScript(
    "kth-gtag-js",
    `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
  );

  window.gtag?.("js", new Date());
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
  });
  window.gtag?.("config", gaId, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    send_page_view: false,
  });

  gaScriptLoaded = true;
}

export function loadKthClarity(projectId: string): void {
  if (!hasKthAnalyticsConsent() || clarityScriptLoaded) return;

  injectScript("kth-clarity", `https://www.clarity.ms/tag/${projectId}`);
  clarityScriptLoaded = true;
}

export function grantKthAnalyticsConsent(
  gaId?: string,
  clarityId?: string,
): void {
  writeKthConsent(true);
  setKthConsentDefaults();
  if (gaId) loadKthGoogleAnalytics(gaId);
  if (clarityId) loadKthClarity(clarityId);
}

export function rejectKthAnalyticsConsent(): void {
  writeKthConsent(false);
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function trackKthPageView(pagePath: string, gaId?: string): void {
  if (!hasKthAnalyticsConsent() || !gaId || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
    send_to: gaId,
  });
}

const SECTION_EVENT: Record<KthTrackedSection, string> = {
  cruise: "kth_cruise_visit",
  ferries: "kth_ferry_visit",
  airports: "kth_airport_visit",
};

export function trackKthSectionVisit(section: KthTrackedSection): void {
  if (!hasKthAnalyticsConsent() || typeof window.gtag !== "function") return;

  window.gtag("event", SECTION_EVENT[section], {
    section,
    page_path: window.location.pathname,
  });
}

export function trackKthTaxiBookingClick(params: {
  href: string;
  campaign?: string;
  content?: string;
  linkText?: string;
}): void {
  if (!hasKthAnalyticsConsent() || typeof window.gtag !== "function") return;

  window.gtag("event", "kth_taxi_booking_click", {
    link_url: params.href,
    utm_campaign: params.campaign,
    utm_content: params.content,
  });
  window.gtag("event", "book_taxi_click", {
    link_url: params.href,
    link_text: params.linkText,
    utm_campaign: params.campaign,
    utm_content: params.content,
    utm_source: "kenttravelhub",
    page_path: window.location.pathname,
  });
}

export function trackKthPhoneClick(params?: { phone?: string }): void {
  if (!hasKthAnalyticsConsent() || typeof window.gtag !== "function") return;

  window.gtag("event", "phone_click", {
    phone_number: params?.phone,
    page_path: window.location.pathname,
    site: "kenttravelhub",
  });
}

export function trackKthWhatsAppClick(): void {
  if (!hasKthAnalyticsConsent() || typeof window.gtag !== "function") return;

  window.gtag("event", "whatsapp_click", {
    page_path: window.location.pathname,
    site: "kenttravelhub",
  });
}

export function trackKthBookingLead(params?: {
  estimatedFare?: number | null;
  returnTrip?: boolean;
  paymentMethod?: string;
}): void {
  if (!hasKthAnalyticsConsent() || typeof window.gtag !== "function") return;

  const payload = {
    currency: "GBP",
    value: params?.estimatedFare ?? undefined,
    return_trip: params?.returnTrip ?? false,
    lead_type: "booking_form",
    payment_method: params?.paymentMethod ?? "cash",
    site: "kenttravelhub",
  };

  window.gtag("event", "generate_lead", payload);
  window.gtag("event", "booking_form_submit", payload);
}

export function trackKthBeginCheckout(params?: {
  estimatedFare?: number | null;
  returnTrip?: boolean;
}): void {
  if (!hasKthAnalyticsConsent() || typeof window.gtag !== "function") return;

  window.gtag("event", "begin_checkout", {
    currency: "GBP",
    value: params?.estimatedFare ?? undefined,
    return_trip: params?.returnTrip ?? false,
    payment_method: "card",
    site: "kenttravelhub",
  });
}

export function trackKthSubscribe(source: string): void {
  if (!hasKthAnalyticsConsent() || typeof window.gtag !== "function") return;

  window.gtag("event", "kth_subscribe", {
    form_source: source,
  });
  window.gtag("event", "generate_lead", {
    currency: "GBP",
    lead_type: "newsletter",
    form_source: source,
  });
}
