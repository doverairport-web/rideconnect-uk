
export function kthBookingAffiliateId(): string | undefined {
  const aid = process.env.NEXT_PUBLIC_KTH_BOOKING_AID?.trim();
  return aid || undefined;
}

export function kthBookingAffiliateUrl(
  search: string,
  options?: { checkin?: string; checkout?: string },
): string | null {
  const aid = kthBookingAffiliateId();
  if (!aid) return null;

  const params = new URLSearchParams({
    aid,
    ss: search,
    lang: "en-gb",
  });

  if (options?.checkin) params.set("checkin", options.checkin);
  if (options?.checkout) params.set("checkout", options.checkout);

  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}

/** Booking.com search — works even without affiliate ID configured. */
export function kthBookingSearchUrl(search: string): string {
  return (
    kthBookingAffiliateUrl(search) ??
    `https://www.booking.com/searchresults.html?${new URLSearchParams({
      ss: search,
      lang: "en-gb",
    }).toString()}`
  );
}

export function hasKthAffiliates(): boolean {
  return Boolean(kthBookingAffiliateId());
}
