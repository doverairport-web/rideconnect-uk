import {
  detectTravelAlerts,
  pickTopTravelAlert,
} from "@/lib/kenttravelhub/facebook-alert-events";
import { formatFacebookAlertPost } from "@/lib/kenttravelhub/facebook-alert-post";
import {
  isFacebookAlertStateConfigured,
  loadFacebookAlertState,
  recordPostedTravelAlert,
  shouldPostTravelAlert,
} from "@/lib/kenttravelhub/facebook-alert-state";
import { postToFacebookPage } from "@/lib/kenttravelhub/facebook-graph";
import { getLiveTravelSnapshot } from "@/lib/kenttravelhub/live-data";
import { getTrainLiveDashboard } from "@/lib/kenttravelhub/train-live-data";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isCronAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

/**
 * Vercel Cron — posts to Facebook only when a significant travel event is detected
 * (Brock, M20 delays, port/ferry issues, rail disruptions). Deduplicated via Blob.
 */
export async function GET(request: NextRequest) {
  if (!isCronAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [snapshot, train, state] = await Promise.all([
    getLiveTravelSnapshot(),
    getTrainLiveDashboard().catch(() => null),
    loadFacebookAlertState(),
  ]);

  const alerts = detectTravelAlerts(snapshot, train);
  const candidate = pickTopTravelAlert(alerts);

  if (!candidate) {
    return Response.json({
      ok: true,
      action: "no_alert",
      updatedAt: snapshot.updatedAt,
    });
  }

  if (!shouldPostTravelAlert(candidate, state)) {
    return Response.json({
      ok: true,
      action: "cooldown",
      alert: candidate,
      updatedAt: snapshot.updatedAt,
    });
  }

  const message = formatFacebookAlertPost(candidate);
  const result = await postToFacebookPage(message);

  if (!result.ok) {
    return Response.json(
      {
        error: result.error,
        alert: candidate,
        preview: message,
        updatedAt: snapshot.updatedAt,
      },
      { status: 503 },
    );
  }

  if (isFacebookAlertStateConfigured()) {
    await recordPostedTravelAlert(candidate, result.postId);
  }

  return Response.json({
    ok: true,
    action: "posted",
    postId: result.postId,
    alert: candidate,
    updatedAt: snapshot.updatedAt,
    statePersisted: isFacebookAlertStateConfigured(),
  });
}
