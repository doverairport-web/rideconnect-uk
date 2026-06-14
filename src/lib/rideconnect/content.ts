import { customerBookUrl, passengerWebUrl } from "@/lib/apps";

export const RC_SERVICES = [
  {
    id: "local",
    title: "Local Taxi",
    description: "Dover, Deal, Folkestone and Kent towns — hospital, station, port and town journeys.",
    href: `${customerBookUrl}?type=local`,
  },
  {
    id: "airport",
    title: "Airport Transfers",
    description: "Fixed fares to Gatwick, Heathrow, Stansted, Luton and London City from Dover and pickup hubs.",
    href: `${customerBookUrl}?type=airport`,
  },
  {
    id: "cruise",
    title: "Cruise Transfers",
    description: "Dover Cruise Terminal meet-and-greet — ship-to-airport and hotel connections.",
    href: `${customerBookUrl}?type=cruise`,
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
    href: "/contact",
  },
] as const;

export const RC_COVERAGE_AREAS = [
  { name: "Dover", description: "Full local taxi service — port, cruise, town and Priory station." },
  { name: "Deal", description: "Airport transfer pickup hub — Heathrow, Gatwick and Paris when pre-booked." },
  { name: "Folkestone", description: "Airport and cruise connections from Folkestone and Channel Tunnel." },
  { name: "Canterbury", description: "Pre-booked airport transfers and local private hire." },
  { name: "Ashford", description: "International station and airport transfer pickup point." },
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
] as const;

export const RC_DRIVER_BENEFITS = [
  "See jobs on your phone — accept trips in seconds",
  "Fair dispatch fees with transparent job details",
  "Built for Kent airport and cruise work",
  "Sign in via the RideConnect driver web app",
] as const;

export const RC_GATWICK_AIRPORTS = [
  { code: "gatwick", label: "Gatwick", highlight: true },
  { code: "heathrow", label: "Heathrow", highlight: true },
  { code: "stansted", label: "Stansted", highlight: false },
  { code: "luton", label: "Luton", highlight: false },
] as const;

export const RC_PASSENGER_APP_URL = passengerWebUrl;

export const RC_HERO_IMAGE = "/kenttravelhub/hero-dover.jpg";
