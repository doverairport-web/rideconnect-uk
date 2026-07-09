import {
  detectTravelAlerts,
  pickTopTravelAlert,
} from "@/lib/kenttravelhub/facebook-alert-events";
import { formatFacebookAlertPost } from "@/lib/kenttravelhub/facebook-alert-post";
import {
  loadFacebookAlertState,
  shouldPostTravelAlert,
} from "@/lib/kenttravelhub/facebook-alert-state";
import { getLiveTravelSnapshot } from "@/lib/kenttravelhub/live-data";
import { getTrainLiveDashboard } from "@/lib/kenttravelhub/train-live-data";

export const dynamic = "force-dynamic";

/** Preview detected travel alerts and whether each would post now. */
export async function GET() {
  const [snapshot, train, state] = await Promise.all([
    getLiveTravelSnapshot(),
    getTrainLiveDashboard().catch(() => null),
    loadFacebookAlertState(),
  ]);

  const alerts = detectTravelAlerts(snapshot, train);

  return Response.json({
    updatedAt: snapshot.updatedAt,
    alerts: alerts.map((alert) => ({
      ...alert,
      wouldPost: shouldPostTravelAlert(alert, state),
      preview: formatFacebookAlertPost(alert),
    })),
    topAlert: pickTopTravelAlert(alerts),
  });
}
