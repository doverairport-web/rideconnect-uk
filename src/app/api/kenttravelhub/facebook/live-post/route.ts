import { getLiveTravelSnapshot } from "@/lib/kenttravelhub/live-data";
import { formatFacebookLivePost } from "@/lib/kenttravelhub/facebook-live-post";
import { getTrainLiveDashboard } from "@/lib/kenttravelhub/train-live-data";

export const dynamic = "force-dynamic";

/** Returns ready-to-paste Facebook live update text from real feeds. */
export async function GET() {
  const [snapshot, train] = await Promise.all([
    getLiveTravelSnapshot(),
    getTrainLiveDashboard().catch(() => null),
  ]);

  const text = formatFacebookLivePost(snapshot, train);

  return Response.json({
    updatedAt: snapshot.updatedAt,
    text,
  });
}
