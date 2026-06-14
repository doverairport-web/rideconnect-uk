/** Google Maps browser keys are ~39 chars and start with AIza. Reject empty/placeholder values. */
export function isValidGoogleMapsKey(key: string): boolean {
  const trimmed = key.trim();
  return trimmed.startsWith("AIza") && trimmed.length >= 35;
}

export function googleMapsApiKey(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
}

export function googleMapsServerKey(): string {
  return process.env.GOOGLE_MAPS_API_KEY?.trim() ?? "";
}

/** Google Maps in the browser — off until billing is enabled in Google Cloud. */
export function isGoogleMapsClientEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_GOOGLE_MAPS === "true";
}

export function hasGoogleMaps(): boolean {
  if (!isGoogleMapsClientEnabled()) return false;
  return isValidGoogleMapsKey(googleMapsApiKey());
}

export function hasGoogleMapsServer(): boolean {
  return isValidGoogleMapsKey(googleMapsServerKey());
}
