import type { KthUtm } from "@/lib/kenttravelhub/utm";

export type KthLandingPage = {
  slug: string;
  title: string;
  h1: string;
  excerpt: string;
  bookUtm: KthUtm;
  sections: { heading?: string; paragraphs: string[] }[];
  highlights: string[];
};

export const KTH_LANDING_PAGES: KthLandingPage[] = [
  {
    slug: "dover-cruise-taxi",
    title: "Dover Cruise Terminal Taxi | Pre-booked Transfers",
    h1: "Dover Cruise Terminal Taxi",
    excerpt:
      "Pre-book a taxi from Dover Cruise Terminal 1 or 2. Fixed fares to Heathrow, Gatwick, London and Kent hotels — meet-and-greet when your ship docks.",
    bookUtm: { campaign: "dover-cruise-taxi", content: "landing" },
    highlights: [
      "Terminal 1 & 2 pickups",
      "Flight connections to all UK airports",
      "Luggage-friendly MPVs available",
    ],
    sections: [
      {
        paragraphs: [
          "Cruise ships at Dover often disembark hundreds of passengers within a short window. Pre-booking a taxi avoids rank queues and fixed your fare before you sail.",
          "RideConnect UK operates from Dover district — licensed private hire with guide fares to Heathrow, Gatwick, Stansted, Luton and local hotels.",
        ],
      },
      {
        heading: "Typical journey times from Dover Cruise Terminal",
        paragraphs: [
          "Heathrow: around 1 hour 45 minutes to 2 hours 15 minutes.",
          "Gatwick: around 1 hour 15 minutes to 1 hour 45 minutes.",
          "London Victoria / central: around 1 hour 45 minutes to 2 hours.",
          "Canterbury: around 35 to 45 minutes.",
        ],
      },
      {
        heading: "Why pre-book?",
        paragraphs: [
          "Your driver can monitor your ship and adjust for delayed disembarkation.",
          "Fixed guide fares — no surge pricing on busy turnaround days.",
          "MPV options for families with multiple suitcases.",
        ],
      },
    ],
  },
  {
    slug: "heathrow-to-dover",
    title: "Heathrow to Dover Taxi | Fixed Fare Transfers",
    h1: "Heathrow to Dover Taxi",
    excerpt:
      "Pre-booked private hire from all Heathrow terminals to Dover, the cruise terminal and ferry port. Licensed Dover district operator.",
    bookUtm: { campaign: "heathrow-to-dover", content: "landing" },
    highlights: [
      "All Heathrow terminals",
      "Dover port & cruise terminal",
      "Guide fare from £248 (car)",
    ],
    sections: [
      {
        paragraphs: [
          "Whether you are catching a ferry, joining a cruise or heading home to Kent, a pre-booked Heathrow to Dover taxi is the simplest door-to-door option with luggage.",
          "RideConnect UK publishes Dover district guide fares — book online and dispatch confirms your pickup time.",
        ],
      },
      {
        heading: "Journey overview",
        paragraphs: [
          "Distance: approximately 75–80 miles via M25 and M20.",
          "Typical time: 1 hour 45 minutes to 2 hours 30 minutes depending on M25/M20 traffic.",
          "Best for: families, groups, early-morning sailings and heavy luggage.",
        ],
      },
    ],
  },
  {
    slug: "gatwick-to-dover",
    title: "Gatwick to Dover Taxi | Airport to Port Transfers",
    h1: "Gatwick to Dover Taxi",
    excerpt:
      "Direct taxi from Gatwick North or South terminal to Dover ferry port, cruise terminal and town.",
    bookUtm: { campaign: "gatwick-to-dover", content: "landing" },
    highlights: [
      "North & South terminals",
      "Guide fare from £191 (car)",
      "Cruise & ferry connections",
    ],
    sections: [
      {
        paragraphs: [
          "Gatwick is the closest major London airport to Dover — a popular arrival point for cruise passengers connecting to Dover Cruise Terminal the same day.",
          "Pre-booking locks in your guide fare and avoids negotiating at the rank after a long flight.",
        ],
      },
      {
        heading: "What to expect",
        paragraphs: [
          "Typical journey time: 1 hour 15 minutes to 1 hour 45 minutes via M25 and M20.",
          "Allow extra time on Friday afternoons and Operation Brock days.",
          "Tell us your terminal and flight number when booking for smoother pickup.",
        ],
      },
    ],
  },
  {
    slug: "dover-ferry-taxi",
    title: "Dover Ferry Port Taxi | Eastern & Western Docks",
    h1: "Dover Ferry Port Taxi",
    excerpt:
      "Taxis to and from Dover Eastern Docks and Western Docks — DFDS, P&O and foot passenger connections across Kent.",
    bookUtm: { campaign: "dover-ferry-taxi", content: "landing" },
    highlights: [
      "Eastern & Western Docks",
      "Early-morning sailings",
      "Ashford, Canterbury & London",
    ],
    sections: [
      {
        paragraphs: [
          "Missed your sailing slot because of port queues? A pre-booked taxi to Dover ferry port helps you arrive with a predictable journey time — especially when M20 traffic is heavy.",
          "We serve DFDS Dover–Calais/Dunkirk and P&O crossings from Dover Eastern Docks.",
        ],
      },
      {
        heading: "Popular routes",
        paragraphs: [
          "London to Dover ferry port — avoid train connections with luggage.",
          "Canterbury or Ashford to Dover docks for early sailings.",
          "Dover port to Heathrow or Gatwick after arriving from France.",
        ],
      },
    ],
  },
  {
    slug: "cruise-terminal-transfer",
    title: "Dover Cruise Terminal Transfer | Port Pickups",
    h1: "Dover Cruise Terminal Transfer",
    excerpt:
      "Private transfer to and from Dover Cruise Terminal — shore excursions, airport connections and hotel drop-offs across Kent.",
    bookUtm: { campaign: "cruise-terminal-transfer", content: "landing" },
    highlights: [
      "Shore excursion taxis",
      "Same-day airport runs",
      "Canterbury & Leeds Castle trips",
    ],
    sections: [
      {
        paragraphs: [
          "Dover is one of the UK's busiest cruise ports. Whether you are joining a ship, disembarking for a flight or taking a day trip to Canterbury, a dedicated transfer beats shared coaches on a tight schedule.",
        ],
      },
      {
        heading: "Shore excursions from Dover",
        paragraphs: [
          "Canterbury Cathedral — around 35 minutes each way.",
          "Leeds Castle — around 40 minutes.",
          "White Cliffs and Dover Castle — 10 to 15 minutes from the terminal.",
        ],
      },
    ],
  },
];

export function getKthLandingPage(slug: string): KthLandingPage | undefined {
  return KTH_LANDING_PAGES.find((page) => page.slug === slug);
}

export function getAllKthLandingPages(): KthLandingPage[] {
  return KTH_LANDING_PAGES;
}
