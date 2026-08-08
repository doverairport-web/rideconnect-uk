"use client";

import {
  grantKthAnalyticsConsent,
  readKthConsent,
  rejectKthAnalyticsConsent,
} from "@/lib/kenttravelhub/analytics-client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  gaId?: string;
  clarityId?: string;
  privacyHref: string;
};

export function KthCookieConsent({ gaId, clarityId, privacyHref }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = readKthConsent();
    setVisible(consent === null);

    function openSettings() {
      setVisible(true);
    }

    window.addEventListener("kth:cookie-settings", openSettings);
    return () => window.removeEventListener("kth:cookie-settings", openSettings);
  }, []);

  function accept() {
    grantKthAnalyticsConsent(gaId, clarityId);
    window.dispatchEvent(
      new CustomEvent("kth:analytics-consent-granted", {
        detail: { gaId, clarityId },
      }),
    );
    setVisible(false);
  }

  function reject() {
    rejectKthAnalyticsConsent();
    setVisible(false);
  }

  if (!visible) return null;

  const hasPriorChoice = readKthConsent() !== null;

  return (
    <div
      role="dialog"
      aria-labelledby="kth-cookie-title"
      aria-describedby="kth-cookie-desc"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-kth-navy/15 bg-white p-4 shadow-[0_-8px_30px_rgba(11,37,69,0.12)] sm:p-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <p
            id="kth-cookie-title"
            className="text-sm font-extrabold text-kth-navy"
          >
            Cookies on Kent Travel Hub
          </p>
          <p
            id="kth-cookie-desc"
            className="mt-1 max-w-3xl text-xs leading-relaxed text-kth-muted sm:text-sm"
          >
            We use optional analytics cookies (Google Analytics and Microsoft
            Clarity) to understand how visitors use our travel guides and live
            updates. You can accept or reject these cookies — essential site
            functions work either way. See our{" "}
            <Link href={privacyHref} className="font-semibold text-kth-sea hover:underline">
              privacy policy
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={reject}
            className="rounded-lg border border-kth-navy/20 px-5 py-2.5 text-sm font-bold text-kth-navy transition hover:bg-kth-sand"
          >
            {hasPriorChoice ? "Reject analytics" : "Reject"}
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-kth-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-kth-navy-light"
          >
            {hasPriorChoice ? "Accept analytics" : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Small footer link to reopen cookie preferences. */
export function KthCookieSettingsLink({
  className = "",
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("kth:cookie-settings"))}
      className={className}
    >
      Cookie settings
    </button>
  );
}
