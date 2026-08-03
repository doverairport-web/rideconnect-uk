import { AirportPricing } from "@/components/AirportPricing";
import { RcBookSection } from "@/components/rideconnect/RcBookSection";
import { RcCoverageAreas } from "@/components/rideconnect/RcCoverageAreas";
import { RcHero } from "@/components/rideconnect/RcHero";
import { RcKentPlacesStrip } from "@/components/rideconnect/RcKentPlacesStrip";
import { RcPassengerApp } from "@/components/rideconnect/RcPassengerApp";
import { RcPopularTransfers } from "@/components/rideconnect/RcPopularTransfers";
import { RcSchoolTransport } from "@/components/rideconnect/RcSchoolTransport";
import { RcServices } from "@/components/rideconnect/RcServices";
import { RcTrustBar } from "@/components/rideconnect/RcTrustBar";
import { RcVoiceBooking } from "@/components/rideconnect/RcVoiceBooking";
import { RcWhyRideConnect } from "@/components/rideconnect/RcWhyRideConnect";
import { getRideConnectSite } from "@/lib/rideconnect/sites";

/** Same layout + booking form as rideconnectuk.com — Orion-specific copy from site config. */
export default function OrionHomePage() {
  const site = getRideConnectSite("oriontaxis");

  return (
    <>
      <RcHero site={site} showCorporateCtas />
      <RcKentPlacesStrip />
      <RcTrustBar />
      <RcPopularTransfers
        title="Popular Orion taxi transfers"
        description="Airport, cruise, Deal and corporate staff transfers — book online with RideConnect UK."
      />
      <AirportPricing />
      <RcPassengerApp />
      <RcWhyRideConnect />
      <RcSchoolTransport />
      <RcServices />
      <RcCoverageAreas />
      <RcVoiceBooking />
      <RcBookSection
        title={`Book with ${site.brandTitle}`}
        description="Local taxis, airport transfers, cruise pickups and school transport — all in one booking form."
      />
    </>
  );
}
