export type TripType = "local" | "airport" | "cruise";

export const TRIP_TYPE_OPTIONS: { id: TripType; label: string; hint: string }[] = [
  { id: "airport", label: "Airport", hint: "Flight transfers to or from UK airports" },
  { id: "cruise", label: "Cruise", hint: "Dover cruise terminal pickups" },
  { id: "local", label: "Local", hint: "Town, station, hospital or port" },
];

export type QuickPlace = {
  label: string;
  address: string;
};

export const AIRPORT_QUICK_DESTINATIONS: QuickPlace[] = [
  { label: "Gatwick", address: "London Gatwick Airport, RH6 0NP" },
  { label: "Heathrow", address: "London Heathrow Airport, TW6 1AP" },
  { label: "Stansted", address: "London Stansted Airport, CM24 1QW" },
  { label: "Luton", address: "London Luton Airport, LU2 9LY" },
];

export const AIRPORT_QUICK_PICKUPS: QuickPlace[] = [
  { label: "Dover", address: "Dover, Kent CT16" },
  { label: "Deal", address: "Deal, Kent CT14" },
  { label: "Canterbury", address: "Canterbury, Kent CT1" },
];

export const CRUISE_QUICK_PLACES: QuickPlace[] = [
  { label: "Cruise Terminal 1", address: "Dover Cruise Terminal 1, Dover CT16 1JA" },
  { label: "Cruise Terminal 2", address: "Dover Cruise Terminal 2, Dover CT16 1JA" },
  { label: "Dover Priory", address: "Dover Priory Station, Dover CT17 9SB" },
  { label: "Travelodge Dover", address: "Travelodge Dover, Marine Parade, Dover CT16 1EH" },
  { label: "Dover town", address: "Dover, Kent CT16" },
];

export const LOCAL_QUICK_PLACES: QuickPlace[] = [
  { label: "Dover Priory", address: "Dover Priory Station, Dover CT17 9SB" },
  { label: "Travelodge Dover", address: "Travelodge Dover, Marine Parade, Dover CT16 1EH" },
  { label: "Cruise Terminal 2", address: "Dover Cruise Terminal 2, Dover CT16 1JA" },
  { label: "Cruise Terminal 1", address: "Dover Cruise Terminal 1, Dover CT16 1JA" },
];

export function tripTypeFromParam(value: string | null): TripType | null {
  if (value === "airport" || value === "cruise" || value === "local") return value;
  return null;
}

export function defaultsForTripType(type: TripType): {
  passengers: number;
  luggageLarge: number;
  pickupPlaceholder: string;
  destinationPlaceholder: string;
  transferHint: string;
  transferDetailLabel: string;
  transferDetailPlaceholder: string;
} {
  if (type === "airport") {
    return {
      passengers: 2,
      luggageLarge: 2,
      pickupPlaceholder: "e.g. Dover, Deal or your hotel address",
      destinationPlaceholder: "e.g. London Gatwick Airport, RH6 0NP",
      transferHint: "Landing or departure time — we allow time for baggage collection.",
      transferDetailLabel: "Flight number (optional)",
      transferDetailPlaceholder: "e.g. BA1234, Terminal 5",
    };
  }
  if (type === "cruise") {
    return {
      passengers: 2,
      luggageLarge: 2,
      pickupPlaceholder: "e.g. Dover Cruise Terminal 1 or your hotel",
      destinationPlaceholder: "e.g. Heathrow Airport or your home address",
      transferHint: "Disembarkation or pickup time — we monitor ship schedules when possible.",
      transferDetailLabel: "Ship name (optional)",
      transferDetailPlaceholder: "e.g. MSC Virtuosa, Terminal 2",
    };
  }
  return {
    passengers: 1,
    luggageLarge: 0,
    pickupPlaceholder: "e.g. Dover Priory Station, Dover CT16 1EF",
    destinationPlaceholder: "e.g. William Harvey Hospital, Ashford TN24 0LZ",
    transferHint: "When should we pick you up?",
    transferDetailLabel: "Reference (optional)",
    transferDetailPlaceholder: "e.g. appointment time, ward name",
  };
}
