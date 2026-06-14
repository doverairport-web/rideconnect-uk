export const customerBookUrl = "/book";

/** Passenger app — web/PWA until App Store listing is live. */
export const passengerWebUrl =
  process.env.NEXT_PUBLIC_PASSENGER_URL?.trim() ||
  "https://dispatch.rideconnectuk.com/passenger";

/** Driver dispatch — mobile web built in this project (rideconnect-dispatch). */
export const driverWebLoginUrl =
  process.env.NEXT_PUBLIC_DRIVER_URL?.trim() || "/driver";

export const dispatchDashboardUrl =
  process.env.NEXT_PUBLIC_DISPATCH_URL?.trim() || "/platform";

/** App Store when published; falls back to passenger web URL. */
export const customerAppStoreUrl =
  process.env.NEXT_PUBLIC_CUSTOMER_APP_STORE_URL?.trim() ||
  process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() ||
  "";

export const customerGooglePlayUrl =
  process.env.NEXT_PUBLIC_CUSTOMER_GOOGLE_PLAY_URL?.trim() ||
  process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL?.trim() ||
  "";

export const driverAppStoreUrl =
  process.env.NEXT_PUBLIC_DRIVER_APP_STORE_URL?.trim() || "";

export const driverGooglePlayUrl =
  process.env.NEXT_PUBLIC_DRIVER_GOOGLE_PLAY_URL?.trim() || "";

/** Primary link for customer app CTA — store when set, otherwise passenger web. */
export function customerAppHref(): string {
  return customerAppStoreUrl || passengerWebUrl;
}

export function hasCustomerAppDownloadLinks(): boolean {
  return Boolean(customerAppStoreUrl && customerGooglePlayUrl);
}

export function hasCustomerAppSection(): boolean {
  return Boolean(
    passengerWebUrl || customerAppStoreUrl || customerGooglePlayUrl
  );
}

export function hasDriverAppDownloadLinks(): boolean {
  return Boolean(driverAppStoreUrl && driverGooglePlayUrl);
}
