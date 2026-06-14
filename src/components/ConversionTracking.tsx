"use client";

import {
  trackBookTaxiClick,
  trackPhoneClick,
  trackWhatsAppClick,
} from "@/lib/analytics-client";
import {
  isBookLink,
  isPhoneLink,
  isWhatsAppLink,
  parseBookLinkParams,
  phoneFromTelHref,
} from "@/lib/conversion-tracking";
import { useEffect } from "react";

/** Document-level click delegation for RideConnect / Dover Taxi conversion events. */
export function ConversionTracking() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (document.body.dataset.kthSite === "true") return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      const linkText = link.textContent?.trim().slice(0, 80) || undefined;

      if (isPhoneLink(href)) {
        trackPhoneClick({ phone: phoneFromTelHref(href) });
        return;
      }

      if (isWhatsAppLink(href)) {
        trackWhatsAppClick();
        return;
      }

      if (isBookLink(href)) {
        trackBookTaxiClick({
          ...parseBookLinkParams(href),
          link_text: linkText,
        });
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
