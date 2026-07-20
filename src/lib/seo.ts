import { BRAND_LEGAL } from "@/lib/brand";
import type { RideConnectSiteConfig } from "@/lib/rideconnect/sites";
import { email, phones, primaryPhone, telHref } from "@/lib/contact";
import { YELL_LISTING_URL } from "@/lib/directories";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/J.U.+Orion+Transport+%E2%80%93+Dover+Taxi+%26+Airport+Transfers/@51.1888713,1.2247614,17z";

export function localBusinessJsonLd(site?: RideConnectSiteConfig) {
  const baseUrl = site?.siteUrl.replace(/\/$/, "") ?? "https://dovertaxi.co.uk";
  const name = site?.schemaName ?? `${BRAND_LEGAL} — Dover Taxi`;
  const description =
    site?.seoDescription ??
    "Book a Dover taxi online — local trips, hospital, station, cruise port and airport transfers.";
  const alternateName = site?.schemaAlternateNames ?? ["RideConnect UK", "J.U. Orion Transport"];

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TaxiService"],
    "@id": `${baseUrl}/#localbusiness`,
    name,
    alternateName,
    description,
    url: baseUrl,
    telephone: telHref(primaryPhone),
    email,
    image: `${baseUrl}/rideconnect-logo.png`,
    logo: `${baseUrl}/rideconnect-logo.png`,
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

/** Dover Taxi default SEO — used when host-specific metadata is not applied. */
export const SEO_TITLE = "Dover Taxi | Book Online — Local & Airport Transfers Kent";

export const SEO_DESCRIPTION =
  "Book a Dover taxi online for local trips, cruise port and airport transfers. Fixed fares to Gatwick & Heathrow. Call 01304 350125.";

export const SEO_KEYWORDS = [
  "Dover taxi",
  "taxi Dover",
  "book taxi Dover",
  "Dover taxi numbers",
  "local taxi Dover Kent",
  "Dover hospital taxi",
  "Dover Priory taxi",
  "RideConnect UK",
];
