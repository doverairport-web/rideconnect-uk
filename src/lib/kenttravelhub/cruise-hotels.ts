/**
 * Cruise-passenger hotels near Dover CT1 & CT2.
 * Photos are official property images (local copies or hotel CDN URLs — never stock).
 */

export type KthCruiseHotel = {
  id: string;
  name: string;
  officialUrl: string;
  /** Local path under /public or official hotel CDN URL. */
  image: string;
  imageCredit: string;
  distanceCt1: string;
  distanceCt2: string;
  taxiMinutes: string;
  parking: boolean;
  restaurant: boolean;
  breakfast: string;
  /** Typical guest score (Google / TripAdvisor aggregate). */
  guestRating: number;
  priceFrom: number;
  /** Why cruise passengers pick this hotel. */
  cruiseNote: string;
};

export const KTH_CRUISE_HOTELS_INTRO =
  "These are the Dover hotels cruise passengers actually use — the night before embarkation at CT1 or CT2, or after disembarkation before an airport run. Every listing links to the hotel's own website, with distances from both cruise terminals and honest taxi times.";

export const KTH_CRUISE_HOTELS: KthCruiseHotel[] = [
  {
    id: "dover-marina-hilton",
    name: "Dover Marina Hotel & Spa, Tapestry Collection by Hilton",
    officialUrl:
      "https://www.hilton.com/en/hotels/qqedohx-dover-marina-hotel-and-spa/",
    image: "/kenttravelhub/hotels/dover-marina-hotel.jpg",
    imageCredit: "Official photo — dovermarinahotel.co.uk",
    distanceCt1: "0.9 mi",
    distanceCt2: "0.4 mi",
    taxiMinutes: "3–5 min",
    parking: true,
    restaurant: true,
    breakfast: "Restaurant & room service",
    guestRating: 4.3,
    priceFrom: 120,
    cruiseNote:
      "On the marina — closest full-service hotel to CT2. Cruise passengers pre-book here for harbour views and a short taxi to either terminal.",
  },
  {
    id: "premier-inn-eastern",
    name: "Premier Inn Dover Central (Eastern Ferry Terminal)",
    officialUrl:
      "https://www.premierinn.com/gb/en/hotels/england/kent/dover/dover-central-eastern-ferry-terminal.html",
    image: "/kenttravelhub/hotels/premier-inn-dover.jpg",
    imageCredit: "Official photo — Premier Inn / Leonardo",
    distanceCt1: "1.1 mi",
    distanceCt2: "1.3 mi",
    taxiMinutes: "5–8 min",
    parking: true,
    restaurant: true,
    breakfast: "Thyme restaurant — breakfast available",
    guestRating: 4.1,
    priceFrom: 65,
    cruiseNote:
      "Steps from the Eastern Ferry Terminal — practical if you are also watching ferry traffic, with reliable taxis to CT1 and CT2.",
  },
  {
    id: "holiday-inn-dover",
    name: "Holiday Inn Dover",
    officialUrl: "https://www.holidayinndover.co.uk/",
    image: "/kenttravelhub/hotels/holiday-inn-dover.jpg",
    imageCredit: "Official photo — holidayinndover.co.uk",
    distanceCt1: "2.4 mi",
    distanceCt2: "2.6 mi",
    taxiMinutes: "8–10 min",
    parking: true,
    restaurant: true,
    breakfast: "Buffet breakfast available",
    guestRating: 4.2,
    priceFrom: 80,
    cruiseNote:
      "Whitfield — quieter than the waterfront but easy M20/A20 access. Families like the pool; book an early taxi on turnaround Saturdays.",
  },
  {
    id: "best-western-marina",
    name: "Best Western Premier Dover Marina Hotel",
    officialUrl:
      "https://www.bestwestern.co.uk/hotels/best-western-premier-dover-marina-hotel-83649",
    image: "/kenttravelhub/hotels/dover-marina-hotel.jpg",
    imageCredit: "Official photo — Dover Marina (Western Docks)",
    distanceCt1: "0.9 mi",
    distanceCt2: "0.4 mi",
    taxiMinutes: "3–5 min",
    parking: true,
    restaurant: true,
    breakfast: "Available",
    guestRating: 4.2,
    priceFrom: 85,
    cruiseNote:
      "Western Docks marina location — same waterfront cruise passengers have used for years. Confirm current branding when booking (property also trades as Hilton Tapestry).",
  },
  {
    id: "travelodge-dover",
    name: "Travelodge Dover",
    officialUrl: "https://www.travelodge.co.uk/hotels/558/Dover-hotel",
    image: "/kenttravelhub/hotels/travelodge-dover.webp",
    imageCredit: "Official photo — Travelodge",
    distanceCt1: "1.0 mi",
    distanceCt2: "0.9 mi",
    taxiMinutes: "5–7 min",
    parking: true,
    restaurant: false,
    breakfast: "Breakfast box (pre-order)",
    guestRating: 3.8,
    priceFrom: 55,
    cruiseNote:
      "Budget chain near the Eastern Docks approach — no frills, but a solid overnight before a morning embarkation if you only need sleep and a shower.",
  },
  {
    id: "white-cliffs-hotel",
    name: "White Cliffs Hotel",
    officialUrl: "https://www.whitecliffshoteldover.com/",
    image:
      "https://www.whitecliffshoteldover.com/wp-content/uploads/2021/06/White-Cliffs-Hotel-Dover-Exterior.jpg",
    imageCredit: "Official photo — whitecliffshoteldover.com",
    distanceCt1: "1.4 mi",
    distanceCt2: "1.6 mi",
    taxiMinutes: "6–9 min",
    parking: true,
    restaurant: true,
    breakfast: "Included with many rates",
    guestRating: 4.4,
    priceFrom: 90,
    cruiseNote:
      "Boutique hotel above the port with Channel views — popular post-cruise for a calm night before Heathrow or Gatwick the next morning.",
  },
  {
    id: "st-margarets-hotel",
    name: "St Margaret's Hotel",
    officialUrl:
      "https://www.parkdeanresorts.co.uk/location/kent-sussex/st-margarets-bay/hotel/",
    image:
      "https://www.parkdeanresorts.co.uk/-/media/parkdean-resorts/accommodation/hotel/stmargaretsbayhotel/stmargaretsbayhotel_desktop.jpg?rev=20260512101314&hash=6A5B4534AA17C06A511A267D2CEA4160",
    imageCredit: "Official photo — Parkdean Resorts",
    distanceCt1: "3.6 mi",
    distanceCt2: "3.8 mi",
    taxiMinutes: "12–15 min",
    parking: true,
    restaurant: true,
    breakfast: "Boathouse restaurant",
    guestRating: 3.9,
    priceFrom: 51,
    cruiseNote:
      "On the cliffs at St Margaret's Bay — quieter than Dover waterfront. Good for a relaxed pre-cruise night with coastal walks; allow extra taxi time.",
  },
  {
    id: "hubert-house",
    name: "Hubert House Guesthouse",
    officialUrl: "https://www.huberthouse.co.uk/",
    image:
      "https://le-cdn.website-editor.net/s/dc16ed6aba1643f1b134e01e2c188a0d/dms3rep/multi/opt/Outside-0002-1920w.jpg",
    imageCredit: "Official photo — huberthouse.co.uk",
    distanceCt1: "1.2 mi",
    distanceCt2: "1.4 mi",
    taxiMinutes: "6–8 min",
    parking: false,
    restaurant: false,
    breakfast: "Full English included",
    guestRating: 4.6,
    priceFrom: 70,
    cruiseNote:
      "Seafront guesthouse with personal service — couples often choose this over a chain hotel for a homely night before sailing.",
  },
];

export function formatHotelPrice(gbp: number): string {
  return `£${gbp}`;
}

export function kthCruiseHotelById(id: string): KthCruiseHotel | undefined {
  return KTH_CRUISE_HOTELS.find((hotel) => hotel.id === id);
}
