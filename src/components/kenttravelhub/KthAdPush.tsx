"use client";

import { useEffect } from "react";

export function KthAdPush() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet or blocked
    }
  }, []);

  return null;
}
