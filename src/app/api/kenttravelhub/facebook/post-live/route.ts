import { formatFacebookLivePost } from "@/lib/kenttravelhub/facebook-live-post";
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
 * Vercel Cron — posts a live Dover travel update to the Facebook Page.
 * Requires CRON_SECRET + FACEBOOK_PAGE_ACCESS_TOKEN in production.
 */
export async function GET(request: NextRequest) {
  if (!isCronAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [snapshot, train] = await Promise.all([
    getLiveTravelSnapshot(),
    getTrainLiveDashboard().catch(() => null),
  ]);

  const message = formatFacebookLivePost(snapshot, train);
  const result = await postToFacebookPage(message);

  if (!result.ok) {
    return Response.json(
      {
        error: result.error,
        updatedAt: snapshot.updatedAt,
        preview: message,
      },
      { status: 503 },
    );
  }

  return Response.json({
    ok: true,
    postId: result.postId,
    updatedAt: snapshot.updatedAt,
  });
}
