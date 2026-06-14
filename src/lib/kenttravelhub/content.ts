import type { AirportCode } from "@/lib/pricing";
import { doverAirportFares } from "@/lib/pricing";
import { KTH_EXPLORE_IMAGES } from "@/lib/kenttravelhub/brand";

export const KTH_POPULAR_TRANSFERS = [
  {
    id: "cruise-heathrow",
    label: "Dover Cruise Terminal to Heathrow Airport",
    slug: "heathrow-to-dover",
    price: doverAirportFares.heathrow.car,
    icon: "car" as const,
  },
  {
    id: "port-gatwick",
    label: "Dover Port to Gatwick Airport",
    slug: "gatwick-to-dover",
    price: doverAirportFares.gatwick.car,
    icon: "car" as const,
  },
  {
    id: "dover-london",
    label: "Dover to London City Centre",
    slug: "dover-to-london",
    price: 120,
    icon: "car" as const,
    isGuide: true,
  },
  {
    id: "dover-canterbury",
    label: "Dover to Canterbury",
    slug: "canterbury-day-trip-from-dover",
    price: 45,
    icon: "car" as const,
    isGuide: true,
  },
  {
    id: "folkestone-heathrow",
    label: "Folkestone to Heathrow Airport",
    slug: "dover-to-heathrow",
    price: 265,
    icon: "van" as const,
    isGuide: true,
  },
] as const;

/** Curated “most read” guides for the homepage board. */
export const KTH_MOST_READ_GUIDES = [
  "m20-traffic-today",
  "dover-port-waiting-times",
  "dover-ferry-dfds-po-updates",
  "dover-cruise-terminal-guide",
  "operation-brock-kent",
  "dover-to-heathrow",
] as const;

export const KTH_SEARCH_TOPICS = [
  { id: "m20", label: "M20 traffic", articleSlug: "m20-traffic-today" },
  { id: "port", label: "Port queues", articleSlug: "dover-port-waiting-times" },
  { id: "ferry", label: "Ferry delays", articleSlug: "dover-ferry-dfds-po-updates" },
  { id: "brock", label: "Operation Brock", articleSlug: "operation-brock-kent" },
  { id: "cruise", label: "Cruise ships", sectionPath: "/cruise" },
  { id: "heathrow", label: "Heathrow route", articleSlug: "dover-to-heathrow" },
] as const;

export const KTH_EXPLORE_GRID = [
  {
    id: "castle",
    title: "Dover Castle",
    image: KTH_EXPLORE_IMAGES.castle,
    external: "https://www.english-heritage.org.uk/visit/places/dover-castle/",
    linkLabel: "English Heritage",
  },
  {
    id: "canterbury",
    title: "Canterbury Cathedral",
    image: KTH_EXPLORE_IMAGES.canterbury,
    external: "https://www.canterbury-cathedral.org/",
    linkLabel: "Canterbury Cathedral",
  },
  {
    id: "cliffs",
    title: "White Cliffs",
    image: KTH_EXPLORE_IMAGES.cliffs,
    external: "https://www.nationaltrust.org.uk/visit/kent/the-white-cliffs-of-dover",
    linkLabel: "National Trust",
  },
  {
    id: "deal",
    title: "Deal Beach",
    image: KTH_EXPLORE_IMAGES.deal,
    external:
      "https://www.dover.gov.uk/Leisure-Culture-Tourism/Leisure-Facilities/Deal-Pier/Deal-Pier.aspx",
    linkLabel: "Deal Pier",
  },
] as const;

export const KTH_TOP_DESTINATIONS = [
  { name: "Heathrow Airport", miles: 122 },
  { name: "Gatwick Airport", miles: 98 },
  { name: "London", miles: 87 },
  { name: "Canterbury", miles: 22 },
  { name: "Folkestone", miles: 7 },
  { name: "Deal", miles: 6 },
] as const;

export const KTH_TRUST_FEATURES = [
  { id: "licensed", label: "Licensed & Trusted", icon: "shield" as const },
  { id: "fixed", label: "Fixed Prices", icon: "pound" as const },
  { id: "flight", label: "Flight Monitoring", icon: "plane" as const },
  { id: "meet", label: "Meet & Greet", icon: "hand" as const },
  { id: "support", label: "24/7 Support", icon: "clock" as const },
] as const;

export const KTH_BOOKING_TABS = [
  { id: "taxi", label: "Taxi & Transfer" },
  { id: "cruise", label: "Cruise Transfer" },
  { id: "airport", label: "Airport Transfer" },
] as const;

export const KTH_BOOKING_DEFAULTS: Record<
  (typeof KTH_BOOKING_TABS)[number]["id"],
  { from: string; to: string }
> = {
  taxi: { from: "Dover", to: "Destination" },
  cruise: { from: "Dover Cruise Terminal", to: "Heathrow Airport" },
  airport: { from: "Dover", to: "Gatwick Airport" },
};

export const KTH_NEWS_THUMBNAILS: Record<string, string> = {
  "dover-port-waiting-times":
    "https://images.unsplash.com/photo-1569336410530-5935e0680f2c?auto=format&fit=crop&w=200&q=80",
  "dover-cruise-terminal-heathrow":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=200&q=80",
  "m20-traffic-today":
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=200&q=80",
  "dover-to-london":
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=200&q=80",
  "dover-cruise-terminal-guide":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=200&q=80",
  "dover-ferry-dfds-po-updates":
    "https://images.unsplash.com/photo-1569336410530-5935e0680f2c?auto=format&fit=crop&w=200&q=80",
  "gatwick-to-dover-travel-guide":
    "https://images.unsplash.com/photo-1436491865339-9a109c0ab05a?auto=format&fit=crop&w=200&q=80",
  "operation-brock-kent":
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=200&q=80",
  "white-cliffs-dover-visitor-guide": KTH_EXPLORE_IMAGES.cliffs,
  "canterbury-day-trip-from-dover": KTH_EXPLORE_IMAGES.canterbury,
  "dover-to-heathrow":
    "https://images.unsplash.com/photo-1436491865339-9a109c0ab05a?auto=format&fit=crop&w=200&q=80",
  "dover-to-gatwick":
    "https://images.unsplash.com/photo-1436491865339-9a109c0ab05a?auto=format&fit=crop&w=200&q=80",
  "heathrow-to-dover":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=200&q=80",
  "hotels-near-dover-cruise-terminal":
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80",
  "dover-castle-visitor-guide": KTH_EXPLORE_IMAGES.castle,
  "deal-kent-visitor-guide": KTH_EXPLORE_IMAGES.deal,
  "folkestone-channel-tunnel-guide":
    "https://images.unsplash.com/photo-1569336410530-5935e0680f2c?auto=format&fit=crop&w=200&q=80",
  "stansted-to-dover":
    "https://images.unsplash.com/photo-1436491865339-9a109c0ab05a?auto=format&fit=crop&w=200&q=80",
  "dover-cruise-parking-guide":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=200&q=80",
  "calais-vs-dunkirk-ferry-guide":
    "https://images.unsplash.com/photo-1569336410530-5935e0680f2c?auto=format&fit=crop&w=200&q=80",
};

export const KTH_HERO_CTA = [
  { id: "cruise", label: "Cruise Arrivals", emoji: "🚢", href: "/cruise" },
  { id: "ferry", label: "Ferry Updates", emoji: "⛴", href: "/ferries" },
  { id: "airport", label: "Airport Transfers", emoji: "✈", href: "/airports" },
  { id: "live", label: "Live Travel", emoji: "🚦", href: "/live" },
  { id: "visit", label: "Visit Kent", emoji: "🏰", href: "/visit" },
  { id: "stay", label: "Hotels & Eat", emoji: "🏨", href: "/stay" },
] as const;

export const KTH_CATEGORY_CARDS = [
  {
    id: "cruise",
    title: "Cruises",
    description:
      "Live cruise arrivals, ship schedules and terminal information.",
    cta: "View Cruises",
    href: "#cruise",
    theme: "blue" as const,
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    icon: "cruise" as const,
  },
  {
    id: "ferry",
    title: "Ferries",
    description:
      "Ferry updates, delays, live sailings and port information.",
    cta: "View Ferry Updates",
    href: "#ferries",
    theme: "teal" as const,
    image:
      "https://images.unsplash.com/photo-1569336410530-5935e0680f2c?auto=format&fit=crop&w=800&q=80",
    icon: "ferry" as const,
  },
  {
    id: "airports",
    title: "Airports",
    description:
      "Airport transfer guides, prices and live flight information.",
    cta: "Airport Transfers",
    href: "#airports",
    theme: "purple" as const,
    image:
      "https://images.unsplash.com/photo-1436491865339-9a109c0ab05a?auto=format&fit=crop&w=800&q=80",
    icon: "airport" as const,
  },
  {
    id: "visit",
    title: "Visit Kent",
    description:
      "Explore top attractions, places to visit and local experiences.",
    cta: "Explore Kent",
    href: "#visit",
    theme: "green" as const,
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80",
    icon: "castle" as const,
  },
  {
    id: "stay",
    title: "Stay",
    description:
      "Find the best hotels in Dover, Canterbury and across Kent.",
    cta: "Find Hotels",
    href: "#hotels",
    theme: "orange" as const,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    icon: "hotel" as const,
  },
] as const;

export type KthCategoryCardLink =
  | { id: string; label: string; anchor: string }
  | { id: string; label: string; path: string }
  | { id: string; label: string; articleSlug: string }
  | { id: string; label: string; external: string }
  | { id: string; label: string; book: true }
  | { id: string; label: string; bookingSearch: string };

/** Named Dover hotels & B&Bs — direct sites or Booking.com search. */
export const KTH_DOVER_HOTELS = [
  {
    id: "marina",
    label: "Dover Marina Hotel",
    subtitle: "Seafront · 5 min to port",
    external: "https://dovermarinahotel.co.uk/",
    priceFrom: "£85",
  },
  {
    id: "holiday-inn",
    label: "Holiday Inn Dover",
    subtitle: "Whitfield · 10 min to port",
    external: "https://www.holidayinndover.co.uk/",
    priceFrom: "£80",
  },
  {
    id: "premier",
    label: "Premier Inn Dover",
    subtitle: "Town centre · budget",
    external:
      "https://www.premierinn.com/gb/en/hotels/england/kent/dover/dover-central.html",
    priceFrom: "£65",
  },
  {
    id: "travelodge",
    label: "Travelodge Dover",
    subtitle: "Eastern Docks area",
    external: "https://www.travelodge.co.uk/hotels/558/Dover-hotel",
    priceFrom: "£55",
  },
  {
    id: "white-cliffs",
    label: "White Cliffs Hotel",
    subtitle: "Boutique · port views",
    external: "https://www.whitecliffshoteldover.com/",
    priceFrom: "£90",
  },
  {
    id: "hubert",
    label: "Hubert House B&B",
    subtitle: "Seafront guest house",
    bookingSearch: "Hubert House Guest House Dover Kent",
    priceFrom: "£70",
  },
  {
    id: "albany",
    label: "Albany Lodge B&B",
    subtitle: "Town centre B&B",
    bookingSearch: "Albany Lodge Dover Kent",
    priceFrom: "£65",
  },
  {
    id: "marlborough",
    label: "Marlborough Hotel",
    subtitle: "Seafront · classic Dover",
    bookingSearch: "Marlborough Hotel Dover Kent",
    priceFrom: "£60",
  },
] as const;

/** Quick links shown under each hub section on the homepage. */
export const KTH_CATEGORY_CARD_LINKS: Partial<
  Record<(typeof KTH_INFO_HUB_SECTIONS)[number]["id"], readonly KthCategoryCardLink[]>
> = {
  cruise: [
    { id: "arrivals", label: "Arrivals today", anchor: "#cruise" },
    { id: "port-cam", label: "Port webcam", anchor: "#webcam-dover-port" },
    {
      id: "schedule",
      label: "Live schedule",
      external: "https://www.portofdover.com/cruise/schedule-tickets/",
    },
    { id: "terminal", label: "Terminal guide", path: "/cruise-terminal" },
    {
      id: "heathrow",
      label: "Heathrow transfer",
      articleSlug: "dover-cruise-terminal-heathrow",
    },
    {
      id: "gatwick",
      label: "Gatwick transfer",
      articleSlug: "dover-to-gatwick",
    },
    {
      id: "hotels",
      label: "Cruise hotels",
      articleSlug: "hotels-near-dover-cruise-terminal",
    },
    {
      id: "parking",
      label: "Parking guide",
      articleSlug: "dover-cruise-parking-guide",
    },
    { id: "transfer", label: "Book transfer", book: true },
  ],
  ferry: [
    { id: "updates", label: "Live ferry updates", anchor: "#ferries" },
    { id: "port-cam", label: "Port webcam", anchor: "#webcam-dover-port" },
    { id: "eat", label: "Restaurants", anchor: "#restaurants" },
    {
      id: "dfds",
      label: "DFDS updates",
      external:
        "https://www.dfds.com/en-gb/passenger-ferries/passenger-information/travel-updates",
    },
    {
      id: "po",
      label: "P&O updates",
      external: "https://www.poferries.com/en/travel-information",
    },
    {
      id: "waiting",
      label: "Port waiting times",
      articleSlug: "dover-port-waiting-times",
    },
    {
      id: "guide",
      label: "DFDS & P&O guide",
      articleSlug: "dover-ferry-dfds-po-updates",
    },
    {
      id: "calais",
      label: "Calais vs Dunkirk",
      articleSlug: "calais-vs-dunkirk-ferry-guide",
    },
    {
      id: "timetable",
      label: "DFDS timetables",
      external:
        "https://www.dfds.com/en/passenger-ferries/passenger-information/timetables",
    },
    { id: "taxi", label: "Book port taxi", path: "/taxi/dover-ferry-taxi" },
  ],
  airports: [
    { id: "guides", label: "Transfer guides", anchor: "#airports" },
    { id: "heathrow", label: "Dover → Heathrow", articleSlug: "dover-to-heathrow" },
    { id: "gatwick", label: "Dover → Gatwick", articleSlug: "dover-to-gatwick" },
    { id: "stansted", label: "Stansted → Dover", articleSlug: "stansted-to-dover" },
    { id: "heathrow-pickup", label: "Heathrow pickup", path: "/taxi/heathrow-to-dover" },
    { id: "gatwick-pickup", label: "Gatwick pickup", path: "/taxi/gatwick-to-dover" },
    { id: "m20", label: "M20 traffic", articleSlug: "m20-traffic-today" },
  ],
  roads: [
    { id: "live", label: "Live snapshot", anchor: "#hub" },
    { id: "cameras", label: "Live cameras", anchor: "#webcams" },
    { id: "m20", label: "M20 updates", articleSlug: "m20-traffic-today" },
    { id: "brock", label: "Operation Brock", articleSlug: "operation-brock-kent" },
    { id: "waiting", label: "Port queues", articleSlug: "dover-port-waiting-times" },
    {
      id: "traffic-england",
      label: "Traffic England",
      external: "https://www.trafficengland.com/",
    },
    {
      id: "kent",
      label: "Kent Traffic Dover",
      external: "https://nro.kenttraffic.info/",
    },
  ],
  cameras: [
    { id: "all", label: "All cameras", anchor: "#webcams" },
    { id: "port", label: "Dover port", anchor: "#webcam-dover-port" },
    { id: "cliffs", label: "White Cliffs", anchor: "#webcam-white-cliffs" },
    { id: "marina", label: "Marina", anchor: "#webcam-marina" },
    {
      id: "traffic-england",
      label: "Traffic England",
      external: "https://www.trafficengland.com/",
    },
    {
      id: "kent",
      label: "Kent roads CCTV",
      external: "https://nro.kenttraffic.info/",
    },
    {
      id: "m20",
      label: "M20 cameras",
      external: "https://www.motorwaycameras.co.uk/england/m20",
    },
    {
      id: "m20-j11a",
      label: "M20 J11A",
      external:
        "https://www.motorwaycameras.co.uk/england/m20/westbound/traffic-camera/986",
    },
  ],
  hotels: [
    { id: "all", label: "All hotels", anchor: "#hotels" },
    {
      id: "cruise-guide",
      label: "Cruise hotels guide",
      articleSlug: "hotels-near-dover-cruise-terminal",
    },
    { id: "canterbury", label: "Canterbury", anchor: "#hotels" },
    { id: "folkestone", label: "Folkestone", anchor: "#hotels" },
    { id: "deal", label: "Deal", anchor: "#hotels" },
  ],
  restaurants: [
    { id: "all", label: "All restaurants", anchor: "#restaurants" },
    {
      id: "castle",
      label: "Near Dover Castle",
      articleSlug: "dover-castle-visitor-guide",
    },
    {
      id: "cliffs",
      label: "White Cliffs walks",
      articleSlug: "white-cliffs-dover-visitor-guide",
    },
  ],
};

/** Homepage travel info hub — ships, ferries, airports, roads, hotels & restaurants. */
export const KTH_INFO_HUB_SECTIONS = [
  {
    id: "cruise",
    label: "Cruise ships",
    shortLabel: "Cruise",
    emoji: "🚢",
    anchor: "#cruise",
    accent: "border-blue-500",
    tabActive: "bg-blue-600 text-white",
  },
  {
    id: "ferry",
    label: "Ferries",
    shortLabel: "Ferries",
    emoji: "⛴",
    anchor: "#ferries",
    accent: "border-kth-sea",
    tabActive: "bg-kth-sea text-white",
  },
  {
    id: "airports",
    label: "Airports",
    shortLabel: "Airports",
    emoji: "✈",
    anchor: "#airports",
    accent: "border-violet-500",
    tabActive: "bg-violet-600 text-white",
  },
  {
    id: "roads",
    label: "Roads & port",
    shortLabel: "Roads",
    emoji: "🚦",
    anchor: "#hub",
    accent: "border-amber-500",
    tabActive: "bg-amber-600 text-white",
  },
  {
    id: "hotels",
    label: "Hotels",
    shortLabel: "Hotels",
    emoji: "🏨",
    anchor: "#hotels",
    accent: "border-orange-500",
    tabActive: "bg-orange-500 text-white",
  },
  {
    id: "restaurants",
    label: "Restaurants",
    shortLabel: "Food",
    emoji: "🍽",
    anchor: "#restaurants",
    accent: "border-rose-500",
    tabActive: "bg-rose-600 text-white",
  },
  {
    id: "cameras",
    label: "Live cameras",
    shortLabel: "Cameras",
    emoji: "📹",
    anchor: "#webcams",
    accent: "border-sky-500",
    tabActive: "bg-sky-600 text-white",
  },
] as const;

export const KTH_VISIT_QUICK_LINKS = [
  { id: "castle", label: "Dover Castle", articleSlug: "dover-castle-visitor-guide" },
  { id: "cliffs", label: "White Cliffs", articleSlug: "white-cliffs-dover-visitor-guide" },
  { id: "canterbury", label: "Canterbury", articleSlug: "canterbury-day-trip-from-dover" },
  { id: "deal", label: "Deal", articleSlug: "deal-kent-visitor-guide" },
  { id: "folkestone", label: "Folkestone", articleSlug: "folkestone-channel-tunnel-guide" },
] as const;

export const KTH_QUICK_LINKS = [
  { id: "hotels-dover", label: "Hotels in Dover", href: "#hotels" },
  {
    id: "cruise-hotels",
    label: "Cruise Terminal Hotels",
    articleSlug: "hotels-near-dover-cruise-terminal",
  },
  {
    id: "castle",
    label: "Dover Castle",
    articleSlug: "dover-castle-visitor-guide",
  },
  {
    id: "cliffs",
    label: "White Cliffs",
    articleSlug: "white-cliffs-dover-visitor-guide",
  },
  {
    id: "canterbury",
    label: "Canterbury",
    articleSlug: "canterbury-day-trip-from-dover",
  },
  { id: "deal", label: "Deal", articleSlug: "deal-kent-visitor-guide" },
  { id: "restaurants", label: "Eat & Drink", href: "#restaurants" },
  {
    id: "heathrow",
    label: "Heathrow Transfers",
    articleSlug: "dover-to-heathrow",
  },
  {
    id: "gatwick",
    label: "Gatwick Transfers",
    articleSlug: "dover-to-gatwick",
  },
  {
    id: "folkestone",
    label: "Folkestone",
    articleSlug: "folkestone-channel-tunnel-guide",
  },
] as const;

export const KTH_HOME_SNAPSHOT_CARDS = [
  {
    id: "port",
    title: "Dover Port Traffic",
    subtitle: "Current status",
    href: "#live",
    liveKey: "doverPortTraffic" as const,
  },
  {
    id: "cruise",
    title: "Cruise Arrivals Today",
    subtitle: "Today's ships",
    href: "#cruise",
    liveKey: "cruise" as const,
  },
  {
    id: "airports",
    title: "Airport Transfers",
    subtitle: "Gatwick / Heathrow",
    href: "#airports",
    liveKey: null,
  },
  {
    id: "visit",
    title: "Visit Kent",
    subtitle: "Best places to see",
    href: "#visit",
    liveKey: null,
  },
] as const;

export const KTH_AIRPORT_ROUTES: {
  code: AirportCode;
  label: string;
  from: string;
  to: string;
}[] = [
  { code: "gatwick", label: "Dover → Gatwick", from: "Dover", to: "London Gatwick" },
  { code: "heathrow", label: "Dover → Heathrow", from: "Dover", to: "London Heathrow" },
  { code: "stansted", label: "Dover → Stansted", from: "Dover", to: "London Stansted" },
  { code: "luton", label: "Dover → Luton", from: "Dover", to: "London Luton" },
];

export function kthAirportGuidePrice(code: AirportCode): number {
  return doverAirportFares[code].car;
}

export const KTH_TRAVEL_NEWS = [
  {
    slug: "dover-port-waiting-times",
    title: "Current waiting times at Dover Port",
    excerpt:
      "Live queues at the Eastern Docks, Western Docks and check-in — what to expect before you travel.",
    category: "Port",
  },
  {
    slug: "dover-cruise-terminal-heathrow",
    title: "Best way from Dover Cruise Terminal to Heathrow",
    excerpt:
      "Compare taxi, train and coach options — timings, luggage and pre-booking tips for cruise passengers.",
    category: "Cruise",
  },
  {
    slug: "m20-traffic-today",
    title: "Traffic update M20 today",
    excerpt:
      "Junction 8 to 13 conditions, Operation Brock status and the fastest route into Dover.",
    category: "Traffic",
  },
  {
    slug: "dover-to-london",
    title: "How to travel from Dover to London",
    excerpt:
      "Trains, coaches and private hire compared — costs, journey times and when a taxi makes sense.",
    category: "Guides",
  },
] as const;

export const KTH_VISIT_KENT = [
  {
    id: "cliffs",
    title: "White Cliffs of Dover",
    description:
      "Iconic chalk cliffs and coastal walks — the classic first view of England for ferry and cruise arrivals.",
    image: KTH_EXPLORE_IMAGES.cliffs,
    external: "https://www.nationaltrust.org.uk/visit/kent/the-white-cliffs-of-dover",
    linkLabel: "National Trust",
    articleSlug: "white-cliffs-dover-visitor-guide",
    milesFromDover: 2,
  },
  {
    id: "castle",
    title: "Dover Castle",
    description:
      "Medieval fortress, Secret Wartime Tunnels and panoramic views over the Channel — minutes from the port.",
    image: KTH_EXPLORE_IMAGES.castle,
    external: "https://www.english-heritage.org.uk/visit/places/dover-castle/",
    linkLabel: "English Heritage",
    articleSlug: "dover-castle-visitor-guide",
    milesFromDover: 1,
  },
  {
    id: "canterbury",
    title: "Canterbury Cathedral",
    description:
      "UNESCO World Heritage site and pilgrimage landmark — an easy day trip from Dover by road or rail.",
    image: KTH_EXPLORE_IMAGES.canterbury,
    external: "https://www.canterbury-cathedral.org/",
    linkLabel: "Canterbury Cathedral",
    articleSlug: "canterbury-day-trip-from-dover",
    milesFromDover: 22,
  },
  {
    id: "folkestone",
    title: "Folkestone",
    description:
      "Creative Coast harbour town, art trail and sandy beaches — a relaxed alternative to Dover for Channel crossings.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    external: "https://www.thefederation.co.uk/",
    linkLabel: "Creative Folkestone",
    articleSlug: "folkestone-channel-tunnel-guide",
    milesFromDover: 7,
  },
  {
    id: "deal",
    title: "Deal",
    description:
      "Historic seaside pier, independent shops and Georgian architecture on the Kent coast between Dover and Ramsgate.",
    image: KTH_EXPLORE_IMAGES.deal,
    external:
      "https://www.dover.gov.uk/Leisure-Culture-Tourism/Leisure-Facilities/Deal-Pier/Deal-Pier.aspx",
    linkLabel: "Deal Pier",
    articleSlug: "deal-kent-visitor-guide",
    milesFromDover: 6,
  },
] as const;

export const KTH_FERRY_TOPICS = [
  {
    id: "calais",
    title: "Dover–Calais updates",
    description: "Cross-Channel sailings, check-in times and peak-period queues at the Eastern Docks.",
  },
  {
    id: "dfds",
    title: "DFDS updates",
    description: "DFDS Seaways departures from Dover — freight and passenger ferry status.",
  },
  {
    id: "po",
    title: "P&O updates",
    description: "P&O Ferries Dover terminal news, delays and sailing schedules.",
  },
  {
    id: "waiting",
    title: "Waiting times",
    description: "Port approach queues, Operation Brock and the fastest route to check-in.",
    guideSlug: "dover-port-waiting-times",
  },
] as const;

export const KTH_STAY_KENT = [
  {
    id: "dover",
    title: "Hotels in Dover",
    description:
      "Stay near the port, cruise terminal and Priory station — ideal before an early ferry or after a late arrival.",
    search: "Dover, Kent, United Kingdom",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    fromPrice: "£65",
  },
  {
    id: "cruise",
    title: "Hotels near Cruise Terminal",
    description:
      "Overnight stays within minutes of Dover Cruise Terminal — perfect before embarkation or after disembarkation.",
    search: "Dover Cruise Terminal, Kent, United Kingdom",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
    fromPrice: "£70",
  },
  {
    id: "canterbury",
    title: "Hotels in Canterbury",
    description:
      "Historic city centre stays within 30 minutes of Dover — perfect for cathedral visits and restaurant evenings.",
    search: "Canterbury, Kent, United Kingdom",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    fromPrice: "£75",
  },
  {
    id: "folkestone",
    title: "Hotels in Folkestone",
    description:
      "Coastal hotels and B&Bs on the Creative Coast — handy for Channel Tunnel connections and cliff walks.",
    search: "Folkestone, Kent, United Kingdom",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
    fromPrice: "£70",
  },
  {
    id: "deal",
    title: "Hotels in Deal",
    description:
      "Seaside town between Dover and Ramsgate — quieter overnight stop with easy A258 access to the port.",
    search: "Deal, Kent, United Kingdom",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
    fromPrice: "£60",
  },
] as const;

/** Restaurants within ~5 miles of Dover port — direct sites or Google Maps. */
export const KTH_DOVER_RESTAURANTS = [
  {
    id: "marina",
    label: "Dover Marina Restaurant",
    subtitle: "Waterfront · 0.5 mi",
    type: "Seafood & British",
    external: "https://dovermarinahotel.co.uk/dining/",
  },
  {
    id: "mr-whites",
    label: "Mr White's Chophouse",
    subtitle: "Marina Curve · 0.5 mi",
    type: "Steak & grill",
    external: "https://dovermarinahotel.co.uk/mr-whites-english-chophouse/",
  },
  {
    id: "wheelers",
    label: "Wheeler's Fish & Chips",
    subtitle: "Marina · 0.6 mi",
    type: "Fish & chips",
    external: "https://dovermarinahotel.co.uk/wheelers-fish-and-chips/",
  },
  {
    id: "allotment",
    label: "The Allotment",
    subtitle: "Dover High Street · 1 mi",
    type: "British gastropub",
    external: "http://www.theallotmentdover.co.uk/",
  },
  {
    id: "curious",
    label: "The Curious Café",
    subtitle: "Dover town · 1 mi",
    type: "Café & brunch",
    mapsQuery: "The Curious Cafe, Dover, Kent CT16",
  },
  {
    id: "hackneys",
    label: "Hackney's",
    subtitle: "Dover seafront · 0.8 mi",
    type: "Restaurant & bar",
    mapsQuery: "Hackney's Restaurant, Dover, Kent",
  },
  {
    id: "marleys",
    label: "Marley's Café",
    subtitle: "Dover town · 1 mi",
    type: "Café",
    mapsQuery: "Marley's Cafe, Dover, Kent",
  },
  {
    id: "louis",
    label: "Louis' Restaurant",
    subtitle: "Dover · 1 mi",
    type: "French",
    mapsQuery: "Louis Restaurant, Dover, Kent",
  },
  {
    id: "coastguard",
    label: "The Coastguard",
    subtitle: "St Margaret's · 2 mi",
    type: "Pub & dining",
    external: "https://www.thecoastguard.co.uk/",
  },
  {
    id: "black-horse",
    label: "The Black Horse",
    subtitle: "River · 2 mi",
    type: "Pub food",
    mapsQuery: "The Black Horse, River, Dover, Kent",
  },
  {
    id: "deal-pier",
    label: "Deal Pier Kitchen",
    subtitle: "Deal pier · 3 mi",
    type: "Seafood",
    external: "https://www.dealpierkitchen.co.uk/",
  },
  {
    id: "beach-street",
    label: "81 Beach Street",
    subtitle: "Deal seafront · 3 mi",
    type: "Modern British",
    mapsQuery: "81 Beach Street, Deal, Kent",
  },
  {
    id: "red-lion",
    label: "The Red Lion",
    subtitle: "Capel-le-Ferne · 3 mi",
    type: "Pub & grill",
    mapsQuery: "The Red Lion, Capel-le-Ferne, Kent",
  },
  {
    id: "farrier",
    label: "The Farrier",
    subtitle: "Capel-le-Ferne · 3 mi",
    type: "Gastropub",
    mapsQuery: "The Farrier, Capel-le-Ferne, Kent",
  },
] as const;

export const KTH_EAT_KENT = [
  {
    id: "marina",
    name: "Dover Marina Restaurant",
    area: "Dover Waterfront",
    type: "Seafood & British",
    description:
      "Harbour views and classic British dishes — popular with ferry passengers and weekend visitors.",
  },
  {
    id: "curious",
    name: "The Curious Café",
    area: "Dover Town Centre",
    type: "Café & brunch",
    description:
      "Independent café near the high street — good coffee stop before port check-in.",
  },
  {
    id: "pig",
    name: "The Pig at Bridge Place",
    area: "Canterbury",
    type: "Restaurant & rooms",
    description:
      "Kitchen-garden dining a short drive from Dover — ideal for cruise day-trip lunches.",
  },
  {
    id: "ambrette",
    name: "The Ambrette",
    area: "Rye & Canterbury",
    type: "Indian fine dining",
    description:
      "Award-winning Indian cuisine — Canterbury branch easy to reach from Dover cruise calls.",
  },
] as const;

export const KTH_LOCAL_ADVERTISE = {
  title: "Promote your Kent business",
  description:
    "Restaurants, hotels and local services can feature on Kent Travel Hub — high-intent travel traffic from port, cruise and airport searches.",
  email: process.env.NEXT_PUBLIC_EMAIL?.trim() || "info@rideconnectuk.com",
};

export type LiveSeverity = "ok" | "warn" | "alert";

export type LiveStatus = {
  label: string;
  detail: string;
  severity: LiveSeverity;
};

export type CruiseArrival = {
  name: string;
  time: string;
  terminal: string;
};

export type CruiseScheduleEntry = {
  name: string;
  line: string;
  arrives: string;
  departs: string;
  terminal: string;
  date: string;
  dateLabel: string;
};

export type CruiseCalendar = {
  today: CruiseScheduleEntry[];
  tomorrow: CruiseScheduleEntry[];
  thisWeek: CruiseScheduleEntry[];
  thisMonth: CruiseScheduleEntry[];
  scheduleDate: string;
};

import type { FerryArrivalEntry } from "@/lib/kenttravelhub/fetchers/ferry-arrivals";

export type LiveDataSources = {
  cruise: string;
  m20: string;
  ferry: string;
  port: string;
  brock: string;
  weather: string;
  ferryArrivals: string;
};

export type LiveWeather = {
  tempC: number;
  label: string;
};

export type LiveTravelSnapshot = {
  updatedAt: string;
  sources: LiveDataSources;
  doverPortTraffic: LiveStatus;
  ferryDelays: LiveStatus;
  m20Traffic: LiveStatus;
  m20JourneyMinutes?: number;
  m20DelayMinutes?: number;
  operationBrock: LiveStatus & { active: boolean };
  cruiseArrivals: CruiseArrival[];
  cruiseCalendar: CruiseCalendar;
  ferryArrivals: FerryArrivalEntry[];
  weather: LiveWeather;
};
