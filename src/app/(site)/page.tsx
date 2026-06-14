import { AirportPricing } from "@/components/AirportPricing";
import { DestinationCards } from "@/components/DestinationCards";
import { DestinationSection } from "@/components/DestinationSection";
import { TownCards } from "@/components/TownCards";
import { TownHubSection } from "@/components/TownHubSection";
import { RcBookSection } from "@/components/rideconnect/RcBookSection";
import { RcHero } from "@/components/rideconnect/RcHero";
import { RcPassengerApp } from "@/components/rideconnect/RcPassengerApp";
import { RcSchoolTransport } from "@/components/rideconnect/RcSchoolTransport";
import { RcVoiceBooking } from "@/components/rideconnect/RcVoiceBooking";
import { RcWhyRideConnect } from "@/components/rideconnect/RcWhyRideConnect";
import { destinations } from "@/lib/destinations";
import { getRideConnectSite } from "@/lib/rideconnect/sites";
import { mainHub, pickupHubs } from "@/lib/towns";

export default function HomePage() {
  const site = getRideConnectSite("dovertaxi");

  return (
    <>
      <RcHero site={site} />

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
      <RcPassengerApp />
      <RcSchoolTransport />

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

      <RcWhyRideConnect />
      <RcVoiceBooking />
      <RcBookSection />
    </>
  );
}
