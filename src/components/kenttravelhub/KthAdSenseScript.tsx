import { kthAdsenseClientId } from "@/lib/kenttravelhub/ads";
import Script from "next/script";

export function KthAdSenseAuto() {
  const client = kthAdsenseClientId();
  if (!client) return null;

  return (
    <Script
      id="kth-adsense-auto"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
