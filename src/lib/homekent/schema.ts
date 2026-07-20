import {
  HOMEKENT_AREAS,
  HOMEKENT_EMAIL,
  HOMEKENT_NAME,
  HOMEKENT_PHONE,
  HOMEKENT_SEO_LINE,
  HOMEKENT_SITE_URL,
  homekentTelHref,
} from "@/lib/homekent/brand";

/** LocalBusiness + HomeAndConstructionBusiness schema for Google rich results. */
export function homekentLocalBusinessJsonLd() {
  const base = HOMEKENT_SITE_URL.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${base}/#localbusiness`,
    name: HOMEKENT_NAME,
    description: HOMEKENT_SEO_LINE,
    url: base,
    telephone: homekentTelHref(HOMEKENT_PHONE),
    email: HOMEKENT_EMAIL,
    image: `${base}/homekent/before-after.png`,
    logo: `${base}/homekent/before-after.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dover",
      addressRegion: "Kent",
      addressCountry: "GB",
    },
    areaServed: HOMEKENT_AREAS.split(",").map((name) => ({
      "@type": "City",
      name: name.replace(/\band surrounding areas\b/i, "").trim(),
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "18:00",
    },
    priceRange: "££",
    knowsAbout: [
      "Regular cleaning",
      "Deep cleaning",
      "Airbnb changeovers",
      "Holiday home care",
      "End of tenancy cleaning",
    ],
  };
}
