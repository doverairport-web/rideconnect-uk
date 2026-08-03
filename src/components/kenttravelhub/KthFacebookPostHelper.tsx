"use client";

type AlertPreview = {
  id: string;
  title: string;
  severity: string;
  wouldPost: boolean;
  preview: string;
};

export function KthFacebookPostHelper({
  livePost,
  liveUpdatedAt,
  alerts,
}: {
  livePost: string;
  liveUpdatedAt: string;
  alerts: AlertPreview[];
}) {
  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-kth-navy/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-kth-navy">Live travel post</h2>
        <p className="mt-1 text-xs text-kth-muted">Updated {liveUpdatedAt}</p>
        <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-kth-sand p-4 text-sm text-kth-navy">
          {livePost}
        </pre>
        <button
          type="button"
          onClick={() => copyText(livePost)}
          className="mt-4 rounded-full bg-kth-navy px-5 py-2 text-sm font-semibold text-white"
        >
          Copy live post
        </button>
      </section>

      <section className="rounded-2xl border border-kth-navy/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-kth-navy">Alert drafts</h2>
        <div className="mt-4 space-y-4">
          {alerts.length === 0 ? (
            <p className="text-sm text-kth-muted">No active alert drafts right now.</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-kth-navy/10 p-4">
                <p className="font-semibold text-kth-navy">
                  {alert.title}{" "}
                  <span className="text-xs font-normal text-kth-muted">
                    ({alert.severity}
                    {alert.wouldPost ? " · would post" : ""})
                  </span>
                </p>
                <pre className="mt-3 whitespace-pre-wrap text-sm text-kth-navy">
                  {alert.preview}
                </pre>
                <button
                  type="button"
                  onClick={() => copyText(alert.preview)}
                  className="mt-3 rounded-full border border-kth-navy/20 px-4 py-1.5 text-sm font-semibold text-kth-navy"
                >
                  Copy alert
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
