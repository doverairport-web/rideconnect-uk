import { passengerWebUrl } from "@/lib/apps";

export const RC_SERVICES = [
  {
    id: "local",
    title: "Local Taxi",
    description: "Dover, Deal, Folkestone and Kent towns — hospital, station, port and town journeys.",
    href: "/transfers/deal-taxi",
  },
  {
    id: "airport",
    title: "Airport Transfers",
    description:
      "Fixed fares to Gatwick, Heathrow, Stansted, Luton and London City from Dover, Deal, Sandwich, Folkestone and Canterbury.",
    href: "https://dovertogatwicktaxi.com/transfers/dover-to-gatwick",
  },
  {
    id: "cruise",
    title: "Cruise Transfers",
    description: "Dover Cruise Terminal meet-and-greet — ship-to-airport and hotel connections.",
    href: "/transfers/dover-cruise-terminal-taxi",
  },
  {
    id: "school",
    title: "School Transport",
    description: "Regular school runs with trusted local drivers and reliable pickup times.",
    href: "#school-transport",
  },
  {
    id: "account",
    title: "Account Work",
    description: "Business and account bookings — regular routes, invoicing and dedicated dispatch support.",
    href: "/transfers/corporate-staff-transfers",
  },
] as const;

export const RC_COVERAGE_AREAS = [
  { name: "Dover", description: "Full local taxi service — port, cruise, town and Priory station." },
  { name: "Deal", description: "Fixed airport fares to Gatwick, Heathrow, Stansted and Luton." },
  { name: "Sandwich", description: "East Kent airport pickup — fixed fares to London airports." },
  { name: "Folkestone", description: "Airport and cruise connections from Folkestone and Channel Tunnel." },
  { name: "Canterbury", description: "Fixed airport transfers and local private hire." },
  { name: "Ashford", description: "International station and airport transfer pickup point." },
] as const;

export const RC_MARKETING_WHY_CARDS = [
  {
    id: "drivers-earn",
    title: "Drivers keep up to 90%",
    highlight: "90%",
    description: "We believe local drivers should keep more of what they earn.",
    icon: "wallet" as const,
    accent: "green" as const,
  },
  {
    id: "local-drivers",
    title: "Local Kent drivers",
    description:
      "Professional local drivers who know Dover, Kent, ports, airports and schools.",
    icon: "map" as const,
    accent: "navy" as const,
  },
  {
    id: "no-surge",
    title: "No surge pricing",
    description: "Fair, clear pricing without sudden surge charges.",
    icon: "chart" as const,
    accent: "navy" as const,
  },
  {
    id: "airport-fares",
    title: "Fixed airport fares",
    description: "Book airport transfers with clear prices and reliable pickup planning.",
    icon: "plane" as const,
    accent: "navy" as const,
  },
  {
    id: "cruise",
    title: "Cruise specialists",
    description: "Dover Cruise Terminal pickups with luggage-friendly vehicles.",
    icon: "ship" as const,
    accent: "navy" as const,
  },
  {
    id: "book-your-way",
    title: "Book your way",
    description: "Book online, through the passenger app, by WhatsApp or by phone.",
    icon: "devices" as const,
    accent: "navy" as const,
  },
] as const;

export const RC_WHY_CARDS = [
  { title: "Local drivers", description: "Licensed Kent drivers who know Dover port, cruise terminals and M20 traffic." },
  { title: "Fixed airport fares", description: "Published guide fares to Gatwick, Heathrow, Stansted and Luton — no surge pricing." },
  { title: "Cruise specialists", description: "Meet-and-greet at Dover Cruise Terminal with luggage-friendly vehicles." },
  { title: "School transport", description: "Weekly recurring school runs with the same driver where possible." },
  { title: "WhatsApp booking", description: "Message us your journey details — we confirm and dispatch quickly." },
  { title: "No surge pricing", description: "Fair, published fares — what you see is what dispatch quotes." },
  { title: "Live tracking", description: "Track your ride in the RideConnect passenger app when your driver is assigned." },
  { title: "Regular customer rewards", description: "Loyalty benefits for frequent travellers and account customers." },
] as const;

export const RC_SCHOOL_FEATURES = [
  "Same driver where possible",
  "Weekly recurring bookings",
  "Parent notifications",
  "Reliable pickup times",
  "Kent County Council school run contracts",
  "Multi-stop pickups across Dover",
  "Child locks fitted when required",
  "Invoice billing for councils and schools",
] as const;

/** Example school-run patterns (anonymised from live contract work). */
export const RC_SCHOOL_RUN_EXAMPLES = [
  {
    id: "morning-college",
    label: "Morning college run",
    time: "Early morning pickup",
    summary: "Collect pupils from Dover addresses, then one journey to college.",
    pickups: ["Dover — home pickups"],
    dropOff: "EKC Broadstairs College, Broadstairs",
    notes: "Child locks on rear doors when requested.",
  },
  {
    id: "afternoon-return",
    label: "Afternoon return",
    time: "After college finish",
    summary: "College pickup, then separate drop-offs at home addresses in Dover.",
    pickups: ["East Kent College / Broadstairs area"],
    dropOff: "Dover — home drop-offs",
    notes: "Estate vehicles with space for bags and equipment.",
  },
] as const;

export const RC_GATWICK_AIRPORTS = [
  { code: "gatwick", label: "Gatwick", highlight: true },
  { code: "heathrow", label: "Heathrow", highlight: true },
  { code: "stansted", label: "Stansted", highlight: false },
  { code: "luton", label: "Luton", highlight: false },
] as const;

export const RC_PASSENGER_APP_URL = passengerWebUrl;

export const RC_HERO_IMAGE = "/kenttravelhub/hero-dover.jpg";

export const RC_PASSENGER_SCREENSHOTS = [
  {
    src: "/rideconnect/passenger/home.png",
    alt: "RideConnect UK passenger app home — book taxi, airport and cruise transfers",
  },
  {
    src: "/rideconnect/passenger/airport-gatwick.png",
    alt: "Book Dover to Gatwick airport transfer with fixed fare in the passenger app",
  },
  {
    src: "/rideconnect/passenger/airport-heathrow.png",
    alt: "Book Dover cruise terminal to Heathrow transfer in the passenger app",
  },
  {
    src: "/rideconnect/passenger/airport-picker.png",
    alt: "Choose Gatwick, Heathrow, Stansted or Luton in the RideConnect passenger app",
  },
] as const;
