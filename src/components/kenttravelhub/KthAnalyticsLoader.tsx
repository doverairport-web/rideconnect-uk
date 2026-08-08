import { KthAnalytics } from "@/components/kenttravelhub/KthAnalytics";
import { KthCookieConsent } from "@/components/kenttravelhub/KthCookieConsent";
import {
  hasKthAnalytics,
  kthClarityProjectId,
  kthGaMeasurementId,
} from "@/lib/kenttravelhub/analytics";
import { kthPath } from "@/lib/kenttravelhub/paths";

export async function KthAnalyticsLoader() {
  if (!hasKthAnalytics()) return null;

  const gaId = kthGaMeasurementId();
  const clarityId = kthClarityProjectId();
  const privacyHref = await kthPath("/privacy");

  return (
    <>
      <KthAnalytics gaId={gaId} clarityId={clarityId} />
      <KthCookieConsent gaId={gaId} clarityId={clarityId} privacyHref={privacyHref} />
    </>
  );
}
