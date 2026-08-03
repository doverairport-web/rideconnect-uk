import type { Destination } from "@/lib/destinations";

export type Town = Destination & {
  /** Full local hub (Dover) vs airport-transfer pickup point only */
  isMainHub: boolean;
};

export const towns: Town[] = [
  {
    id: "dover",
    isMainHub: true,
    title: "Dover",
    subtitle: "Our home base — Port, Town & Coast",
    description:
      "Dover is where we are based. Local taxis across town, the Western Heights, ferry and cruise terminals, Dover Priory station, the White Cliffs area, and fast links along the A2. We also run airport transfers and Paris trips from nearby pickup hubs when pre-booked.",
    image: "/images/dover.jpg",
    imageAlt: "White Cliffs and harbour at Dover, Kent",
    highlights: [
      "Dover town centre, seafront & castle area",
      "Port of Dover — ferry, cruise & foot passenger terminals",
      "Dover Priory station",
      "Airport Transfers & local runs across East Kent",
    ],
  },
  {
    id: "deal",
    isMainHub: false,
    title: "Deal",
    subtitle: "Airport Transfers from Deal",
    description:
      "Pre-booked airport transfers collected in Deal — to UK airports, Paris and other long-distance destinations. Not for general local sightseeing — use Dover for full local service.",
    image: "/images/deal.jpg",
    imageAlt: "Deal seafront and pier, Kent",
    highlights: [
      "Airport Transfers — Heathrow, Gatwick, Stansted, Luton",
      "Paris Airport Transfers — CDG, Orly & city",
      "Other long-distance UK & cross-Channel trips",
      "Advance booking recommended",
    ],
  },
  {
    id: "folkestone",
    isMainHub: false,
    title: "Folkestone",
    subtitle: "Airport Transfers from Folkestone",
    description:
      "Airport transfer pickups in Folkestone — ideal near Folkestone Central, the harbour or the Eurotunnel approach at Cheriton. UK airports, Paris and longer pre-booked journeys.",
    image: "/images/folkestone.jpg",
    imageAlt: "Folkestone harbour and coast, Kent",
    highlights: [
      "Airport Transfers — Heathrow, Gatwick, Stansted, Luton",
      "Paris Airport Transfers — CDG, Orly & city",
      "Eurotunnel terminal area pickups on request",
      "M20 corridor for fast airport routes",
    ],
  },
  {
    id: "canterbury",
    isMainHub: false,
    title: "Canterbury",
    subtitle: "Airport Transfers from Canterbury",
    description:
      "Pre-booked airport transfers from Canterbury to UK airports, Paris and other major destinations. Not for general local taxi tours — our full local service is based in Dover.",
    image: "/images/canterbury.jpg",
    imageAlt: "Canterbury Cathedral and historic city, Kent",
    highlights: [
      "Airport Transfers — Heathrow, Gatwick, Stansted, Luton",
      "Paris Airport Transfers — CDG, Orly & city",
      "Long-distance UK journeys beyond East Kent",
      "Station or agreed pickup — book in advance",
    ],
  },
  {
    id: "ashford",
    isMainHub: false,
    title: "Ashford",
    subtitle: "Airport Transfers from Ashford",
    description:
      "Airport transfer pickups from Ashford International, town centre or an agreed address. Convenient on the M20 for UK airports, Paris and cross-Channel routes.",
    image: "/images/ashford.jpg",
    imageAlt: "Ashford town and station area, Kent",
    highlights: [
      "Airport Transfers — Heathrow, Gatwick, Stansted, Luton",
      "Paris Airport Transfers — CDG, Orly & city",
      "Ashford International station pickups",
      "Fast M20 link towards Dover and the Channel",
    ],
  },
];

export const mainHub = towns.find((t) => t.isMainHub)!;
export const pickupHubs = towns.filter((t) => !t.isMainHub);
