import { AirportPricing } from "@/components/AirportPricing";
import { BookingForm } from "@/components/BookingForm";
import { DestinationCards } from "@/components/DestinationCards";
import { DestinationSection } from "@/components/DestinationSection";
import { TownCards } from "@/components/TownCards";
import { TownHubSection } from "@/components/TownHubSection";
import { BRAND_NAME } from "@/lib/brand";
import { primaryPhone, telHref } from "@/lib/contact";
import { destinations } from "@/lib/destinations";
import { mainHub, pickupHubs } from "@/lib/towns";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(/images/hero-dover.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="inline-flex rounded-full border border-brand-green/40 bg-brand-green/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-green">
              Based in Dover, Kent
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {BRAND_NAME} — Dover Taxis &amp; Airport Transfers
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Local service from our Dover base — port, cruise, town and station.
              Pre-booked airport transfers from Deal, Folkestone, Canterbury and
              Ashford — UK airports, Paris and beyond.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#book"
                className="rounded-full bg-brand-green px-6 py-3 font-semibold text-white shadow-lg hover:bg-brand-green-dark"
              >
                Book online
              </a>
              <a
                href={`tel:${telHref(primaryPhone)}`}
                className="rounded-full border border-white/25 px-6 py-3 font-medium text-white hover:border-brand-green hover:text-brand-green"
              >
                Or call {primaryPhone}
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur sm:p-8">
            <p className="text-sm font-medium uppercase tracking-wide text-brand-green">
              Dover — full local service
            </p>
            <ul className="mt-4 space-y-2 text-white/90">
              <li>
                <a href="#dover" className="font-medium hover:text-brand-green">
                  → Port, cruise, town &amp; Priory station
                </a>
              </li>
            </ul>
            <p className="mt-6 text-sm font-medium uppercase tracking-wide text-brand-green">
              Airport Transfers from
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/80">
              {pickupHubs.map((hub) => (
                <li key={hub.id}>
                  <a href={`#${hub.id}`} className="hover:text-brand-green">
                    → {hub.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-white/15 pt-4 text-sm text-white/70">
              Airports, ferry &amp; cruise —{" "}
              <a href="#services" className="text-brand-green hover:underline">
                see all transfer types
              </a>
            </p>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">
          Where are you travelling?
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Airport, ferry, cruise or station — choose your transfer type below.
        </p>
        <DestinationCards />
      </section>

      <section id="destinations" className="bg-cream">
        {destinations.map((destination, index) => (
          <DestinationSection
            key={destination.id}
            destination={destination}
            reverse={index % 2 === 1}
          />
        ))}
      </section>

      <AirportPricing />

      <section id="areas" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">
          Dover &amp; Pickup Hubs
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Full local taxis from Dover. Deal, Folkestone, Canterbury and Ashford are
          advance-booking pickup points for airport transfers and Paris trips only.
        </p>
        <TownCards />
      </section>

      <section id="towns" className="border-t border-navy/8 bg-white">
        <DestinationSection destination={mainHub} />
        <div className="border-t border-navy/8 bg-cream/50">
          <div className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-6">
            <h2 className="text-xl font-bold text-navy sm:text-2xl">
              Airport Transfer Pickup Hubs
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Airport Transfers to Heathrow, Gatwick, Stansted, Luton and Paris
              (Charles de Gaulle, Orly and city) — collected from these towns when
              pre-booked.
            </p>
          </div>
          {pickupHubs.map((town, index) => (
            <TownHubSection key={town.id} town={town} reverse={index % 2 === 1} />
          ))}
        </div>
      </section>

      <section id="book" className="bg-cream py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                Book online
              </h2>
              <p className="mt-3 text-muted">
                Local pickups in Dover. For Deal, Folkestone, Canterbury or Ashford,
                book airport transfers in advance — add your destination and flight
                details in the notes.
              </p>
              <p className="mt-4 rounded-xl border border-navy/8 bg-white p-4 text-sm text-muted">
                For airport, Paris, ferry or cruise trips, add your flight, destination
                or ship name in the notes so dispatch can plan your pickup time.
              </p>
            </div>
            <div className="rounded-2xl border border-navy/8 bg-white p-6 shadow-sm lg:col-span-3 sm:p-8">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
