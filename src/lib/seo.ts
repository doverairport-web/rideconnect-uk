import { BRAND_NAME, SITE_URL } from "@/lib/brand";
import { email, phones, primaryPhone, telHref } from "@/lib/contact";

import { YELL_LISTING_URL } from "@/lib/directories";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/J.U.+Orion+Transport+%E2%80%93+Dover+Taxi+%26+Airport+Transfers/@51.1888713,1.2247614,17z";

export const SEO_TITLE = "Dover Taxi | Book Online — Local & Airport Transfers Kent";

export const SEO_DESCRIPTION =
  "Book a Dover taxi online — local trips, hospital, station, cruise port and airport transfers. Fixed fares to Gatwick and Heathrow. Call 01304 350125.";

export const SEO_KEYWORDS = [
  "Dover taxi",
  "taxi Dover",
  "book taxi Dover",
  "Dover taxi numbers",
  "local taxi Dover Kent",
  "Dover hospital taxi",
  "Dover Priory taxi",
  BRAND_NAME,
];

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TaxiService"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: "Dover Taxi — RideConnectUk",
    alternateName: [BRAND_NAME, "J.U. Orion Transport"],
    description: SEO_DESCRIPTION,
    url: SITE_URL,
    telephone: telHref(primaryPhone),
    email,
    image: `${SITE_URL}/rideconnect-logo.png`,
    logo: `${SITE_URL}/rideconnect-logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dover",
      addressRegion: "Kent",
      postalCode: "CT16",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.1888713,
      longitude: 1.2247614,
    },
    areaServed: [
      { "@type": "City", name: "Dover" },
      { "@type": "AdministrativeArea", name: "Kent" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    contactPoint: phones.map((phone) => ({
      "@type": "ContactPoint",
      telephone: telHref(phone),
      contactType: "bookings",
      areaServed: "GB",
    })),
    sameAs: [GOOGLE_MAPS_URL, YELL_LISTING_URL, "https://rideconnectuk.com"],
    priceRange: "££",
  };
}
