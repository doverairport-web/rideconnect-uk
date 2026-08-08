import { doverAirportFares } from "@/lib/pricing";
import { KTH_CRUISE_HOTELS } from "@/lib/kenttravelhub/cruise-hotels";

export const KTH_CRUISE_TERMINAL_META = {
  title: "Dover Cruise Terminal Guide 2026 | CT1 & CT2 Maps, Taxis & Hotels",
  description:
    "The complete Dover Cruise Terminal guide — Terminal 1 & 2, maps, taxi ranks, hotels, restaurants and pre-booked transfers to Heathrow, Gatwick and London.",
  h1: "Dover Cruise Terminal Guide",
  subhead:
    "Everything cruise passengers need at CT1 and CT2 — live ship schedule, terminal maps, taxi pickups, where to stay, eat and book transfers.",
  updatedAt: "2026-06-13",
};

export const KTH_CRUISE_TERMINAL_NAV = [
  { id: "live", label: "Live schedule" },
  { id: "terminal-1", label: "Terminal 1" },
  { id: "terminal-2", label: "Terminal 2" },
  { id: "maps", label: "Maps" },
  { id: "taxi-rank", label: "Taxi rank" },
  { id: "hotels", label: "Hotels" },
  { id: "restaurants", label: "Restaurants" },
  { id: "transfers", label: "Book transfer" },
] as const;

export const KTH_CRUISE_TERMINALS = [
  {
    id: "terminal-1",
    code: "CT1",
    name: "Cruise Terminal 1",
    subtitle: "Admiralty Pier · Western Docks",
    address: "Admiralty Pier, Dover CT17 9DQ",
    postcode: "CT17 9DQ",
    lat: 51.1232,
    lng: 1.3188,
    usedBy:
      "Larger cruise ships on the Admiralty Pier — many mainstream lines berth here on turnaround days.",
    pickup:
      "Passenger pickup and drop-off at the terminal forecourt. Coaches and taxis use signed lanes on busy days — confirm your meeting point when pre-booking.",
    tips: [
      "Allow 30–90 minutes after published arrival for immigration and luggage.",
      "The pier is a long walk from Dover town — taxis are the practical option with suitcases.",
      "Follow Port of Dover signage for CT1 — not the ferry check-in halls at Eastern Docks.",
    ],
    facilities: [
      "Terminal building with check-in and waiting areas",
      "Coach and taxi set-down zones",
      "Short walk from ship to terminal on most calls",
    ],
  },
  {
    id: "terminal-2",
    code: "CT2",
    name: "Cruise Terminal 2",
    subtitle: "Western Docks cruise facility",
    address: "Western Docks, Dover CT17 9DQ",
    postcode: "CT17 9DQ",
    lat: 51.1158,
    lng: 1.3095,
    usedBy:
      "Newer Western Docks cruise berth — closer to the A20 and Western Docks ferry area than CT1.",
    pickup:
      "Taxi and private hire pickup at the signed cruise terminal approach. Share your cruise line and berth when booking — CT2 gates differ from CT1 on navigation apps.",
    tips: [
      "Check your cruise line app for CT2 vs CT1 before you travel — they are a few minutes apart by road.",
      "Western Docks traffic peaks when ferries and cruise ships overlap — build in buffer.",
      "Pre-booked transfers avoid rank queues on double-ship days.",
    ],
    facilities: [
      "Modern cruise terminal facility at Western Docks",
      "Separate approach road from Eastern Docks ferries",
      "Taxi and coach holding areas on turnaround days",
    ],
  },
] as const;

export const KTH_CRUISE_TERMINAL_MAPS = {
  overview: {
    lat: 51.1195,
    lng: 1.314,
    zoom: 14,
    label: "Dover cruise terminals overview",
  },
} as const;

export const KTH_CRUISE_TAXI_RANK = {
  summary:
    "Dover does not have a single permanent taxi rank inside the cruise terminals. Licensed taxis and pre-booked private hire collect passengers at signed pickup zones outside CT1 and CT2. On busy turnaround Saturdays ranks at the port approach can queue — pre-booking is strongly recommended.",
  points: [
    {
      terminal: "CT1",
      location: "Terminal forecourt and signed pickup lane on Admiralty Pier approach",
      notes:
        "Meet-and-greet drivers should display your name and monitor ship disembarkation times.",
    },
    {
      terminal: "CT2",
      location: "Western Docks cruise terminal taxi/coach area",
      notes:
        "Confirm CT2 in your booking — sat-nav to “Dover Cruise Terminal 2” or Western Docks.",
    },
  ],
  tips: [
    "Pre-book before you disembark — Dover taxis are in high demand when two ships are in port.",
    "Fixed fares beat negotiating at the rank after a long cruise.",
    "MPVs suit families with multiple large suitcases.",
    "For same-day Heathrow or Gatwick flights, allow 2–2½ hours from pickup.",
  ],
} as const;

export const KTH_CRUISE_TERMINAL_HOTELS = KTH_CRUISE_HOTELS;

export const KTH_CRUISE_TERMINAL_RESTAURANTS = [
  {
    id: "marina-rest",
    name: "Dover Marina Restaurant",
    area: "Dover Waterfront · 5 min from terminals",
    type: "Seafood & British",
    description:
      "Harbour views and grilled fish — a classic pre-embarkation or post-cruise dinner by the water.",
  },
  {
    id: "curious",
    name: "The Curious Café",
    area: "Dover Town Centre · 10 min",
    type: "Café & brunch",
    description:
      "Independent café for coffee and brunch before a midday embarkation window.",
  },
  {
    id: "allotment",
    name: "The Allotment",
    area: "Dover · 8 min",
    type: "British gastropub",
    description:
      "Seasonal British menu and local ales — good for a relaxed last night ashore.",
  },
  {
    id: "hackney",
    name: "Hackney's",
    area: "Dover Seafront · 7 min",
    type: "Restaurant & bar",
    description:
      "Seafront dining with views toward the port — walk or short taxi from CT1/CT2.",
  },
  {
    id: "marleys",
    name: "Marley's Café",
    area: "Dover Town · 10 min",
    type: "Café & light meals",
    description:
      "Quick lunches and cakes — handy if you have a few hours between hotel checkout and embarkation.",
  },
  {
    id: "pig",
    name: "The Pig at Bridge Place",
    area: "Canterbury · 35 min",
    type: "Restaurant & rooms",
    description:
      "Kitchen-garden dining for cruise day-trip passengers with time for a proper lunch inland.",
  },
] as const;

export const KTH_CRUISE_TRANSFERS = [
  {
    id: "heathrow",
    label: "Dover Cruise Terminal → Heathrow",
    time: "2–2¼ hrs",
    car: doverAirportFares.heathrow.car,
    mpv: doverAirportFares.heathrow.mpv,
    slug: "dover-cruise-taxi",
    guideSlug: "dover-to-heathrow",
  },
  {
    id: "gatwick",
    label: "Dover Cruise Terminal → Gatwick",
    time: "1¾–2 hrs",
    car: doverAirportFares.gatwick.car,
    mpv: doverAirportFares.gatwick.mpv,
    slug: "dover-cruise-taxi",
    guideSlug: "dover-to-gatwick",
  },
  {
    id: "heathrow-reverse",
    label: "Heathrow → Dover Cruise Terminal",
    time: "2–2½ hrs",
    car: doverAirportFares.heathrow.car,
    mpv: doverAirportFares.heathrow.mpv,
    slug: "heathrow-to-dover",
    guideSlug: "heathrow-to-dover",
  },
  {
    id: "gatwick-reverse",
    label: "Gatwick → Dover Cruise Terminal",
    time: "1¾–2½ hrs",
    car: doverAirportFares.gatwick.car,
    mpv: doverAirportFares.gatwick.mpv,
    slug: "gatwick-to-dover",
    guideSlug: "gatwick-to-dover-travel-guide",
  },
  {
    id: "canterbury",
    label: "Dover Cruise Terminal → Canterbury",
    time: "35–45 min",
    car: 45,
    mpv: 65,
    slug: "cruise-terminal-transfer",
    guideSlug: "canterbury-day-trip-from-dover",
  },
  {
    id: "london",
    label: "Dover Cruise Terminal → London",
    time: "2–2½ hrs",
    car: 120,
    mpv: 160,
    slug: "cruise-terminal-transfer",
    guideSlug: "dover-to-london",
  },
] as const;

export const KTH_CRUISE_TERMINAL_FAQS = [
  {
    question: "Where is Dover Cruise Terminal?",
    answer:
      "Dover has two cruise terminals: CT1 on Admiralty Pier and CT2 at the Western Docks. Both are within the Port of Dover, a few minutes' drive apart and roughly 2 miles from Dover Priory station.",
  },
  {
    question: "What is the difference between CT1 and CT2?",
    answer:
      "CT1 is on the Admiralty Pier and handles many larger ships. CT2 is the newer Western Docks cruise facility with a separate approach road. Your cruise line assigns the berth — check CT1 or CT2 before booking a taxi.",
  },
  {
    question: "Is there a taxi rank at Dover Cruise Terminal?",
    answer:
      "Taxis collect at signed pickup zones outside each terminal rather than a single central rank. On busy turnaround days queues build quickly — pre-booking a private hire is the most reliable option.",
  },
  {
    question: "How do I find today's cruise ships at Dover?",
    answer:
      "Kent Travel Hub shows live cruise arrivals from Port of Dover data on this page and the homepage calendar — refreshed every five minutes.",
  },
  {
    question: "Should I stay in a hotel the night before my cruise?",
    answer:
      "Yes — staying in Dover the night before protects you from M20 delays and missed embarkation, especially if you are travelling from Heathrow, Gatwick or northern England.",
  },
  {
    question: "How long from Dover Cruise Terminal to Heathrow?",
    answer:
      "Typically 2 to 2¼ hours by road in normal traffic. Allow extra time for Operation Brock, port queues and Friday evening M25 congestion.",
  },
] as const;
