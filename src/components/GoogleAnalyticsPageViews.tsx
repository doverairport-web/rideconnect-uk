"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function PageViewsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (document.body.dataset.kthSite === "true") return;

    const gaId = document.body.dataset.gaMeasurementId;
    if (!gaId || typeof window.gtag !== "function") return;

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    window.gtag("config", gaId, { page_path: pagePath });
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalyticsPageViews() {
  return (
    <Suspense fallback={null}>
      <PageViewsInner />
    </Suspense>
  );
}
