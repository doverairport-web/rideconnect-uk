export const HOMEKENT_SERVICES = [
  {
    id: "regular",
    title: "Regular Cleaning",
    description:
      "Discreet weekly or fortnightly visits for fine homes — every room finished to a consistently high standard.",
    icon: "broom",
  },
  {
    id: "deep",
    title: "Deep Cleaning",
    description:
      "Meticulous top-to-bottom cleans for larger properties, pre-arrival refreshes and seasonal resets.",
    icon: "spray",
  },
  {
    id: "airbnb",
    title: "Airbnb Changeovers",
    description:
      "Guest-ready turnovers for premium short lets — surfaces, bathrooms, kitchens and essentials reset flawlessly.",
    icon: "key",
  },
  {
    id: "holiday",
    title: "Holiday Home Care",
    description:
      "Ongoing care for coastal second homes and holiday lets — airing, dusting and presentation between stays.",
    icon: "palm",
  },
  {
    id: "checks",
    title: "Property Checks",
    description:
      "Scheduled visits to ensure your property is secure, ventilated and guest-ready while you are away.",
    icon: "clipboard",
  },
  {
    id: "keys",
    title: "Key Holding",
    description:
      "Secure, local key custody for cleaners, tradespeople and guests — discreet and dependable.",
    icon: "hand-key",
  },
] as const;

export const HOMEKENT_WHY_CHOOSE = [
  {
    title: "Local & Trusted",
    description:
      "Kent-based team serving Dover, Deal, St Margaret's Bay, Kingsdown and Sandwich — punctual, professional and easy to reach.",
  },
  {
    title: "High Standards",
    description:
      "Detail-focused cleaning for discerning homeowners — quality products and a checklist every visit.",
  },
  {
    title: "Fully Insured",
    description:
      "Public liability insurance on every job, giving you complete peace of mind.",
  },
  {
    title: "Flexible & Reliable",
    description:
      "Regular cleans, one-off deep cleans or full holiday-home schedules — arranged around you.",
  },
] as const;

export const HOMEKENT_TESTIMONIALS = [
  {
    quote:
      "Our coastal holiday let in Deal is always immaculate. Guests regularly mention how spotless the property is.",
    author: "Sarah",
    location: "Deal",
  },
  {
    quote:
      "Impeccable attention to detail. The fortnightly clean of our home has been invaluable — thoroughly recommended.",
    author: "James",
    location: "Dover",
  },
  {
    quote:
      "They manage our Airbnb changeovers flawlessly — fast, reliable and always five-star presentation.",
    author: "Emma",
    location: "St Margaret's",
  },
] as const;

/** Guide prices — entry rates shown online; final quote confirmed individually. */
export const HOMEKENT_PRICING_MAIN = [
  {
    id: "regular",
    title: "Regular Cleaning",
    from: "From £22/hr",
    note: "Weekly or fortnightly · homes & flats",
    market: "Experienced team · fully insured",
  },
  {
    id: "deep",
    title: "Deep Cleaning",
    from: "From £180",
    note: "One-off · 1–2 bed property",
    market: "Top-to-bottom · every room refreshed",
  },
  {
    id: "airbnb",
    title: "Airbnb Changeover",
    from: "From £55",
    note: "Per turnover · 1 bed flat",
    market: "Guest-ready · five-star standard",
  },
  {
    id: "holiday",
    title: "Holiday Home Care",
    from: "From £85",
    note: "Per visit · coastal & second homes",
    market: "Airing · dusting · full refresh",
  },
  {
    id: "checks",
    title: "Property Checks",
    from: "From £25",
    note: "Security walk-through & mail",
    market: "Ideal while you're away",
  },
  {
    id: "keys",
    title: "Key Holding",
    from: "From £25/mo",
    note: "Discreet local key custody",
    market: "Trades · guests · cleaners",
  },
] as const;

export const HOMEKENT_DEEP_CLEAN_SIZES = [
  { size: "1–2 bed apartment / cottage", price: "£180 – £240" },
  { size: "3 bed detached / town house", price: "£240 – £300" },
  { size: "4+ bed / large coastal property", price: "£300 – £380" },
] as const;

export const HOMEKENT_AIRBNB_PRICING = [
  { property: "1 bed, 1 bath (up to 2 guests)", price: "£55" },
  { property: "2 bed, 1 bath", price: "£62" },
  { property: "2 bed, 2 bath", price: "£75" },
  { property: "3 bed, 2 bath", price: "£88" },
] as const;

export const HOMEKENT_EXTRA_SERVICES = [
  { service: "End of tenancy clean", price: "From £240" },
  { service: "Oven & appliance detail", price: "From £45" },
  { service: "Linen wash & press (per bed)", price: "From £10" },
  { service: "Same-day / priority booking", price: "From £20 surcharge" },
] as const;

export const QUOTE_SERVICE_OPTIONS = [
  "Regular Cleaning",
  "Deep Cleaning",
  "Airbnb Changeover",
  "Holiday Home Care",
  "Property Checks",
  "Key Holding",
  "Other / Not sure",
] as const;
