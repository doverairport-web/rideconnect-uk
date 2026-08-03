/** Google AdSense — optional display ads on Kent Travel Hub guides. */

export function kthAdsenseClientId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_KTH_ADSENSE_CLIENT?.trim();
  if (!id || !/^ca-pub-\d+$/i.test(id)) return undefined;
  return id;
}

export function hasKthAdsense(): boolean {
  return Boolean(kthAdsenseClientId());
}

/** Ad slot IDs from AdSense → Ads → By ad unit (optional — auto ads work without these). */
export function kthAdsenseSlot(placement: "article-top" | "article-mid"): string | undefined {
  const slot =
    placement === "article-top"
      ? process.env.NEXT_PUBLIC_KTH_ADSENSE_SLOT_ARTICLE_TOP
      : process.env.NEXT_PUBLIC_KTH_ADSENSE_SLOT_ARTICLE_MID;
  return slot?.trim() || undefined;
}
