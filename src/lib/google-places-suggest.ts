import { formatGooglePlaceLabel } from "@/lib/google-place-label";
import { googleMapsApiKey, googleMapsServerKey, isValidGoogleMapsKey } from "@/lib/maps-config";
import type { AddressSuggestion } from "@/lib/nominatim";

const DOVER_BIAS = { lat: 51.1279, lng: 1.3134 };

function placesSuggestKey(): string {
  const candidates = [googleMapsApiKey(), googleMapsServerKey()];
  for (const key of candidates) {
    if (isValidGoogleMapsKey(key)) return key;
  }
  return "";
}

type AutocompleteResponse = {
  status: string;
  predictions?: Array<{
    description: string;
    place_id: string;
  }>;
};

type DetailsResponse = {
  status: string;
  result?: {
    name?: string;
    formatted_address?: string;
    types?: string[];
    geometry?: { location?: { lat: number; lng: number } };
  };
};

export function hasGooglePlacesSuggest(): boolean {
  return Boolean(placesSuggestKey());
}

export async function searchGooglePlaces(query: string, limit = 6): Promise<AddressSuggestion[]> {
  const apiKey = placesSuggestKey();
  if (!apiKey || query.trim().length < 2) return [];

  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", query.trim());
  url.searchParams.set("key", apiKey);
  url.searchParams.set("components", "country:gb");
  url.searchParams.set("location", `${DOVER_BIAS.lat},${DOVER_BIAS.lng}`);
  url.searchParams.set("radius", "50000");

  const response = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!response.ok) return [];

  const data = (await response.json()) as AutocompleteResponse;
  if (data.status !== "OK" || !data.predictions?.length) return [];

  return data.predictions.slice(0, limit).map((item) => ({
    label: item.description,
    value: item.description,
    placeId: item.place_id,
  }));
}

export async function resolveGooglePlace(
  placeId: string,
  selectedText?: string,
): Promise<AddressSuggestion | null> {
  const apiKey = placesSuggestKey();
  if (!apiKey || !placeId.trim()) return null;

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId.trim());
  url.searchParams.set("fields", "name,formatted_address,geometry,types");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!response.ok) return null;

  const data = (await response.json()) as DetailsResponse;
  if (data.status !== "OK" || !data.result) return null;

  const loc = data.result.geometry?.location;
  const label = formatGooglePlaceLabel({
    name: data.result.name,
    formattedAddress: data.result.formatted_address,
    selectedText,
    types: data.result.types,
  });

  return {
    label,
    value: label,
    lat: loc?.lat,
    lng: loc?.lng,
    placeId,
  };
}
