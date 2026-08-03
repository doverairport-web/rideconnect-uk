import { KthFacebookPostHelper } from "@/components/kenttravelhub/KthFacebookPostHelper";
import { detectTravelAlerts } from "@/lib/kenttravelhub/facebook-alert-events";
import { formatFacebookAlertPost } from "@/lib/kenttravelhub/facebook-alert-post";
import { formatFacebookLivePost } from "@/lib/kenttravelhub/facebook-live-post";
import {
  loadFacebookAlertState,
  shouldPostTravelAlert,
} from "@/lib/kenttravelhub/facebook-alert-state";
import { getLiveTravelSnapshot } from "@/lib/kenttravelhub/live-data";
import { getTrainLiveDashboard } from "@/lib/kenttravelhub/train-live-data";
import { KTH_NAME } from "@/lib/kenttravelhub/brand";
import { kthPath } from "@/lib/kenttravelhub/paths";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Facebook post helper | ${KTH_NAME}`,
  robots: { index: false, follow: false },
};

export default async function KthFacebookPostHelperPage() {
  const home = await kthPath();
  const [snapshot, train, state] = await Promise.all([
    getLiveTravelSnapshot(),
    getTrainLiveDashboard().catch(() => null),
    loadFacebookAlertState(),
  ]);

  const livePost = formatFacebookLivePost(snapshot, train);
  const alerts = detectTravelAlerts(snapshot, train).map((alert) => ({
    id: alert.id,
    title: alert.title,
    severity: alert.severity,
    wouldPost: shouldPostTravelAlert(alert, state),
    preview: formatFacebookAlertPost(alert),
  }));

  return (
    <div className="min-h-screen bg-kth-sand">
      <div className="border-b border-kth-navy/8 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <Link href={home} className="text-sm font-semibold text-kth-sea hover:text-kth-navy">
            ← Kent Travel Hub
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-kth-navy">Facebook post helper</h1>
          <p className="mt-2 text-sm leading-relaxed text-kth-muted">
            Copy ready-made text from live data, or{" "}
            <Link href="/facebook-setup" className="font-semibold text-kth-sea hover:text-kth-navy">
              connect autopost in one click
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <KthFacebookPostHelper
          livePost={livePost}
          liveUpdatedAt={snapshot.updatedAt}
          alerts={alerts}
        />
      </div>
    </div>
  );
}
