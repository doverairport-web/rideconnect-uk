"use client";

import {
  grantKthAnalyticsConsent,
  loadKthClarity,
  loadKthGoogleAnalytics,
  readKthConsent,
  setKthConsentDefaults,
  trackKthPageView,
  trackKthPhoneClick,
  trackKthSectionVisit,
  trackKthTaxiBookingClick,
  trackKthWhatsAppClick,
} from "@/lib/kenttravelhub/analytics-client";
import { kthSectionFromPathname } from "@/lib/kenttravelhub/analytics";
import {
  isBookLink,
  isPhoneLink,
  isWhatsAppLink,
  parseBookLinkParams,
  phoneFromTelHref,
} from "@/lib/conversion-tracking";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

type Props = {
  gaId?: string;
  clarityId?: string;
};

function AnalyticsInner({ gaId, clarityId }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setKthConsentDefaults();

    const consent = readKthConsent();
    if (consent?.analytics) {
      if (gaId) loadKthGoogleAnalytics(gaId);
      if (clarityId) loadKthClarity(clarityId);
    }
  }, [gaId, clarityId]);

  useEffect(() => {
    function onConsentGranted() {
      grantKthAnalyticsConsent(gaId, clarityId);

      const query = searchParams.toString();
      const pagePath = query ? `${pathname}?${query}` : pathname;
      trackKthPageView(pagePath, gaId);

      const section = kthSectionFromPathname(pathname);
      if (section) trackKthSectionVisit(section);
    }

    window.addEventListener("kth:analytics-consent-granted", onConsentGranted);
    return () => {
      window.removeEventListener("kth:analytics-consent-granted", onConsentGranted);
    };
  }, [gaId, clarityId, pathname, searchParams]);

  useEffect(() => {
    if (!gaId) return;

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackKthPageView(pagePath, gaId);

    const section = kthSectionFromPathname(pathname);
    if (section) trackKthSectionVisit(section);
  }, [pathname, searchParams, gaId]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      const linkText = link.textContent?.trim().slice(0, 80) || undefined;

      if (isPhoneLink(href)) {
        trackKthPhoneClick({ phone: phoneFromTelHref(href) });
        return;
      }

      if (isWhatsAppLink(href)) {
        trackKthWhatsAppClick();
        return;
      }

      if (!isBookLink(href)) return;

      const params = parseBookLinkParams(href);
      trackKthTaxiBookingClick({
        href,
        campaign: params.utm_campaign,
        content: params.utm_content,
        linkText,
      });
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}

export function KthAnalytics(props: Props) {
  return (
    <Suspense fallback={null}>
      <AnalyticsInner {...props} />
    </Suspense>
  );
}
