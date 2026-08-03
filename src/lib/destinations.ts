export type Destination = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  highlights: string[];
};

export const destinations: Destination[] = [
  {
    id: "airport",
    title: "Dover & Airport Transfers",
    subtitle: "Gatwick, Heathrow, Stansted and more",
    description:
      "Pre-booked airport transfers from Dover to all major UK airports and back. We allow time for traffic on the M20 and M25 and can coordinate around your flight time.",
    image: "/images/airport.jpg",
    imageAlt: "Taxi waiting for airport transfer pickup",
    highlights: [
      "Gatwick, Heathrow, Stansted & Luton",
      "Pickups from Dover, Deal, Folkestone & Ashford",
      "Space for luggage and group travel",
      "Add your flight number when booking",
    ],
  },
  {
    id: "ferry",
    title: "Ferry Port Transfers",
    subtitle: "Port of Dover & cross-Channel",
    description:
      "Reliable runs to and from the Port of Dover for foot passengers and drivers. We know ferry check-in times and terminal access for a stress-free connection.",
    image: "/images/ferry.jpg",
    imageAlt: "Taxi at Dover ferry port with ferry in background",
    highlights: [
      "Port of Dover Eastern & Western Docks",
      "DFDS & P&O ferry terminal drop-offs",
      "Connections to Eurotunnel at Folkestone",
      "Early-morning and late-night sailings",
    ],
  },
  {
    id: "cruise",
    title: "Cruise Terminal Transfers",
    subtitle: "Dover cruise port",
    description:
      "Meet-and-greet style pickups when your ship docks at Dover. We track your schedule and help with suitcases from the cruise terminal to your next destination.",
    image: "/images/cruise.jpg",
    imageAlt: "Taxi pickup at Dover cruise terminal",
    highlights: [
      "Dover Cruise Terminal 1 & 2",
      "Timed pickups aligned with disembarkation",
      "Airport Transfers to Canterbury or UK airports",
      "Minibuses available on request — add a note when booking",
    ],
  },
  {
    id: "stations",
    title: "Stations & Hospital Transfers",
    subtitle: "Dover Priory, Ashford & William Harvey",
    description:
      "Regular taxis to Dover Priory station, Ashford International, and hospitals across Kent including William Harvey in Ashford. We help with wheelchairs and walking aids when you mention them at booking.",
    image: "/images/station-hospital.jpg",
    imageAlt: "Taxi at railway station and hospital transfer pickup",
    highlights: [
      "Dover Priory & Ashford International",
      "William Harvey Hospital & Kent hospitals",
      "Patient appointments and discharge pickups",
      "Return journeys — book both legs in the notes",
    ],
  },
];
