import { KthCruiseHotelCards } from "@/components/kenttravelhub/KthCruiseHotelCards";
import { KthCruiseTerminalLive } from "@/components/kenttravelhub/KthCruiseTerminalLive";
import { KthEmailCapture } from "@/components/kenttravelhub/KthEmailCapture";
import {
  KTH_CRUISE_TAXI_RANK,
  KTH_CRUISE_TERMINAL_FAQS,
  KTH_CRUISE_TERMINAL_MAPS,
  KTH_CRUISE_TERMINAL_META,
  KTH_CRUISE_TERMINAL_NAV,
  KTH_CRUISE_TERMINAL_RESTAURANTS,
  KTH_CRUISE_TERMINALS,
  KTH_CRUISE_TRANSFERS,
} from "@/lib/kenttravelhub/cruise-terminal-guide";
import { KTH_CRUISE_HOTELS } from "@/lib/kenttravelhub/cruise-hotels";
import { KTH_POWERED_BY } from "@/lib/kenttravelhub/brand";
import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import { kthBreadcrumbJsonLd, kthFaqJsonLd } from "@/lib/kenttravelhub/seo";
import { primaryPhone, telHref } from "@/lib/contact";
import Link from "next/link";

function osmEmbed(lat: number, lng: number, zoom: number): string {
  const delta = 0.012 / (zoom / 14);
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function mapsLink(lat: number, lng: number, label: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(label)}`;
}

export async function KthCruiseTerminalGuidePage() {
  const home = await kthPath();
  const cruise = await kthPath("/cruise");
  const transferBook = await kthBookUrl({
    campaign: "cruise-terminal-guide",
    content: "transfers",
  });
  const news = await kthPath("/news");

  const transferLinks = await Promise.all(
    KTH_CRUISE_TRANSFERS.map(async (route) => ({
      route,
      taxiHref: await kthPath(`/taxi/${route.slug}`),
      guideHref: await kthPath(`/news/${route.guideSlug}`),
    })),
  );

  const breadcrumbLd = kthBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Cruise Terminal Guide", path: "/cruise-terminal" },
  ]);
  const faqLd = kthFaqJsonLd([...KTH_CRUISE_TERMINAL_FAQS]);

  const placeLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: "Dover Cruise Terminal",
    description: KTH_CRUISE_TERMINAL_META.description,
    touristType: "Cruise passengers",
    geo: {
      "@type": "GeoCoordinates",
      latitude: KTH_CRUISE_TERMINAL_MAPS.overview.lat,
      longitude: KTH_CRUISE_TERMINAL_MAPS.overview.lng,
    },
    containedInPlace: {
      "@type": "City",
      name: "Dover",
      addressRegion: "Kent",
      addressCountry: "GB",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeLd) }}
      />

      <section className="border-b border-kth-navy/8 bg-kth-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <Link
            href={home}
            className="text-sm font-semibold text-kth-gold hover:text-white"
          >
            ← Kent Travel Hub
          </Link>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-kth-gold">
            CT1 &amp; CT2 · Maps · Taxis · Hotels
          </p>
          <h1 className="mt-3 max-w-4xl font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {KTH_CRUISE_TERMINAL_META.h1}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/88">
            {KTH_CRUISE_TERMINAL_META.subhead}
          </p>
          <p className="mt-3 text-sm text-white/60">
            Updated {KTH_CRUISE_TERMINAL_META.updatedAt}
          </p>

          <nav
            aria-label="On this page"
            className="mt-8 flex flex-wrap gap-2"
          >
            {KTH_CRUISE_TERMINAL_NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <KthCruiseTerminalLive cruiseHref={cruise} />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {KTH_CRUISE_TERMINALS.map((terminal) => (
            <section
              key={terminal.id}
              id={terminal.id}
              className="scroll-mt-24 rounded-2xl border border-kth-navy/8 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-kth-sea">
                    {terminal.code}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-bold text-kth-navy">
                    {terminal.name}
                  </h2>
                  <p className="mt-1 text-sm text-kth-muted">{terminal.subtitle}</p>
                </div>
                <span className="rounded-full bg-kth-sand px-3 py-1 text-xs font-bold text-kth-navy">
                  {terminal.postcode}
                </span>
              </div>

              <p className="mt-5 leading-relaxed text-kth-muted">{terminal.usedBy}</p>

              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-bold text-kth-navy">Address</dt>
                  <dd className="mt-1 text-kth-muted">{terminal.address}</dd>
                </div>
                <div>
                  <dt className="font-bold text-kth-navy">Taxi &amp; pickup</dt>
                  <dd className="mt-1 text-kth-muted">{terminal.pickup}</dd>
                </div>
              </dl>

              <ul className="mt-6 space-y-2">
                {terminal.facilities.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-kth-muted before:font-bold before:text-kth-sea before:content-['✓']"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <ul className="mt-6 rounded-xl bg-kth-sand/70 p-4 text-sm text-kth-muted">
                {terminal.tips.map((tip) => (
                  <li key={tip} className="mt-2 first:mt-0">
                    • {tip}
                  </li>
                ))}
              </ul>

              <a
                href={mapsLink(terminal.lat, terminal.lng, terminal.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex text-sm font-semibold text-kth-sea hover:text-kth-navy"
              >
                Open {terminal.code} in Google Maps →
              </a>
            </section>
          ))}
        </div>

        <section id="maps" className="scroll-mt-24 mt-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-kth-sea">
            Terminal maps
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-kth-navy sm:text-3xl">
            Where are CT1 and CT2?
          </h2>
          <p className="mt-3 max-w-3xl text-kth-muted">
            Both terminals sit within the Port of Dover Western Docks complex. CT1
            extends along Admiralty Pier; CT2 is at the Western Docks cruise
            facility — a few minutes apart by road but different approach roads
            from the A20.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="overflow-hidden rounded-xl border border-kth-navy/8 bg-white shadow-sm lg:col-span-1">
              <div className="relative aspect-[4/3] bg-kth-sand">
                <iframe
                  title="Dover cruise terminals map"
                  src={osmEmbed(
                    KTH_CRUISE_TERMINAL_MAPS.overview.lat,
                    KTH_CRUISE_TERMINAL_MAPS.overview.lng,
                    KTH_CRUISE_TERMINAL_MAPS.overview.zoom,
                  )}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="font-semibold text-kth-navy">Port overview</p>
                <p className="mt-1 text-sm text-kth-muted">
                  CT1 (north pier) and CT2 (Western Docks) marked relative to Dover
                  town and the A20.
                </p>
              </div>
            </div>

            {KTH_CRUISE_TERMINALS.map((terminal) => (
              <div
                key={`map-${terminal.id}`}
                className="overflow-hidden rounded-xl border border-kth-navy/8 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-kth-sand">
                  <iframe
                    title={`${terminal.name} map`}
                    src={osmEmbed(terminal.lat, terminal.lng, 15)}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-kth-navy">
                    {terminal.code} — {terminal.name}
                  </p>
                  <p className="mt-1 text-sm text-kth-muted">{terminal.address}</p>
                  <a
                    href={mapsLink(terminal.lat, terminal.lng, terminal.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-sm font-semibold text-kth-sea hover:text-kth-navy"
                  >
                    Directions →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="taxi-rank"
          className="scroll-mt-24 mt-16 rounded-2xl border border-kth-navy/8 bg-kth-sand p-6 sm:p-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-kth-sea">
            Taxi rank &amp; pickups
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-kth-navy sm:text-3xl">
            Where to get a taxi at Dover Cruise Terminal
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-kth-muted">
            {KTH_CRUISE_TAXI_RANK.summary}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {KTH_CRUISE_TAXI_RANK.points.map((point) => (
              <article
                key={point.terminal}
                className="rounded-xl border border-kth-navy/8 bg-white p-5 shadow-sm"
              >
                <h3 className="font-serif text-lg font-bold text-kth-navy">
                  {point.terminal} pickup
                </h3>
                <p className="mt-2 text-sm font-semibold text-kth-sea">
                  {point.location}
                </p>
                <p className="mt-2 text-sm text-kth-muted">{point.notes}</p>
              </article>
            ))}
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {KTH_CRUISE_TAXI_RANK.tips.map((tip) => (
              <li
                key={tip}
                className="rounded-lg bg-white px-4 py-3 text-sm text-kth-muted"
              >
                {tip}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={transferBook}
              className="rounded-full bg-kth-navy px-7 py-3 text-sm font-bold text-white hover:bg-kth-navy-light"
            >
              Pre-book terminal pickup
            </Link>
            <Link
              href={await kthPath("/taxi/dover-cruise-taxi")}
              className="rounded-full border border-kth-navy/20 px-7 py-3 text-sm font-semibold text-kth-navy hover:bg-white"
            >
              Dover cruise taxi guide →
            </Link>
          </div>
        </section>

        <section id="hotels" className="scroll-mt-24 mt-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-kth-sea">
            Where to stay
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-kth-navy sm:text-3xl">
            Hotels near Dover Cruise Terminal
          </h2>
          <p className="mt-3 max-w-3xl text-kth-muted">
            Stay in Dover the night before embarkation or after disembarkation —
            most cruise passengers choose harbour-side or town-centre hotels a
            short taxi from CT1 and CT2.
          </p>

          <div className="mt-8">
            <KthCruiseHotelCards limit={4} />
          </div>

          <Link
            href={await kthPath("/stay#hotels")}
            className="mt-6 inline-flex text-sm font-semibold text-kth-sea hover:text-kth-navy"
          >
            All {KTH_CRUISE_HOTELS.length} cruise hotels with CT1 &amp; CT2 distances →
          </Link>
        </section>

        <section id="restaurants" className="scroll-mt-24 mt-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-kth-sea">
            Eat &amp; drink
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-kth-navy sm:text-3xl">
            Restaurants near the cruise terminal
          </h2>
          <p className="mt-3 max-w-3xl text-kth-muted">
            Where to eat before embarkation, after disembarkation or during a port
            day — all within a short taxi from CT1 and CT2.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {KTH_CRUISE_TERMINAL_RESTAURANTS.map((place) => (
              <article
                key={place.id}
                className="rounded-xl border border-kth-navy/8 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-serif text-lg font-bold text-kth-navy">
                    {place.name}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-kth-sea">
                    {place.type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-kth-muted">{place.area}</p>
                <p className="mt-3 text-sm leading-relaxed text-kth-muted">
                  {place.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="transfers"
          className="scroll-mt-24 mt-16 rounded-2xl border border-kth-navy/8 bg-white p-6 shadow-sm sm:p-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-kth-sea">
            Transfer booking
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-kth-navy sm:text-3xl">
            Book a transfer from Dover Cruise Terminal
          </h2>
          <p className="mt-3 max-w-3xl text-kth-muted">
            Pre-book licensed private hire with {KTH_POWERED_BY} — fixed guide
            fares, meet-and-greet at CT1 or CT2, and MPVs for families with
            luggage.
          </p>

          <div className="mt-8 overflow-x-auto rounded-xl border border-kth-navy/8">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-kth-sand text-xs font-bold uppercase tracking-wide text-kth-navy">
                <tr>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Typical time</th>
                  <th className="px-4 py-3">Car from</th>
                  <th className="px-4 py-3">MPV from</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-kth-navy/8">
                {transferLinks.map(({ route, guideHref }) => (
                  <tr key={route.id} className="text-kth-muted">
                    <td className="px-4 py-4 font-semibold text-kth-navy">
                      {route.label}
                    </td>
                    <td className="px-4 py-4">{route.time}</td>
                    <td className="px-4 py-4 font-bold text-kth-sea">
                      £{route.car}
                    </td>
                    <td className="px-4 py-4">
                      {route.mpv ? `£${route.mpv}` : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={guideHref}
                        className="font-semibold text-kth-sea hover:text-kth-navy"
                      >
                        Guide →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-xl bg-kth-navy p-6 text-white sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-kth-gold">
              {KTH_POWERED_BY}
            </p>
            <p className="mt-2 text-white/88">
              Book online — your driver monitors your ship and adjusts for delayed
              disembarkation. Tell us CT1 or CT2 and your cruise line when booking.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={transferBook}
                className="rounded-full bg-kth-gold px-7 py-3 text-sm font-bold text-kth-navy hover:bg-kth-gold-dark"
              >
                Book cruise terminal transfer
              </Link>
              <a
                href={`tel:${telHref(primaryPhone)}`}
                className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Call {primaryPhone}
              </a>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-xl">
            <KthEmailCapture source="cruise-terminal-guide" />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-2xl font-bold text-kth-navy">
            Frequently asked questions
          </h2>
          <dl className="mt-8 divide-y divide-kth-navy/8 rounded-xl border border-kth-navy/8 bg-white">
            {KTH_CRUISE_TERMINAL_FAQS.map((faq) => (
              <div key={faq.question} className="px-6 py-5">
                <dt className="font-semibold text-kth-navy">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-kth-muted">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-16 border-t border-kth-navy/8 pt-12">
          <h2 className="font-serif text-xl font-bold text-kth-navy">
            More Dover cruise guides
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3 text-sm">
            {[
              ["dover-cruise-parking-guide", "Parking guide"],
              ["dover-to-heathrow", "Dover to Heathrow"],
              ["dover-to-gatwick", "Dover to Gatwick"],
              ["canterbury-day-trip-from-dover", "Canterbury day trip"],
              ["white-cliffs-dover-visitor-guide", "White Cliffs"],
            ].map(([slug, label]) => (
              <li key={slug}>
                <Link
                  href={`${news}/${slug}`}
                  className="rounded-full border border-kth-navy/15 px-3 py-1.5 font-semibold text-kth-sea hover:border-kth-sea hover:text-kth-navy"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
