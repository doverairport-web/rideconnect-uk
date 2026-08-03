/** Google Open Location Code (Plus Code) pattern. */
export const GOOGLE_PLUS_CODE_RE =
  /\b[23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,3}\b/i;

const POI_TYPES = new Set([
  "establishment",
  "point_of_interest",
  "transit_station",
  "ferry_terminal",
  "airport",
  "train_station",
  "bus_station",
  "lodging",
  "tourist_attraction",
  "premise",
]);

export function looksLikeGooglePlusCode(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const head = trimmed.split(",")[0]?.trim() ?? trimmed;
  return GOOGLE_PLUS_CODE_RE.test(head) || GOOGLE_PLUS_CODE_RE.test(trimmed);
}

/** Prefer a driver-friendly label over Google Plus Codes or cryptic formatted_address. */
export function formatGooglePlaceLabel(input: {
  name?: string | null;
  formattedAddress?: string | null;
  selectedText?: string | null;
  types?: string[] | null;
}): string {
  const name = input.name?.trim() ?? "";
  const formatted = input.formattedAddress?.trim() ?? "";
  const selected = input.selectedText?.trim() ?? "";
  const types = input.types ?? [];

  if (selected && !looksLikeGooglePlusCode(selected)) {
    return selected;
  }

  const formattedIsPlus = looksLikeGooglePlusCode(formatted);
  const isPoi = types.some((type) => POI_TYPES.has(type));

  if (name && (formattedIsPlus || isPoi)) {
    return name;
  }

  if (formatted && !formattedIsPlus) return formatted;
  if (name) return name;
  if (selected) return selected;
  return formatted;
}
