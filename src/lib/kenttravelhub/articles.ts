import { KTH_SEO_ARTICLES } from "@/lib/kenttravelhub/articles-seo";

export type KthArticleFaq = {
  question: string;
  answer: string;
};

export type KthArticleSection = {
  heading?: string;
  paragraphs: string[];
};

export type KthArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readMinutes: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  relatedSlugs: string[];
  sections: KthArticleSection[];
  tips: string[];
  faqs?: KthArticleFaq[];
};

export const KTH_ARTICLES: KthArticle[] = [
  {
    slug: "dover-port-waiting-times",
    title: "Current waiting times at Dover Port",
    excerpt:
      "Live queues at the Eastern Docks, Western Docks and check-in — what to expect before you travel.",
    category: "Port",
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-12",
    readMinutes: 5,
    keywords: [
      "Dover port waiting times",
      "Dover ferry queue",
      "Dover Eastern Docks",
      "DFDS Dover check-in",
      "P&O Dover delays",
    ],
    relatedSlugs: [
      "dover-ferry-dfds-po-updates",
      "m20-traffic-today",
      "operation-brock-kent",
    ],
    sections: [
      {
        paragraphs: [
          "Dover is one of Europe's busiest ferry gateways. Queues change quickly with sailings, freight peaks, weather and school holidays — so checking before you leave saves stress at the port.",
          "Most car passengers use the Eastern Docks (DFDS and P&O to Calais/Dunkirk) or Western Docks for some services. Allow time for ticket checks, passport control and loading lanes — not just the drive to the port.",
        ],
      },
      {
        heading: "Typical waiting times",
        paragraphs: [
          "Off-peak weekdays: often 10–20 minutes from joining the port approach to check-in.",
          "Morning peaks (roughly 06:00–11:00): 30–60 minutes is common in busy periods.",
          "Fridays, bank holidays and Operation Brock days: 45–90+ minutes is possible — plan a buffer.",
        ],
      },
      {
        heading: "How to avoid the worst queues",
        paragraphs: [
          "Book a ferry with a defined departure slot and arrive inside the window your operator gives you — not hours early unless advised.",
          "Check DFDS and P&O live updates on the day. Disruption on one operator can push traffic across the whole port area.",
          "If roads are slow on the M20 or A20, your port arrival time shifts — monitor M20 conditions before you leave home.",
          "Pre-book a taxi or transfer with a fixed pickup time if you are connecting from a train, cruise ship or airport.",
        ],
      },
    ],
    tips: [
      "Use operator apps for live sailing status.",
      "Keep fuel and snacks in the car during peak weekends.",
      "Have passports and booking references ready before the booth.",
    ],
    faqs: [
      {
        question: "How long are Dover port queues today?",
        answer:
          "Off-peak weekdays are often 10–20 minutes at check-in; morning peaks and bank holidays can reach 45–90 minutes. Check live status on Kent Travel Hub before you travel.",
      },
      {
        question: "Which Dover docks do DFDS and P&O use?",
        answer:
          "Most car ferries to Calais and Dunkirk use Dover Eastern Docks. Always follow your booking confirmation for the correct terminal.",
      },
    ],
  },
  {
    slug: "dover-cruise-terminal-heathrow",
    title: "Best way from Dover Cruise Terminal to Heathrow",
    excerpt:
      "Compare taxi, train and coach options — timings, luggage and pre-booking tips for cruise passengers.",
    category: "Cruise",
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-12",
    readMinutes: 7,
    keywords: [
      "Dover cruise terminal to Heathrow",
      "Dover cruise taxi Heathrow",
      "cruise ship Dover airport transfer",
      "Heathrow from Dover cruise",
    ],
    relatedSlugs: [
      "dover-to-heathrow",
      "heathrow-to-dover",
      "dover-cruise-terminal-guide",
      "gatwick-to-dover-travel-guide",
      "dover-to-london",
    ],
    sections: [
      {
        paragraphs: [
          "Cruise passengers arriving at Dover Cruise Terminal often need a reliable connection to Heathrow the same day. With luggage, tight flight times and variable disembarkation, the right choice depends on your schedule — not just the cheapest fare.",
        ],
      },
      {
        heading: "Private taxi or pre-booked transfer",
        paragraphs: [
          "Door-to-door from the cruise terminal to any Heathrow terminal typically takes around 1 hour 45 minutes to 2 hours 15 minutes in normal traffic.",
          "Best when: you have heavy luggage, a group, an early flight or you want a fixed pickup at the terminal.",
          "Pre-booking avoids competing for rank taxis when several ships disembark at once.",
        ],
      },
      {
        heading: "Train via London",
        paragraphs: [
          "Dover Priory to London St Pancras takes about 1 hour on high-speed services, then Tube or Elizabeth line connections to Heathrow.",
          "Best when: you travel light, have 4+ hours between disembarkation and flight, and want to avoid road delays.",
          "Not ideal with large suitcases at peak commuter times.",
        ],
      },
      {
        heading: "Coach",
        paragraphs: [
          "National Express and other operators run services from Dover area towards London airports, but timetables may not align with cruise arrival waves.",
          "Check the day's schedule carefully — cruise days can sell out faster.",
        ],
      },
    ],
    tips: [
      "Allow at least 3 hours between scheduled disembarkation and flight check-in for road transfers.",
      "Tell your driver your ship name and terminal (CT1/CT2).",
      "Heathrow terminals are spread out — confirm T2/T3/T4/T5 on booking.",
    ],
    faqs: [
      {
        question: "How long from Dover Cruise Terminal to Heathrow?",
        answer:
          "A pre-booked taxi or transfer typically takes 1 hour 45 minutes to 2 hours 15 minutes depending on M25 and M20 traffic.",
      },
      {
        question: "Is the train faster than a taxi from Dover cruise to Heathrow?",
        answer:
          "The train can be quicker to central London if you travel light and have a long connection window, but with luggage and tight flight times a door-to-door transfer is usually simpler.",
      },
    ],
  },
  {
    slug: "m20-traffic-today",
    title: "Traffic update M20 today",
    excerpt:
      "Junction 8 to 13 conditions, Operation Brock status and the fastest route into Dover.",
    category: "Traffic",
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-12",
    readMinutes: 6,
    keywords: [
      "M20 traffic today",
      "M20 Dover delays",
      "Operation Brock M20",
      "M20 junction 8 to 13",
      "traffic Dover Kent",
    ],
    relatedSlugs: [
      "operation-brock-kent",
      "dover-port-waiting-times",
      "dover-ferry-dfds-po-updates",
    ],
    sections: [
      {
        paragraphs: [
          "The M20 is the main motorway link from London and the M25 to Folkestone, Ashford and Dover. Junction 8 (Maidstone South) through to Junction 13 (Folkestone) is where most holiday and port traffic concentrates.",
          "When cross-Channel services are busy, Operation Brock can move HGV traffic onto a contraflow — affecting car journeys too.",
        ],
      },
      {
        heading: "What to watch today",
        paragraphs: [
          "Coastbound delays often build from late morning through early evening on Fridays and school holidays.",
          "Incidents near Junction 9 (Ashford) can queue traffic back to the M25.",
          "If Brock is active, follow overhead signs — local shortcuts through villages are enforced.",
        ],
      },
      {
        heading: "Faster alternatives when the M20 is slow",
        paragraphs: [
          "A20 through Ashford and Folkestone can be quicker in some incidents — but may itself be busy on port days.",
          "Allow extra time rather than cutting it fine for ferries, Eurotunnel or cruise pickups.",
          "A pre-booked taxi can monitor your ETA and adjust pickup if your road choice changes.",
        ],
      },
    ],
    tips: [
      "Check live M20 status on Kent Travel Hub before leaving.",
      "Sat-nav 'fastest route' may send you into Brock contraflow — watch signs.",
      "Fuel up before Junction 8 on busy bank holidays.",
    ],
    faqs: [
      {
        question: "Which M20 junctions matter for Dover?",
        answer:
          "Junction 8 (Maidstone South) through Junction 13 (Folkestone) carry most port and Channel Tunnel traffic heading to Dover.",
      },
      {
        question: "Does Operation Brock affect cars on the M20?",
        answer:
          "Brock is primarily for freight queuing, but contraflow and port traffic can still slow car journeys — follow overhead signs on travel day.",
      },
    ],
  },
  {
    slug: "dover-to-london",
    title: "How to travel from Dover to London",
    excerpt:
      "Trains, coaches and private hire compared — costs, journey times and when a taxi makes sense.",
    category: "Guides",
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-12",
    readMinutes: 6,
    keywords: [
      "Dover to London",
      "train Dover to London",
      "Dover London taxi",
      "how to get from Dover to London",
    ],
    relatedSlugs: [
      "dover-cruise-terminal-heathrow",
      "gatwick-to-dover-travel-guide",
      "canterbury-day-trip-from-dover",
    ],
    sections: [
      {
        paragraphs: [
          "Dover to central London is a common journey for cruise passengers, ferry travellers and day visitors. The best option depends on where in London you are heading, how much luggage you carry and whether you need a fixed door-to-door time.",
        ],
      },
      {
        heading: "Train — usually fastest to central London",
        paragraphs: [
          "Southeastern high-speed services from Dover Priory reach London St Pancras in about 1 hour.",
          "From St Pancras you can connect to the Tube, Thameslink or taxis to your final address.",
          "Off-peak advance tickets are often the best value for solo travellers with light bags.",
        ],
      },
      {
        heading: "Coach",
        paragraphs: [
          "National Express runs Dover to London Victoria — budget-friendly but slower than the train and less flexible for port or cruise terminal pickups.",
        ],
      },
      {
        heading: "Taxi or private hire",
        paragraphs: [
          "Door-to-door to central London takes roughly 1 hour 45 minutes to 2 hours 30 minutes depending on traffic and destination.",
          "Worth it for families, groups splitting the fare, heavy luggage or late-night arrivals when trains are sparse.",
          "Fixed pre-booked fares from Dover district operators avoid surge pricing on busy cruise days.",
        ],
      },
    ],
    tips: [
      "Book trains ahead on summer Saturdays.",
      "Cruise terminal to Priory station needs a short taxi if you are not walking.",
      "For Heathrow or Gatwick from Dover, use airport-specific transfer guides.",
    ],
    faqs: [
      {
        question: "What is the fastest way from Dover to London?",
        answer:
          "Southeastern high-speed trains from Dover Priory to London St Pancras take about 1 hour and are usually fastest for solo travellers with light luggage.",
      },
      {
        question: "How much is a taxi from Dover to London?",
        answer:
          "Pre-booked private hire to central London is typically 1 hour 45 minutes to 2 hours 30 minutes on the road; guide fares vary by operator and vehicle size.",
      },
    ],
  },
  ...KTH_SEO_ARTICLES,
] as KthArticle[];

/** Slugs that permanently redirect to a stronger URL — keep for related links, exclude from sitemap. */
export const KTH_REDIRECTED_ARTICLE_SLUGS = new Set<string>([
  "dover-cruise-terminal-guide", // → /cruise-terminal
]);

export function getKthArticle(slug: string): KthArticle | undefined {
  return KTH_ARTICLES.find((article) => article.slug === slug);
}

export function getAllKthArticles(): KthArticle[] {
  return KTH_ARTICLES;
}

/** Articles that should appear in sitemap / be treated as indexable destinations. */
export function getIndexableKthArticles(): KthArticle[] {
  return KTH_ARTICLES.filter((article) => !KTH_REDIRECTED_ARTICLE_SLUGS.has(article.slug));
}

export function isKthArticleRedirected(slug: string): boolean {
  return KTH_REDIRECTED_ARTICLE_SLUGS.has(slug);
}
