import { isKentTravelHubHost } from "@/lib/kenttravelhub/host";
import { headers } from "next/headers";
import Script from "next/script";
import { gaMeasurementIdForHost } from "@/lib/analytics";

export async function GoogleAnalytics() {
  const host = (await headers()).get("host");
  if (isKentTravelHubHost(host)) return null;

  const gaId = gaMeasurementIdForHost(host);
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
