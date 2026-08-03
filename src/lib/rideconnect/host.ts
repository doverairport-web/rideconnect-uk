import type { RideConnectSiteId } from "@/lib/rideconnect/sites";

function normalizeHost(host: string | null): string {
  return host?.toLowerCase().split(":")[0] ?? "";
}

const RIDE_CONNECT_HOSTS = new Set([
  "rideconnectuk.com",
  "www.rideconnectuk.com",
  "rideconnect.local",
]);

const ORION_HOSTS = new Set([
  "oriontaxis.co.uk",
  "www.oriontaxis.co.uk",
  "oriontaxis.local",
]);

const GATWICK_HOSTS = new Set([
  "dovertogatwicktaxi.com",
  "www.dovertogatwicktaxi.com",
  "dovertogatwick.com",
  "www.dovertogatwick.com",
  "dovertogatwick.local",
]);

const DOVER_HOSTS = new Set([
  "dovertaxi.co.uk",
  "www.dovertaxi.co.uk",
  "dovertaxi.local",
]);

export function isRideConnectUkHost(host: string | null): boolean {
  return RIDE_CONNECT_HOSTS.has(normalizeHost(host));
}

export function isOrionTaxisHost(host: string | null): boolean {
  return ORION_HOSTS.has(normalizeHost(host));
}

export function isDoverToGatwickHost(host: string | null): boolean {
  return GATWICK_HOSTS.has(normalizeHost(host));
}

export function isDoverTaxiHost(host: string | null): boolean {
  return DOVER_HOSTS.has(normalizeHost(host));
}

/** Any RideConnect UK network taxi site (not HomeKent or KTH). */
export function isRideConnectNetworkHost(host: string | null): boolean {
  return (
    isRideConnectUkHost(host) ||
    isDoverTaxiHost(host) ||
    isOrionTaxisHost(host) ||
    isDoverToGatwickHost(host)
  );
}

export function rideConnectSiteIdFromHost(host: string | null): RideConnectSiteId {
  if (isRideConnectUkHost(host)) return "rideconnect";
  if (isOrionTaxisHost(host)) return "oriontaxis";
  if (isDoverToGatwickHost(host)) return "dovertogatwick";
  return "dovertaxi";
}

export function wwwHostForSite(id: RideConnectSiteId): string | undefined {
  switch (id) {
    case "rideconnect":
      return "www.rideconnectuk.com";
    case "dovertaxi":
      return "www.dovertaxi.co.uk";
    case "oriontaxis":
      return "www.oriontaxis.co.uk";
    case "dovertogatwick":
      return "www.dovertogatwicktaxi.com";
  }
}

export function apexHostForSite(id: RideConnectSiteId): string {
  switch (id) {
    case "rideconnect":
      return "rideconnectuk.com";
    case "dovertaxi":
      return "dovertaxi.co.uk";
    case "oriontaxis":
      return "oriontaxis.co.uk";
    case "dovertogatwick":
      return "dovertogatwicktaxi.com";
  }
}
