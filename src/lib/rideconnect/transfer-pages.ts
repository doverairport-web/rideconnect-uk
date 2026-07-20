export type NetworkTransferPage = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  highlights: string[];
  sections: { heading?: string; paragraphs: string[] }[];
};

/** Shared money-keyword transfer landings for RideConnect network sites. */
export const NETWORK_TRANSFER_PAGES: NetworkTransferPage[] = [
  {
    slug: "dover-to-gatwick",
    title: "Dover to Gatwick Taxi | Fixed Fares",
    h1: "Dover to Gatwick Taxi",
    description:
      "Fixed-fare taxi from Dover to Gatwick North and South terminals. Pre-book online with RideConnect UK — licensed Dover district drivers.",
    highlights: ["Fixed guide fares", "North & South terminals", "Cruise connections"],
    sections: [
      {
        paragraphs: [
          "Pre-book a Dover to Gatwick taxi and lock in your guide fare before travel day. Ideal for flights, cruise connections and early-morning departures.",
          "RideConnect UK covers Dover, Deal, Folkestone, Canterbury and Ashford pickups to Gatwick Airport.",
        ],
      },
      {
        heading: "Journey overview",
        paragraphs: [
          "Typical time: around 1 hour 15 minutes to 1 hour 45 minutes depending on M20 and M25 traffic.",
          "MPV options available for families with luggage.",
        ],
      },
    ],
  },
  {
    slug: "dover-to-heathrow",
    title: "Dover to Heathrow Taxi | Fixed Fares",
    h1: "Dover to Heathrow Taxi",
    description:
      "Fixed-fare private hire from Dover to all Heathrow terminals. Pre-book for ferries, cruises and flight connections.",
    highlights: ["All Heathrow terminals", "Fixed guide fares", "24/7 booking"],
    sections: [
      {
        paragraphs: [
          "Heathrow is the busiest airport link from Dover port and cruise terminal. Pre-booking avoids rank queues and surge pricing.",
          "We monitor sailing and flight times where possible and adjust pickup for delays.",
        ],
      },
      {
        heading: "Journey overview",
        paragraphs: [
          "Distance: roughly 75–80 miles via M20 and M25.",
          "Typical time: 1 hour 45 minutes to 2 hours 30 minutes.",
        ],
      },
    ],
  },
  {
    slug: "dover-cruise-terminal-taxi",
    title: "Dover Cruise Terminal Taxi | Pre-book",
    h1: "Dover Cruise Terminal Taxi",
    description:
      "Pre-booked taxis from Dover Cruise Terminal 1 and 2 to Heathrow, Gatwick, London and Kent hotels. Meet-and-greet when your ship docks.",
    highlights: ["Terminal 1 & 2", "Airport connections", "Luggage-friendly MPVs"],
    sections: [
      {
        paragraphs: [
          "Cruise turnaround days are busy at Dover. A pre-booked taxi means your driver is ready when you disembark.",
          "Fixed guide fares to major airports and hotels — book online with RideConnect UK.",
        ],
      },
    ],
  },
  {
    slug: "canterbury-airport-transfer",
    title: "Canterbury Airport Transfer | Fixed Fares",
    h1: "Canterbury Airport Transfers",
    description:
      "Fixed-fare airport taxis from Canterbury to Gatwick, Heathrow, Stansted and Luton. Licensed East Kent private hire.",
    highlights: ["Gatwick & Heathrow", "Stansted & Luton", "Fixed fares"],
    sections: [
      {
        paragraphs: [
          "Need an airport transfer from Canterbury? RideConnect UK offers fixed guide fares and online booking for all major London airports.",
          "Also available from nearby villages and the University of Kent area.",
        ],
      },
    ],
  },
  {
    slug: "folkestone-airport-taxi",
    title: "Folkestone Airport Taxi | Transfers",
    h1: "Folkestone Airport Taxi",
    description:
      "Airport taxis from Folkestone to Gatwick, Heathrow and Stansted. Fixed fares, Eurotunnel and port connections available.",
    highlights: ["Fixed fares", "Eurotunnel links", "Online booking"],
    sections: [
      {
        paragraphs: [
          "Folkestone passengers often connect to Gatwick and Heathrow. Pre-book a private hire vehicle with luggage space and a fixed guide fare.",
        ],
      },
    ],
  },
];

export function getNetworkTransferPage(slug: string) {
  return NETWORK_TRANSFER_PAGES.find((page) => page.slug === slug) ?? null;
}

export function getAllNetworkTransferPages() {
  return NETWORK_TRANSFER_PAGES;
}
