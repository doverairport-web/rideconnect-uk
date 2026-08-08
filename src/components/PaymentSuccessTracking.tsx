"use client";

import { trackBookingLead } from "@/lib/analytics-client";
import { trackKthBookingLead } from "@/lib/kenttravelhub/analytics-client";
import { useEffect } from "react";

/** Fires generate_lead when card payment completes (Square redirect). */
export function PaymentSuccessTracking() {
  useEffect(() => {
    const isKth = document.body.dataset.kthSite === "true";
    const params = {
      paymentMethod: "card",
      source: "square_checkout_success",
    };

    if (isKth) {
      trackKthBookingLead(params);
    } else {
      trackBookingLead(params);
    }
  }, []);

  return null;
}
