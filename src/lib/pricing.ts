export type AirportCode =
  | "gatwick"
  | "heathrow"
  | "stansted"
  | "luton"
  | "city";

export type AirportFare = {
  car: number;
  mpv: number;
};

export type TownPricing = {
  id: string;
  town: string;
  note?: string;
  isOfficial?: boolean;
  prices: Partial<Record<AirportCode, AirportFare | "quote">>;
  paris?: "quote";
};

export type GuideFare = {
  name: string;
  postcode?: string;
  car: number | "metered";
  mpv: number | null;
};

export type FareCategory = {
  id: string;
  title: string;
  fares: GuideFare[];
};

export const airports: { code: AirportCode; name: string; short: string }[] = [
  { code: "gatwick", name: "London Gatwick", short: "Gatwick" },
  { code: "heathrow", name: "London Heathrow", short: "Heathrow" },
  { code: "stansted", name: "London Stansted", short: "Stansted" },
  { code: "luton", name: "London Luton", short: "Luton" },
  { code: "city", name: "London City", short: "City" },
];

/** Dover district Hackney Fares — 05.03.2026 */
export const doverAirportFares: Record<AirportCode, AirportFare> = {
  gatwick: { car: 191, mpv: 287 },
  heathrow: { car: 248, mpv: 373 },
  stansted: { car: 247, mpv: 370 },
  luton: { car: 284, mpv: 426 },
  city: { car: 186, mpv: 279 },
};

export const townPricing: TownPricing[] = [
  {
    id: "dover",
    town: "Dover",
    note: "Dover district",
    isOfficial: true,
    prices: { ...doverAirportFares },
    paris: "quote",
  },
  {
    id: "deal",
    town: "Deal",
    note: "Outside district",
    prices: {
      gatwick: "quote",
      heathrow: "quote",
      stansted: "quote",
      luton: "quote",
      city: "quote",
    },
    paris: "quote",
  },
  {
    id: "folkestone",
    town: "Folkestone",
    note: "Outside district",
    prices: {
      gatwick: "quote",
      heathrow: "quote",
      stansted: "quote",
      luton: "quote",
      city: "quote",
    },
    paris: "quote",
  },
  {
    id: "canterbury",
    town: "Canterbury",
    note: "Outside district",
    prices: {
      gatwick: "quote",
      heathrow: "quote",
      stansted: "quote",
      luton: "quote",
      city: "quote",
    },
    paris: "quote",
  },
  {
    id: "ashford",
    town: "Ashford",
    note: "Outside district",
    prices: {
      gatwick: "quote",
      heathrow: "quote",
      stansted: "quote",
      luton: "quote",
      city: "quote",
    },
    paris: "quote",
  },
];

export const fareCategories: FareCategory[] = [
  {
    id: "hospitals",
    title: "Hospitals",
    fares: [
      { name: "Buckland", postcode: "CT17 0HD", car: 7, mpv: 10 },
      { name: "Chaucer", postcode: "CT4 7AR", car: 43, mpv: 65 },
      { name: "Deal", postcode: "CT14 9", car: 24, mpv: 35 },
      { name: "Folkestone Royal Victoria", postcode: "CT19 5BN", car: 28, mpv: 42 },
      { name: "Great Ormond Street", postcode: "WC1N 3JH", car: 258, mpv: 387 },
      { name: "Guy's", postcode: "SE1 9RT", car: 255, mpv: 382 },
      { name: "Hammersmith", postcode: "W12 0HS", car: 277, mpv: 416 },
      { name: "Kent & Canterbury", postcode: "CT1 3NG", car: 43, mpv: 65 },
      { name: "Kent & Sussex", postcode: "TN4 8AT", car: 137, mpv: 205 },
      { name: "King's College", postcode: "SE5 9RS", car: 250, mpv: 375 },
      { name: "Maidstone A&E", postcode: "ME16 9QQ", car: 112, mpv: 167 },
      { name: "Medway Maritime", postcode: "ME7 5NY", car: 109, mpv: 163 },
      { name: "Queen Elizabeth (Margate)", postcode: "CT9 4AN", car: 50, mpv: 75 },
      { name: "St Saviour's", postcode: "CT21 5AW", car: 34, mpv: 50 },
      { name: "St Thomas'", postcode: "SE1 7EH", car: 260, mpv: 390 },
      { name: "William Harvey A&E (Ashford)", postcode: "TN24 0LZ", car: 55, mpv: 82 },
    ],
  },
  {
    id: "castles",
    title: "Castles",
    fares: [
      { name: "Bodiam", postcode: "TN32 5UA", car: 105, mpv: 157 },
      { name: "Canterbury", postcode: "CT1 2PT", car: 47, mpv: 71 },
      { name: "Chilham", postcode: "CT4 8DB", car: 58, mpv: 87 },
      { name: "Deal", postcode: "CT14 7BA", car: 22, mpv: 34 },
      { name: "Dover", postcode: "CT16 1HU", car: 7, mpv: 10 },
      { name: "Hever", postcode: "TN8 7NP", car: 164, mpv: 246 },
      { name: "Leeds", postcode: "ME17 1PL", car: 94, mpv: 141 },
      { name: "Rochester", postcode: "ME1 1SW", car: 121, mpv: 182 },
      { name: "Walmer", postcode: "CT14 7LJ", car: 21, mpv: 31 },
    ],
  },
  {
    id: "london-stations",
    title: "London Main Stations",
    fares: [
      { name: "Waterloo", postcode: "SE1 8SW", car: 261, mpv: 392 },
      { name: "Charing Cross", postcode: "WC2N 5", car: 260, mpv: 390 },
      { name: "Victoria Coach", postcode: "SW1W 9TP", car: 259, mpv: 388 },
      { name: "Victoria Train", postcode: "SW1W 9SJ", car: 258, mpv: 387 },
      { name: "Euston", postcode: "NW1 2RT", car: 261, mpv: 392 },
      { name: "Paddington", postcode: "W2 1", car: 269, mpv: 403 },
      { name: "King's Cross", postcode: "NW1 2", car: 260, mpv: 390 },
      { name: "Lewisham", postcode: "SE13 7", car: 231, mpv: 346 },
      { name: "Liverpool Street", postcode: "EC2M 7", car: 252, mpv: 378 },
    ],
  },
  {
    id: "international",
    title: "International Stations",
    fares: [
      { name: "Ashford International", postcode: "TN24 0PS", car: 60, mpv: 89 },
      { name: "Ebbsfleet International", postcode: "DA11 1", car: 139, mpv: 209 },
      { name: "St Pancras International", postcode: "NW1 2QP", car: 194, mpv: 291 },
    ],
  },
  {
    id: "attractions",
    title: "Wildlife Parks & Museums",
    fares: [
      { name: "Battle of Britain Museum", postcode: "CT18 7AG", car: 25, mpv: 37 },
      { name: "Crabble Corn Mill", postcode: "CT17 0UY", car: 7.5, mpv: 11 },
      { name: "Dover Transport Museum", postcode: "CT16 2HQ", car: 11.2, mpv: 17 },
      { name: "Eagle Heights", postcode: "DA4 0JB", car: 152, mpv: 227 },
      { name: "Howletts Wildlife Park", postcode: "CT4 5AE", car: 41, mpv: 62 },
      { name: "Hurricane & Spitfire Museum", postcode: "CT18 7JJ", car: 17, mpv: 25 },
      { name: "Kearsney Abbey", postcode: "CT16 3EB", car: 10, mpv: 15 },
      { name: "Pine Gardens", postcode: "CT15 6DZ", car: 16, mpv: 24 },
      { name: "Port Lympne", postcode: "CT21 4LB", car: 40, mpv: 60 },
      { name: "Russell Gardens", postcode: "CT16 3EE", car: 10, mpv: 15 },
      { name: "Rye Harbour Nature Reserve", postcode: "TN31 7TU", car: 101, mpv: 152 },
      { name: "Samphire Hoe", car: "metered", mpv: null },
      { name: "Turner Contemporary", postcode: "CT9 1HG", car: 57, mpv: 85 },
      { name: "Wildwood Trust", postcode: "CT6 7LQ", car: 53, mpv: 80 },
      { name: "Wingham Wildlife Park", postcode: "CT3 1JL", car: 45, mpv: 68 },
    ],
  },
  {
    id: "retail",
    title: "Retail Outlets",
    fares: [
      { name: "Ashford Designer Outlet", postcode: "TN24 0SD", car: 57, mpv: 85 },
      { name: "Bluewater", postcode: "DA9 9ST", car: 145, mpv: 217 },
      { name: "De Bradelei Wharf", postcode: "CT17 9BJ", car: 6, mpv: 9 },
      { name: "Hempstead Valley", postcode: "ME7 3PD", car: 99, mpv: 149 },
      { name: "Lakeside", postcode: "RM20 2ZP", car: 166, mpv: 249 },
      { name: "Westwood Cross", postcode: "CT12 5GR", car: 51, mpv: 77 },
    ],
  },
];

export function formatFareCell(
  value: AirportFare | "quote" | null | undefined,
): { car: string; mpv: string } {
  if (value === "quote" || value == null) {
    return { car: "Quote", mpv: "" };
  }
  return { car: `£${value.car}`, mpv: `MPV £${value.mpv}` };
}

export function formatParis(value: "quote" | number | undefined): string {
  if (value === "quote" || value == null) return "Quote";
  return `From £${value}`;
}

export function formatGuideCar(value: number | "metered"): string {
  if (value === "metered") return "Metered";
  if (Number.isInteger(value)) return `£${value}`;
  return `£${value.toFixed(2).replace(/\.00$/, "")}`;
}

export function formatGuideMpv(value: number | null): string {
  if (value == null) return "—";
  return `£${value}`;
}
