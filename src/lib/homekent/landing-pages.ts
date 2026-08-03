export type HomeKentLandingPage = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  highlights: string[];
  sections: { heading?: string; paragraphs: string[] }[];
};

/** Money-keyword service landings for HomeKent local SEO. */
export const HOMEKENT_LANDING_PAGES: HomeKentLandingPage[] = [
  {
    slug: "regular-cleaning-dover",
    title: "Regular Cleaning Dover | HomeKent",
    h1: "Regular Cleaning in Dover & East Kent",
    description:
      "Weekly and fortnightly home cleaning in Dover, Deal, Sandwich and St Margaret's. Fully insured local cleaners — request a free quote.",
    highlights: ["Weekly or fortnightly", "Fully insured", "From £22/hr"],
    sections: [
      {
        paragraphs: [
          "HomeKent provides discreet regular cleaning for homes and flats across Dover and the surrounding East Kent coast.",
          "We work to a consistent checklist every visit — kitchens, bathrooms, floors and living spaces finished to a high standard.",
        ],
      },
      {
        heading: "Areas we cover",
        paragraphs: [
          "Dover, Deal, St Margaret's Bay, Kingsdown, Sandwich and nearby villages.",
          "Prefer a fixed day each week? Tell us your preferred schedule when you request a quote.",
        ],
      },
    ],
  },
  {
    slug: "deep-cleaning-dover",
    title: "Deep Cleaning Dover | HomeKent",
    h1: "Deep Cleaning in Dover & East Kent",
    description:
      "One-off deep cleans for homes and holiday lets in Dover, Deal and Sandwich. Top-to-bottom detail — from £180 for 1–2 bed properties.",
    highlights: ["Top-to-bottom", "1–2 bed from £180", "Holiday lets welcome"],
    sections: [
      {
        paragraphs: [
          "A HomeKent deep clean is ideal before guests arrive, after building work, or when a property needs a full reset.",
          "We detail bathrooms, kitchens, appliances, skirting and hard-to-reach areas that regular cleans may skip.",
        ],
      },
      {
        heading: "Guide prices",
        paragraphs: [
          "1–2 bed apartment or cottage: £180–£240.",
          "3 bed house: £240–£300. Larger coastal homes priced on survey.",
        ],
      },
    ],
  },
  {
    slug: "airbnb-cleaning-dover",
    title: "Airbnb Cleaning Dover | HomeKent",
    h1: "Airbnb Changeover Cleaning in Dover",
    description:
      "Guest-ready Airbnb and short-let changeovers in Dover, Deal and St Margaret's. Fast turnovers with five-star presentation.",
    highlights: ["Same-day turnovers", "From £55", "Linen options"],
    sections: [
      {
        paragraphs: [
          "Short-let hosts need reliable changeovers between guests. HomeKent resets bathrooms, kitchens, beds and surfaces so the next booking starts clean.",
          "We work around checkout and check-in windows along the Dover and Deal coast.",
        ],
      },
      {
        heading: "What is included",
        paragraphs: [
          "Full clean of living areas, bathrooms and kitchen; bed reset; bins and surfaces ready for guests.",
          "Optional linen wash and press available per bed.",
        ],
      },
    ],
  },
  {
    slug: "end-of-tenancy-cleaning-dover",
    title: "End of Tenancy Cleaning Dover | HomeKent",
    h1: "End of Tenancy Cleaning in Dover",
    description:
      "End of tenancy and move-out cleans in Dover and East Kent. Inventory-ready finish for landlords and tenants — from £240.",
    highlights: ["Inventory-ready", "From £240", "Landlord approved"],
    sections: [
      {
        paragraphs: [
          "Moving out of a rental in Dover or Deal? An end of tenancy clean helps you hand the property back in good condition.",
          "We focus on kitchens, ovens, bathrooms, floors and high-touch areas landlords and agents check first.",
        ],
      },
      {
        heading: "Book a move-out clean",
        paragraphs: [
          "Share your property size, checkout date and any inventory notes — we confirm a fixed guide price before we start.",
        ],
      },
    ],
  },
  {
    slug: "holiday-home-cleaning-kent",
    title: "Holiday Home Cleaning Kent | HomeKent",
    h1: "Holiday Home Cleaning in East Kent",
    description:
      "Coastal holiday home and second-home care in Dover, Deal and Kingsdown. Airing, dusting and full refreshes between stays.",
    highlights: ["Coastal specialists", "Between stays", "From £85/visit"],
    sections: [
      {
        paragraphs: [
          "Second homes on the Kent coast need regular attention between visits — damp air, dust and guest turnover all take a toll.",
          "HomeKent offers scheduled holiday-home care so your property stays aired, clean and ready when you arrive.",
        ],
      },
    ],
  },
];

export function getHomeKentLandingPage(slug: string) {
  return HOMEKENT_LANDING_PAGES.find((page) => page.slug === slug) ?? null;
}

export function getAllHomeKentLandingPages() {
  return HOMEKENT_LANDING_PAGES;
}
