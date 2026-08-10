import type { RideConnectSiteConfig } from "@/lib/rideconnect/sites";
import { email, phones, primaryPhone, telHref } from "@/lib/contact";

const DEFAULT_SAME_AS = [
  "https://www.yell.com/biz/j-u-orion-transport-dover-taxi-and-airport-transfers-dover-10774442/",
  "https://www.google.com/maps/place/J.U.+Orion+Transport+%E2%80%93+Dover+Taxi+%26+Airport+Transfers/@51.1888713,1.2247614,17z",
];

/**
 * LocalBusiness + TaxiService JSON-LD for RideConnect network taxi brands.
 * Identity is per-site — do not force RideConnect UK / Dover Taxi onto every domain.
 */
export function localBusinessJsonLd(site?: RideConnectSiteConfig) {
  const baseUrl = site?.siteUrl.replace(/\/$/, "") ?? "https://dovertaxi.co.uk";
  const name = site?.schemaName ?? "Dover Taxi";
  const description =
    site?.seoDescription ??
    "Book a Dover taxi online — local trips, hospital, station, cruise port and airport transfers.";
  const alternateName = site?.schemaAlternateNames ?? ["RideConnect UK", "J.U. Orion Transport"];
  const areaNames = site?.schemaAreaServed?.length
    ? site.schemaAreaServed
    : ["Dover", "Kent"];
  const sameAs = Array.from(
    new Set([...(site?.schemaSameAs ?? []), ...(!site ? DEFAULT_SAME_AS : [])].filter(Boolean)),
  );
  const telephone = site?.schemaTelephone
    ? telHref(site.schemaTelephone)
    : telHref(primaryPhone);

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TaxiService"],
    "@id": `${baseUrl}/#localbusiness`,
    name,
    alternateName,
    description,
    url: baseUrl,
    telephone,
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
    areaServed: areaNames.map((city) =>
      city === "Kent"
        ? { "@type": "AdministrativeArea", name: city }
        : { "@type": "City", name: city },
    ),
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
    sameAs,
    priceRange: "££",
  };
}

/** Dover Taxi default SEO — used when host-specific metadata is not applied. */
export const SEO_TITLE = "Dover Taxi | Book Online — Fixed Fares & Airport Transfers";

export const SEO_DESCRIPTION =
  "Taxi Dover? Book a local Dover taxi online for town, port, station and airports. Fixed fares to Gatwick & Heathrow. Call 01304 350125.";

export const SEO_KEYWORDS = [
  "Dover taxi",
  "taxi Dover",
  "dover taxis",
  "book taxi Dover",
  "Dover taxi numbers",
  "local taxi Dover Kent",
  "Dover hospital taxi",
  "Dover Priory taxi",
  "RideConnect UK",
];
