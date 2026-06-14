"use client";

import {
  grantKthAnalyticsConsent,
  loadKthClarity,
  loadKthGoogleAnalytics,
  readKthConsent,
  setKthConsentDefaults,
  trackKthPageView,
  trackKthSectionVisit,
  trackKthTaxiBookingClick,
} from "@/lib/kenttravelhub/analytics-client";
import { kthSectionFromPathname } from "@/lib/kenttravelhub/analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

type Props = {
  gaId?: string;
  clarityId?: string;
};

function isBookLink(href: string): boolean {
  try {
    const url = new URL(href, window.location.origin);
    return url.pathname === "/book" || url.pathname.endsWith("/book");
  } catch {
    return href.includes("/book");
  }
}

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
      if (!href || !isBookLink(href)) return;

      try {
        const url = new URL(href, window.location.origin);
        trackKthTaxiBookingClick({
          href,
          campaign: url.searchParams.get("utm_campaign") ?? undefined,
          content: url.searchParams.get("utm_content") ?? undefined,
        });
      } catch {
        trackKthTaxiBookingClick({ href });
      }
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
