import type { RideConnectSiteId } from "@/lib/rideconnect/sites";

export type TransferBookingPrefill = {
  pickup?: string;
  destination?: string;
  /** Maps to BookingForm trip type. */
  type?: "airport" | "cruise" | "local";
};

export type NetworkTransferPage = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  serviceType?: string;
  bookingType?: "airport" | "standard" | "local";
  bookingPrefill?: TransferBookingPrefill;
  /** One-way guide fare for Offer schema / pricing CTAs. */
  guideFare?: { car: number; mpv?: number };
  siteIds?: RideConnectSiteId[];
  /** When set, this domain owns the page — other hosts should redirect here. */
  primarySiteId?: RideConnectSiteId;
  highlights: string[];
  sections: { heading?: string; paragraphs: string[] }[];
  faqs?: { question: string; answer: string }[];
};

/** Shared money-keyword transfer landings for RideConnect network sites. */
export const NETWORK_TRANSFER_PAGES: NetworkTransferPage[] = [
  {
    slug: "dover-to-gatwick",
    title: "Dover to Gatwick Taxi | Fixed Fares from £150",
    h1: "Dover to Gatwick Taxi",
    description:
      "Fixed-fare Dover to Gatwick taxi from £150. Pre-book online — Dover town, Priory, ferry port and cruise terminals.",
    siteIds: ["dovertogatwick"],
    primarySiteId: "dovertogatwick",
    bookingType: "airport",
    bookingPrefill: {
      type: "airport",
      pickup: "Dover, Kent CT16",
      destination: "London Gatwick Airport, RH6 0NP",
    },
    guideFare: { car: 150, mpv: 225 },
    highlights: ["From £150", "North & South", "Cruise connections"],
    sections: [
      {
        heading: "Pre-booked Dover to Gatwick airport transfers",
        paragraphs: [
          "Travel directly from Dover town, Dover Priory station, the ferry port or either Dover Cruise Terminal to Gatwick Airport. A pre-booked private hire vehicle gives you a confirmed pickup time, space for luggage and a direct journey to the correct terminal.",
          "RideConnect UK operates dovertogatwicktaxi.com as our East Kent airport specialist — advance bookings also accepted from Deal, Sandwich, Folkestone, Canterbury and Ashford.",
        ],
      },
      {
        heading: "Dover to Gatwick taxi prices",
        paragraphs: [
          "Our current one-way guide fare from Dover to Gatwick is £150 for a car or £225 for an MPV (North and South terminals).",
          "Your final fare is confirmed when the booking is accepted. Book online and add your flight number in the notes.",
        ],
      },
      {
        heading: "Distance, journey time and route",
        paragraphs: [
          "The road journey is approximately 80 miles. Drivers normally use the A2 or M20 before joining the M26, M25 and M23 towards Gatwick.",
          "Allow roughly 1 hour 30 minutes to 2 hours 15 minutes in normal conditions. M20 and M25 congestion can add time, so leave a sensible check-in margin.",
        ],
      },
      {
        heading: "Gatwick North and South terminals",
        paragraphs: [
          "Tell us which Gatwick terminal you need when you book. We drop off and collect at both North and South — useful for early flights, late arrivals and cruise-to-flight connections.",
          "Add your flight number in the booking notes so we can allow for typical landing and baggage times.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much is a taxi from Dover to Gatwick Airport?",
        answer:
          "The current one-way guide fare is £150 for a car or £225 for an MPV to Gatwick North or South.",
      },
      {
        question: "How long does Dover to Gatwick take by taxi?",
        answer:
          "Allow approximately 1 hour 30 minutes to 2 hours 15 minutes in normal traffic.",
      },
      {
        question: "Can you collect from Dover Cruise Terminal?",
        answer:
          "Yes. Pre-booked collections are available from Dover Cruise Terminal 1 and 2.",
      },
      {
        question: "Do you go to both Gatwick North and South?",
        answer:
          "Yes. Choose North or South when you book — the guide fare is the same for both terminals.",
      },
      {
        question: "Can I book a taxi from Gatwick back to Dover?",
        answer:
          "Yes. Pre-book a Gatwick to Dover taxi with your flight number so the driver can meet you after landing.",
      },
    ],
  },
  {
    slug: "deal-to-gatwick",
    title: "Deal to Gatwick Taxi | Fixed Fares from £135",
    h1: "Deal to Gatwick Taxi",
    description:
      "Fixed-fare Deal to Gatwick taxi from £135. Pre-book online from Deal and nearby Kent towns to Gatwick North or South.",
    siteIds: ["dovertogatwick"],
    primarySiteId: "dovertogatwick",
    bookingType: "airport",
    bookingPrefill: {
      type: "airport",
      pickup: "Deal, Kent CT14",
      destination: "London Gatwick Airport, RH6 0NP",
    },
    guideFare: { car: 135, mpv: 203 },
    highlights: ["From £135", "North & South", "Online booking"],
    sections: [
      {
        heading: "Pre-book a taxi from Deal to Gatwick Airport",
        paragraphs: [
          "Need a Deal to Gatwick taxi? RideConnect UK offers fixed guide fares from Deal (CT14) to Gatwick North and South terminals — useful for holidays, cruise connections via Dover, and early morning flights.",
          "Book online on dovertogatwicktaxi.com, add your flight number, and we allocate a licensed East Kent driver with luggage space.",
        ],
      },
      {
        heading: "Deal to Gatwick taxi price",
        paragraphs: [
          "Current one-way guide fare from Deal to Gatwick is £135 for a car or £203 for an MPV.",
          "Fares are scaled from our Dover Gatwick guide fare. Your final fare is confirmed when the booking is accepted.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much is a taxi from Deal to Gatwick?",
        answer:
          "The current one-way guide fare is £135 for a car or £203 for an MPV.",
      },
      {
        question: "Do you pick up across Deal?",
        answer:
          "Yes. We collect from Deal town, Walmer, Kingsdown and nearby CT14 addresses when pre-booked.",
      },
    ],
  },
  {
    slug: "sandwich-to-gatwick",
    title: "Sandwich to Gatwick Taxi | Fixed Fares from £130",
    h1: "Sandwich to Gatwick Taxi",
    description:
      "Fixed-fare Sandwich to Gatwick taxi from £130. Pre-book airport transfers from Sandwich and East Kent to Gatwick.",
    siteIds: ["dovertogatwick"],
    primarySiteId: "dovertogatwick",
    bookingType: "airport",
    bookingPrefill: {
      type: "airport",
      pickup: "Sandwich, Kent CT13",
      destination: "London Gatwick Airport, RH6 0NP",
    },
    guideFare: { car: 130, mpv: 195 },
    highlights: ["From £130", "Fixed guide fare", "Luggage space"],
    sections: [
      {
        heading: "Sandwich to Gatwick airport transfer",
        paragraphs: [
          "Pre-book a Sandwich to Gatwick taxi for a direct private hire journey to the correct terminal. Ideal for families and travellers with luggage who want a confirmed price before travel day.",
        ],
      },
      {
        heading: "Sandwich to Gatwick taxi price",
        paragraphs: [
          "Current one-way guide fare from Sandwich to Gatwick is £130 for a car or £195 for an MPV.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much is a taxi from Sandwich to Gatwick?",
        answer:
          "The current one-way guide fare is £130 for a car or £195 for an MPV.",
      },
    ],
  },
  {
    slug: "canterbury-to-gatwick",
    title: "Canterbury to Gatwick Taxi | Fixed Fares from £107",
    h1: "Canterbury to Gatwick Taxi",
    description:
      "Fixed-fare Canterbury to Gatwick taxi from £107. Pre-book from Canterbury and University of Kent area to Gatwick Airport.",
    siteIds: ["dovertogatwick"],
    primarySiteId: "dovertogatwick",
    bookingType: "airport",
    bookingPrefill: {
      type: "airport",
      pickup: "Canterbury, Kent CT1",
      destination: "London Gatwick Airport, RH6 0NP",
    },
    guideFare: { car: 107, mpv: 161 },
    highlights: ["From £107", "University area", "Online booking"],
    sections: [
      {
        heading: "Taxi from Canterbury to Gatwick Airport",
        paragraphs: [
          "A Canterbury to Gatwick taxi is one of our most requested East Kent airport transfers. Pre-booking locks in a guide fare and avoids last-minute station or rank uncertainty.",
          "We collect from Canterbury city centre, the University of Kent area and nearby villages.",
        ],
      },
      {
        heading: "Canterbury to Gatwick taxi price",
        paragraphs: [
          "Current one-way guide fare from Canterbury to Gatwick is £107 for a car or £161 for an MPV.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much is a taxi from Canterbury to Gatwick?",
        answer:
          "The current one-way guide fare is £107 for a car or £161 for an MPV.",
      },
      {
        question: "How long is Canterbury to Gatwick by taxi?",
        answer:
          "Allow roughly 1 hour 15 minutes to 1 hour 45 minutes depending on M20 and M25 traffic.",
      },
    ],
  },
  {
    slug: "folkestone-to-gatwick",
    title: "Folkestone to Gatwick Taxi | Fixed Fares from £130",
    h1: "Folkestone to Gatwick Taxi",
    description:
      "Fixed-fare Folkestone to Gatwick taxi from £130. Pre-book from Folkestone, Hythe and Eurotunnel connections to Gatwick.",
    siteIds: ["dovertogatwick"],
    primarySiteId: "dovertogatwick",
    bookingType: "airport",
    bookingPrefill: {
      type: "airport",
      pickup: "Folkestone, Kent CT19",
      destination: "London Gatwick Airport, RH6 0NP",
    },
    guideFare: { car: 130, mpv: 195 },
    highlights: ["From £130", "Eurotunnel links", "Fixed fares"],
    sections: [
      {
        heading: "Folkestone to Gatwick airport taxi",
        paragraphs: [
          "Book a Folkestone to Gatwick taxi for a fixed-guide-fare private hire transfer. Useful after Eurotunnel arrivals or for flights from Gatwick North and South.",
        ],
      },
      {
        heading: "Folkestone to Gatwick taxi price",
        paragraphs: [
          "Current one-way guide fare from Folkestone to Gatwick is £130 for a car or £195 for an MPV.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much is a taxi from Folkestone to Gatwick?",
        answer:
          "The current one-way guide fare is £130 for a car or £195 for an MPV.",
      },
    ],
  },
  {
    slug: "dover-to-heathrow",
    title: "Dover to Heathrow Taxi | Fixed Fares from £248",
    h1: "Dover to Heathrow Taxi",
    description:
      "Fixed-fare Dover to Heathrow taxi from £248. Pre-book private hire to all Heathrow terminals from Dover town, ferry port and cruise terminals.",
    bookingType: "airport",
    bookingPrefill: {
      type: "airport",
      pickup: "Dover, Kent CT16",
      destination: "London Heathrow Airport, TW6 1AP",
    },
    guideFare: { car: 248, mpv: 373 },
    highlights: ["From £248", "All Heathrow terminals", "24/7 booking"],
    sections: [
      {
        heading: "Pre-booked Dover to Heathrow airport transfers",
        paragraphs: [
          "Travel directly from Dover town, Dover Priory, the ferry port or either Dover Cruise Terminal to Heathrow Airport. A pre-booked private hire vehicle gives you a confirmed pickup time, luggage space and a direct journey to the correct terminal.",
          "RideConnect UK covers all Heathrow terminals (T2–T5). Add your flight number and terminal in the booking notes so dispatch can plan traffic on the M20 and M25.",
        ],
      },
      {
        heading: "Dover to Heathrow taxi prices",
        paragraphs: [
          "Our current one-way guide fare from Dover to Heathrow is £248 for a car or £373 for an MPV (T4 and T5). Terminals 2 and 3 are typically up to £255 car / £383 MPV.",
          "Your final fare is confirmed when the booking is accepted. Book online and include passenger count and luggage so we allocate the right vehicle.",
        ],
      },
      {
        heading: "Distance, journey time and route",
        paragraphs: [
          "The road journey is approximately 75–80 miles via the M20 and M25.",
          "Allow roughly 1 hour 45 minutes to 2 hours 30 minutes in normal conditions. M25 congestion around Heathrow can add time — leave a sensible check-in margin for early flights.",
        ],
      },
      {
        heading: "Heathrow terminals and cruise connections",
        paragraphs: [
          "Tell us which Heathrow terminal you need when you book. We drop off and collect at T2, T3, T4 and T5 — useful for early flights, late arrivals and cruise-to-flight connections from Dover.",
          "We monitor sailing and flight times where possible and adjust pickup for delays when you share your ferry or ship details.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much is a taxi from Dover to Heathrow Airport?",
        answer:
          "The current one-way guide fare is £248 for a car or £373 for an MPV to Heathrow T4/T5. T2–T3 may be slightly higher — confirmed when you book.",
      },
      {
        question: "How long does Dover to Heathrow take by taxi?",
        answer:
          "Allow approximately 1 hour 45 minutes to 2 hours 30 minutes in normal traffic. Add extra time at peak M25 periods.",
      },
      {
        question: "Do you cover all Heathrow terminals?",
        answer:
          "Yes. Pre-booked collections and drop-offs are available at Heathrow Terminals 2, 3, 4 and 5.",
      },
      {
        question: "Can you collect from Dover Cruise Terminal for Heathrow?",
        answer:
          "Yes. Add your ship name and expected disembarkation time when booking so the driver meets you after you clear the terminal.",
      },
      {
        question: "Can I book a Heathrow to Dover return taxi?",
        answer:
          "Yes. Pre-book with your flight number so the driver can meet you after landing and baggage reclaim.",
      },
    ],
  },
  {
    slug: "dover-cruise-terminal-taxi",
    title: "Dover Cruise Terminal Taxi | Pre-book from £150 to Gatwick",
    h1: "Dover Cruise Terminal Taxi",
    description:
      "Pre-booked taxis from Dover Cruise Terminal 1 and 2 to Gatwick from £150, Heathrow from £248, London and Kent hotels. Meet-and-greet when your ship docks.",
    bookingType: "airport",
    bookingPrefill: {
      type: "cruise",
      pickup: "Dover Cruise Terminal 1, Dover CT16 1JA",
      destination: "London Gatwick Airport, RH6 0NP",
    },
    guideFare: { car: 150, mpv: 225 },
    highlights: ["Terminal 1 & 2", "Gatwick from £150", "Luggage-friendly MPVs"],
    sections: [
      {
        heading: "Taxi pickup at Dover Cruise Terminal",
        paragraphs: [
          "Cruise turnaround days are busy at Dover. A pre-booked taxi means your driver is ready when you disembark at Cruise Terminal 1 or 2 — no rank queues or uncertain wait times.",
          "RideConnect UK offers fixed guide fares to Gatwick, Heathrow, London stations and Kent hotels. Book online with your ship name and expected disembarkation time.",
        ],
      },
      {
        heading: "Cruise to airport transfers",
        paragraphs: [
          "Popular connections: Dover Cruise Terminal to Gatwick from £150 (car) / £225 (MPV), and to Heathrow from £248 (car) / £373 (MPV).",
          "Add flight number and terminal in the notes. We allow time for luggage and typical cruise terminal clearance when you share your itinerary.",
        ],
      },
      {
        heading: "Hotels, stations and local drop-offs",
        paragraphs: [
          "Need a hotel near the port, Dover Priory station or a Deal/Folkestone address after your cruise? Pre-book a local or short-distance transfer with the same online form.",
          "MPVs are available for families and larger luggage — select passengers and bags when you book.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I pre-book a taxi from Dover Cruise Terminal?",
        answer:
          "Yes. Choose Cruise Terminal 1 or 2 as pickup, add your ship name and expected disembarkation time, and we allocate a driver.",
      },
      {
        question: "How much is Dover Cruise Terminal to Gatwick?",
        answer:
          "The current one-way guide fare is £150 for a car or £225 for an MPV — the same as our Dover to Gatwick guide fare.",
      },
      {
        question: "How much is Dover Cruise Terminal to Heathrow?",
        answer:
          "From £248 for a car or £373 for an MPV, depending on terminal. Confirmed when your booking is accepted.",
      },
      {
        question: "Do you meet passengers with luggage?",
        answer:
          "Yes. Tell us passenger count and luggage so we send a suitable car or MPV. Drivers assist with bags where safe to do so.",
      },
      {
        question: "What if my ship is delayed?",
        answer:
          "Share your ship name when booking and keep your phone on. Contact dispatch if the schedule changes so we can adjust pickup.",
      },
    ],
  },
  {
    slug: "dover-ferry-port-taxi",
    title: "Dover Ferry Port Taxi | Pre-book Local Pickup",
    h1: "Dover Ferry Port Taxi",
    description:
      "Pre-book a Dover ferry port taxi for the Eastern Docks, Dover Priory, local hotels and onward journeys across Kent.",
    serviceType: "Pre-booked ferry port taxi service",
    bookingType: "standard",
    bookingPrefill: {
      type: "local",
      pickup: "Port of Dover Eastern Docks, Dover CT17 9BN",
      destination: "Dover Priory Station, Dover CT17 9SB",
    },
    siteIds: ["dovertaxi", "rideconnect", "oriontaxis"],
    highlights: ["Eastern Docks pickups", "Dover Priory connections", "Cars and MPVs"],
    sections: [
      {
        heading: "Pre-book a taxi to or from Dover ferry port",
        paragraphs: [
          "Arrange a local taxi between the Port of Dover ferry terminal, Dover town centre, Dover Priory railway station or your hotel.",
          "When booking a port collection, include the ferry operator, scheduled arrival time and a UK mobile number.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I pre-book a taxi from Dover ferry port?",
        answer:
          "Yes. Add your ferry operator, scheduled arrival time, passenger count and luggage when booking.",
      },
      {
        question: "Can I book from Dover ferry port to Dover Priory?",
        answer:
          "Yes. Advance local bookings are available between the ferry terminal and Dover Priory railway station.",
      },
    ],
  },
  {
    slug: "dover-priory-station-taxi",
    title: "Dover Priory Station Taxi | Pre-book Pickup",
    h1: "Dover Priory Station Taxi",
    description:
      "Pre-book a taxi at Dover Priory railway station for the ferry port, cruise terminals, local hotels and destinations across Kent.",
    serviceType: "Pre-booked railway station taxi service",
    bookingType: "standard",
    bookingPrefill: {
      type: "local",
      pickup: "Dover Priory Station, Dover CT17 9SB",
    },
    siteIds: ["dovertaxi", "rideconnect", "oriontaxis"],
    highlights: ["Station pickups", "Ferry and cruise connections", "Advance booking"],
    sections: [
      {
        heading: "Taxi pickups at Dover Priory",
        paragraphs: [
          "Book a taxi to meet your train at Dover Priory and continue to the ferry port, cruise terminals, a Dover hotel or another Kent destination.",
          "If your train is delayed, contact dispatch as soon as it is safe to do so.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I book a taxi to meet a train at Dover Priory?",
        answer:
          "Yes. Enter your train arrival time and service details when booking.",
      },
      {
        question: "Do you provide taxis from Dover Priory to the ferry port?",
        answer:
          "Yes. You can request an advance transfer from Dover Priory to the Port of Dover.",
      },
    ],
  },
  {
    slug: "dover-bus-station-taxi",
    title: "Dover Bus Station Taxi | Pencester Road Pickup",
    h1: "Dover Bus Station Taxi",
    description:
      "Pre-book a taxi near Dover's Pencester Road bus stops for the ferry port, Dover Priory, local hotels and onward travel.",
    serviceType: "Pre-booked local taxi service",
    bookingType: "standard",
    bookingPrefill: {
      type: "local",
      pickup: "Pencester Road, Dover CT16 1BW",
    },
    siteIds: ["dovertaxi", "rideconnect", "oriontaxis"],
    highlights: ["Pencester Road area", "Port and station connections", "Local pre-booking"],
    sections: [
      {
        heading: "Taxi pickup near Dover bus station",
        paragraphs: [
          "Arrange a taxi from the Pencester Road bus area in Dover town centre to the ferry port, Dover Priory, local accommodation or another destination.",
          "Use the exact meeting instructions supplied with your confirmed booking.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I pre-book a taxi from Dover bus station?",
        answer:
          "Yes. Enter your expected arrival time and follow the Pencester Road area meeting instructions.",
      },
    ],
  },
  {
    slug: "deal-taxi",
    title: "Deal Taxi | Airport, Station & Local Transfers",
    h1: "Deal Taxi",
    description:
      "Pre-booked taxis from Deal, Kent to Dover, airports, the ferry port and cruise terminals. Fixed guide fares for Deal station, Deal Pier and local journeys.",
    serviceType: "Pre-booked local and airport taxi service",
    bookingType: "standard",
    bookingPrefill: {
      type: "local",
      pickup: "Deal, Kent CT14",
    },
    siteIds: ["dovertaxi", "rideconnect", "oriontaxis"],
    highlights: [
      "Deal station pickups",
      "Airport transfers",
      "Dover ferry & cruise links",
    ],
    sections: [
      {
        heading: "Taxi service covering Deal, Kent",
        paragraphs: [
          "Book a taxi in Deal for local journeys, Deal railway station collections, Deal Pier, hotels and restaurants, or onward travel to Dover and London airports.",
          "RideConnect UK accepts advance bookings from Deal and nearby villages. Enter your pickup address, destination, date and time for a confirmed quote.",
        ],
      },
      {
        heading: "Deal to Dover ferry port and cruise terminal",
        paragraphs: [
          "Need a timed connection from Deal to the Port of Dover or Dover Cruise Terminal? Pre-book so your driver is ready for ferry check-in or ship embarkation.",
          "Include your ferry operator or ship name, passenger count and luggage so dispatch can allocate the right vehicle.",
        ],
      },
      {
        heading: "Deal airport transfers",
        paragraphs: [
          "Advance airport transfers are available from Deal to Gatwick, Heathrow, Stansted and Luton. Guide fares are confirmed when your booking is accepted.",
          "Add flight numbers and terminal details in the booking notes for outbound and return journeys. For Gatwick specifically, see dovertogatwicktaxi.com/transfers/deal-to-gatwick.",
        ],
      },
      {
        heading: "Deal station, pier and town centre",
        paragraphs: [
          "Collections can be arranged from Deal railway station, Deal Pier, the high street and local accommodation. Keep your phone available so the driver can confirm the meeting point.",
          "MPVs are available for families, extra luggage or small groups, subject to availability.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you provide taxis in Deal, Kent?",
        answer:
          "Yes. Pre-booked private hire is available for Deal town, Deal station, Deal Pier and journeys to Dover, airports and other Kent destinations.",
      },
      {
        question: "Can I book a taxi from Deal to Dover ferry port?",
        answer:
          "Yes. Enter your ferry operator and check-in time when booking so dispatch can plan the connection.",
      },
      {
        question: "Do you offer Deal to Gatwick or Heathrow transfers?",
        answer:
          "Yes. Airport transfers from Deal can be requested in advance. Guide fares and vehicle type are confirmed with your booking.",
      },
      {
        question: "Can you pick up from Deal railway station?",
        answer:
          "Yes. Add your train arrival time when booking. Contact dispatch if your train is delayed.",
      },
    ],
  },
  {
    slug: "canterbury-taxi",
    title: "Canterbury Taxi | Airport & Station Transfers",
    h1: "Canterbury Taxi",
    description:
      "Pre-booked taxis from Canterbury, Kent to Gatwick from £107, Heathrow, Dover port and cruise terminals. University area, city centre and station pickups.",
    serviceType: "Pre-booked local and airport taxi service",
    bookingType: "standard",
    bookingPrefill: {
      type: "airport",
      pickup: "Canterbury, Kent CT1",
      destination: "London Gatwick Airport, RH6 0NP",
    },
    guideFare: { car: 107, mpv: 161 },
    siteIds: ["dovertaxi", "rideconnect", "oriontaxis", "dovertogatwick"],
    highlights: ["Gatwick from £107", "University area", "Dover port links"],
    sections: [
      {
        heading: "Taxi service covering Canterbury",
        paragraphs: [
          "Book a pre-arranged taxi from Canterbury city centre, Canterbury West or East stations, or the University of Kent area for airport runs, Dover ferry and cruise connections.",
          "RideConnect UK focuses on advance airport and long-distance bookings from Canterbury — enter your pickup, destination and time for a fixed guide fare.",
        ],
      },
      {
        heading: "Canterbury airport transfers",
        paragraphs: [
          "Guide fares from Canterbury include Gatwick from £107 car / £161 MPV and Heathrow from £193 car / £290 MPV. Final fare confirmed when the booking is accepted.",
          "For the Gatwick route specifically, book on dovertogatwicktaxi.com/transfers/canterbury-to-gatwick.",
        ],
      },
      {
        heading: "Dover port and cruise from Canterbury",
        paragraphs: [
          "Need a timed transfer from Canterbury to Dover ferry or cruise terminal? Pre-book with sailing or ship details so dispatch plans the connection.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you provide taxis in Canterbury?",
        answer:
          "Yes. Pre-booked private hire is available for Canterbury city, university area and stations for airport, Dover port and long-distance journeys.",
      },
      {
        question: "How much is Canterbury to Gatwick by taxi?",
        answer:
          "The current one-way guide fare is £107 for a car or £161 for an MPV.",
      },
      {
        question: "Can you pick up at the University of Kent?",
        answer:
          "Yes. Enter your campus or hall address when booking and keep your phone available for the meeting point.",
      },
    ],
  },
  {
    slug: "folkestone-taxi",
    title: "Folkestone Taxi | Airport & Eurotunnel Transfers",
    h1: "Folkestone Taxi",
    description:
      "Pre-booked taxis from Folkestone, Kent to Gatwick from £130, Heathrow, Dover port and Eurotunnel connections. Harbour, Central station and Cheriton pickups.",
    serviceType: "Pre-booked local and airport taxi service",
    bookingType: "standard",
    bookingPrefill: {
      type: "airport",
      pickup: "Folkestone, Kent CT19",
      destination: "London Gatwick Airport, RH6 0NP",
    },
    guideFare: { car: 130, mpv: 195 },
    siteIds: ["dovertaxi", "rideconnect", "oriontaxis", "dovertogatwick"],
    highlights: ["Gatwick from £130", "Eurotunnel links", "Harbour & station"],
    sections: [
      {
        heading: "Taxi service covering Folkestone",
        paragraphs: [
          "Pre-book a Folkestone taxi for airport transfers, Dover ferry and cruise links, or Eurotunnel-area connections at Cheriton.",
          "Collections from Folkestone Central, the harbour and agreed addresses — advance booking recommended for early flights.",
        ],
      },
      {
        heading: "Folkestone airport transfers",
        paragraphs: [
          "Guide fares from Folkestone include Gatwick from £130 car / £195 MPV. Heathrow and Stansted fares are confirmed when you book.",
          "For Gatwick specifically, use dovertogatwicktaxi.com/transfers/folkestone-to-gatwick.",
        ],
      },
      {
        heading: "Eurotunnel and Dover port links",
        paragraphs: [
          "Travelling after Eurotunnel or connecting to Dover port? Share your arrival window and luggage so we allocate the right vehicle.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you provide taxis in Folkestone?",
        answer:
          "Yes. Pre-booked private hire covers Folkestone town, harbour, Central station and Cheriton for airport and Dover connections.",
      },
      {
        question: "How much is Folkestone to Gatwick by taxi?",
        answer:
          "The current one-way guide fare is £130 for a car or £195 for an MPV.",
      },
      {
        question: "Can you collect near Eurotunnel?",
        answer:
          "Yes. Agree a meeting point near Cheriton when booking and allow time after shuttle arrival.",
      },
    ],
  },
  {
    slug: "ashford-taxi",
    title: "Ashford Taxi | Airport & International Station Transfers",
    h1: "Ashford Taxi",
    description:
      "Pre-booked taxis from Ashford, Kent to Gatwick, Heathrow, Dover port and cruise terminals. Ashford International and town centre pickups.",
    serviceType: "Pre-booked local and airport taxi service",
    bookingType: "standard",
    bookingPrefill: {
      type: "airport",
      pickup: "Ashford, Kent TN24",
      destination: "London Gatwick Airport, RH6 0NP",
    },
    siteIds: ["dovertaxi", "rideconnect", "oriontaxis"],
    highlights: ["International station", "M20 airport corridor", "Dover port links"],
    sections: [
      {
        heading: "Taxi service covering Ashford",
        paragraphs: [
          "Book advance airport and long-distance transfers from Ashford International, town centre or an agreed address on the M20 corridor.",
          "RideConnect UK confirms guide fares when your booking is accepted — ideal for Gatwick, Heathrow, Stansted and Dover cruise or ferry connections.",
        ],
      },
      {
        heading: "Ashford airport transfers",
        paragraphs: [
          "Ashford is well placed for Gatwick and Heathrow via the M20. Enter pickup address, flight details and passenger count for a confirmed quote.",
        ],
      },
      {
        heading: "Dover ferry and cruise from Ashford",
        paragraphs: [
          "Need a timed run from Ashford to Dover Eastern Docks or Cruise Terminal? Pre-book with sailing or ship details.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you provide taxis in Ashford?",
        answer:
          "Yes. Pre-booked private hire is available from Ashford International and town for airport and Dover port journeys.",
      },
      {
        question: "Can you pick up at Ashford International?",
        answer:
          "Yes. Add your train arrival time when booking and keep your phone available for the meeting point.",
      },
      {
        question: "Do you offer Ashford to Gatwick or Heathrow?",
        answer:
          "Yes. Airport transfers from Ashford can be requested in advance with a fixed guide fare confirmed on booking.",
      },
    ],
  },
  {
    slug: "sandwich-taxi",
    title: "Sandwich Taxi | Airport & Dover Port Transfers",
    h1: "Sandwich Taxi",
    description:
      "Pre-booked taxis from Sandwich, Kent to Gatwick from £130, Heathrow, Dover ferry and cruise terminals. Town and station pickups.",
    serviceType: "Pre-booked local and airport taxi service",
    bookingType: "standard",
    bookingPrefill: {
      type: "airport",
      pickup: "Sandwich, Kent CT13",
      destination: "London Gatwick Airport, RH6 0NP",
    },
    guideFare: { car: 130, mpv: 195 },
    siteIds: ["dovertaxi", "rideconnect", "oriontaxis", "dovertogatwick"],
    highlights: ["Gatwick from £130", "Dover port links", "Advance booking"],
    sections: [
      {
        heading: "Taxi service covering Sandwich",
        paragraphs: [
          "Pre-book a Sandwich taxi for airport transfers and Dover ferry or cruise connections. Ideal when you want a confirmed price before travel day.",
          "Collections from Sandwich town, the station and nearby CT13 addresses.",
        ],
      },
      {
        heading: "Sandwich airport transfers",
        paragraphs: [
          "Guide fares from Sandwich include Gatwick from £130 car / £195 MPV. See dovertogatwicktaxi.com/transfers/sandwich-to-gatwick for the dedicated Gatwick landing.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you provide taxis in Sandwich?",
        answer:
          "Yes. Pre-booked private hire covers Sandwich for airport and Dover port journeys.",
      },
      {
        question: "How much is Sandwich to Gatwick by taxi?",
        answer:
          "The current one-way guide fare is £130 for a car or £195 for an MPV.",
      },
    ],
  },
  {
    slug: "corporate-staff-transfers",
    title: "Corporate & Staff Transfers Dover | Account Taxi",
    h1: "Corporate & Staff Transfers",
    description:
      "Regular staff transfers and corporate taxi accounts for Dover and East Kent businesses. Shift cover, airport runs, port crew and invoiced private hire.",
    serviceType: "Corporate and staff transfer taxi service",
    bookingType: "standard",
    bookingPrefill: {
      type: "local",
      pickup: "Dover, Kent CT16",
    },
    siteIds: ["dovertaxi", "rideconnect", "oriontaxis"],
    highlights: [
      "Business accounts",
      "Regular staff shuttles",
      "Shift & airport cover",
    ],
    sections: [
      {
        heading: "Regular employee transfers for Dover and Kent companies",
        paragraphs: [
          "Set up a corporate taxi account for repeat staff journeys — early shifts, late finishes, site-to-site transfers, hotel crew moves and scheduled airport runs.",
          "One account means consistent drivers where possible, agreed pickup points and clear invoicing instead of ad-hoc cash bookings.",
        ],
      },
      {
        heading: "Who this service is for",
        paragraphs: [
          "Hotels, warehouses, factories, offices, care providers, ferry and port operators, and any East Kent employer that needs reliable private hire for employees.",
          "We cover Dover, Deal, Folkestone, Canterbury, Ashford and surrounding villages including Tilmanstone, Eythorne, Aylesham and Eastry.",
        ],
      },
      {
        heading: "Shift work, night cover and airport staff runs",
        paragraphs: [
          "Book recurring pickups for shift patterns, night-shift finishes or early airport departures. Tell dispatch the roster window, passenger count and preferred vehicle type.",
          "MPVs and multiple cars can be arranged for larger teams when availability allows.",
        ],
      },
      {
        heading: "Business accounts and invoicing",
        paragraphs: [
          "Corporate accounts can be set up with a named contact, booking rules and invoice preferences. Journeys are logged against your account for easy monthly reconciliation.",
          "Contact us to open an account, then book online, by phone or through your nominated dispatcher.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can we set up a company taxi account?",
        answer:
          "Yes. Provide a company contact, billing details and typical routes. Once the account is open, authorised staff can book against it.",
      },
      {
        question: "Do you run regular staff shuttles?",
        answer:
          "Yes. Recurring transfers can be scheduled for fixed shift times, subject to vehicle availability and agreed pricing.",
      },
      {
        question: "Can you cover night shifts and early starts?",
        answer:
          "Yes. Advance bookings are recommended for early-morning and late-night staff journeys so a driver is allocated in time.",
      },
      {
        question: "Do you invoice monthly?",
        answer:
          "Account customers can be invoiced according to the terms agreed when the account is opened. Journey details appear on the statement.",
      },
      {
        question: "Which areas do corporate transfers cover?",
        answer:
          "Dover district and East Kent — including Deal, Folkestone, Canterbury, Ashford and surrounding villages — plus airport and port connections.",
      },
    ],
  },
  {
    slug: "canterbury-airport-transfer",
    title: "Canterbury Airport Transfer | Gatwick from £107",
    h1: "Canterbury Airport Transfers",
    description:
      "Fixed-fare Canterbury airport transfers — Gatwick from £107, plus Heathrow, Stansted and Luton. Licensed East Kent private hire.",
    bookingType: "airport",
    bookingPrefill: {
      type: "airport",
      pickup: "Canterbury, Kent CT1",
      destination: "London Gatwick Airport, RH6 0NP",
    },
    guideFare: { car: 107, mpv: 161 },
    siteIds: ["dovertogatwick", "rideconnect", "dovertaxi", "oriontaxis"],
    highlights: ["Gatwick from £107", "Heathrow & Stansted", "Fixed fares"],
    sections: [
      {
        heading: "Airport taxis from Canterbury",
        paragraphs: [
          "Need an airport transfer from Canterbury? RideConnect UK offers fixed guide fares and online booking for Gatwick, Heathrow, Stansted and Luton.",
          "Also available from nearby villages and the University of Kent area. For Gatwick specifically, book on dovertogatwicktaxi.com/transfers/canterbury-to-gatwick.",
        ],
      },
      {
        heading: "Canterbury airport transfer prices",
        paragraphs: [
          "Guide fares from Canterbury: Gatwick £107 car / £161 MPV, Heathrow £193 car / £290 MPV. Final fare confirmed when the booking is accepted.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much is Canterbury to Gatwick by taxi?",
        answer:
          "The current one-way guide fare is £107 for a car or £161 for an MPV. Book via dovertogatwicktaxi.com.",
      },
    ],
  },
  {
    slug: "folkestone-airport-taxi",
    title: "Folkestone Airport Taxi | Gatwick from £130",
    h1: "Folkestone Airport Taxi",
    description:
      "Folkestone airport taxi to Gatwick from £130, plus Heathrow and Stansted. Fixed fares, Eurotunnel and port connections.",
    bookingType: "airport",
    bookingPrefill: {
      type: "airport",
      pickup: "Folkestone, Kent CT19",
      destination: "London Gatwick Airport, RH6 0NP",
    },
    guideFare: { car: 130, mpv: 195 },
    siteIds: ["dovertogatwick", "rideconnect", "dovertaxi", "oriontaxis"],
    highlights: ["Gatwick from £130", "Eurotunnel links", "Online booking"],
    sections: [
      {
        heading: "Airport taxis from Folkestone",
        paragraphs: [
          "Folkestone passengers often connect to Gatwick and Heathrow. Pre-book a private hire vehicle with luggage space and a fixed guide fare.",
          "For the Gatwick route specifically, book on dovertogatwicktaxi.com/transfers/folkestone-to-gatwick.",
        ],
      },
      {
        heading: "Folkestone airport taxi prices",
        paragraphs: [
          "Current one-way guide fare from Folkestone to Gatwick is £130 for a car or £195 for an MPV. Heathrow and Stansted quotes are confirmed when you book.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much is Folkestone to Gatwick by taxi?",
        answer:
          "The current one-way guide fare is £130 for a car or £195 for an MPV.",
      },
      {
        question: "Do you cover Eurotunnel connections?",
        answer:
          "Yes. Agree a Cheriton-area meeting point when booking and allow time after shuttle arrival.",
      },
    ],
  },
];

export function getNetworkTransferPage(slug: string) {
  return NETWORK_TRANSFER_PAGES.find((page) => page.slug === slug) ?? null;
}

export function getAllNetworkTransferPages(siteId?: RideConnectSiteId) {
  if (!siteId) return NETWORK_TRANSFER_PAGES;
  return NETWORK_TRANSFER_PAGES.filter(
    (page) => !page.siteIds || page.siteIds.includes(siteId),
  );
}

/** Gatwick money pages owned by dovertogatwicktaxi.com — consolidate duplicates. */
export const GATWICK_PRIMARY_TRANSFER_SLUGS = [
  "dover-to-gatwick",
  "deal-to-gatwick",
  "sandwich-to-gatwick",
  "canterbury-to-gatwick",
  "folkestone-to-gatwick",
] as const;

export function isGatwickPrimaryTransferSlug(slug: string): boolean {
  return (GATWICK_PRIMARY_TRANSFER_SLUGS as readonly string[]).includes(slug);
}

export function transferBookingType(
  page: NetworkTransferPage,
): "airport" | "cruise" | "local" {
  if (page.bookingPrefill?.type) return page.bookingPrefill.type;
  if (page.bookingType === "airport") return "airport";
  if (page.slug.includes("cruise")) return "cruise";
  return "local";
}

/** Prefills the shared booking form from a transfer landing. */
export function buildTransferBookHref(page: NetworkTransferPage): string {
  const params = new URLSearchParams();
  params.set("type", transferBookingType(page));
  if (page.bookingPrefill?.pickup) {
    params.set("pickup", page.bookingPrefill.pickup);
  }
  if (page.bookingPrefill?.destination) {
    params.set("destination", page.bookingPrefill.destination);
  }
  return `/book?${params.toString()}`;
}

export function buildTransferWhatsAppMessage(page: NetworkTransferPage): string {
  const pickup = page.bookingPrefill?.pickup;
  const destination = page.bookingPrefill?.destination;
  if (pickup && destination) {
    return `Hi, I'd like to book ${page.h1}: ${pickup} → ${destination}.`;
  }
  if (pickup) {
    return `Hi, I'd like to book ${page.h1} from ${pickup}.`;
  }
  return `Hi, I'd like to book ${page.h1}.`;
}

/** Town hub → dedicated taxi landing (indexable). */
export const TOWN_TAXI_LANDING_BY_ID: Record<string, string> = {
  deal: "/transfers/deal-taxi",
  folkestone: "/transfers/folkestone-taxi",
  canterbury: "/transfers/canterbury-taxi",
  ashford: "/transfers/ashford-taxi",
  sandwich: "/transfers/sandwich-taxi",
};

export const DESTINATION_TRANSFER_HREF: Record<string, string> = {
  airport: "/transfers/dover-to-heathrow",
  ferry: "/transfers/dover-ferry-port-taxi",
  cruise: "/transfers/dover-cruise-terminal-taxi",
  stations: "/transfers/dover-priory-station-taxi",
};

export const GATWICK_TRANSFER_BY_TOWN: Record<string, string> = {
  dover: "https://dovertogatwicktaxi.com/transfers/dover-to-gatwick",
  deal: "https://dovertogatwicktaxi.com/transfers/deal-to-gatwick",
  sandwich: "https://dovertogatwicktaxi.com/transfers/sandwich-to-gatwick",
  folkestone: "https://dovertogatwicktaxi.com/transfers/folkestone-to-gatwick",
  canterbury: "https://dovertogatwicktaxi.com/transfers/canterbury-to-gatwick",
};
