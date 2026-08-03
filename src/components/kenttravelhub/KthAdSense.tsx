import { kthAdsenseClientId, kthAdsenseSlot } from "@/lib/kenttravelhub/ads";
import { KthAdPush } from "@/components/kenttravelhub/KthAdPush";

type Props = {
  placement: "article-top" | "article-mid";
  className?: string;
};

export function KthAdSense({ placement, className = "" }: Props) {
  const client = kthAdsenseClientId();
  if (!client) return null;

  const slot = kthAdsenseSlot(placement);

  return (
    <div
      className={`overflow-hidden rounded-lg border border-kth-navy/8 bg-kth-sand/50 ${className}`}
      aria-label="Advertisement"
    >
      <p className="px-3 py-1 text-center text-[10px] uppercase tracking-wider text-kth-muted/70">
        Advertisement
      </p>
      <ins
        className="adsbygoogle block min-h-[90px] w-full"
        style={{ display: "block" }}
        data-ad-client={client}
        {...(slot ? { "data-ad-slot": slot } : {})}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <KthAdPush />
    </div>
  );
}
