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

export default function RideConnectHomePage() {
  const site = getRideConnectSite("rideconnect");

  return (
    <>
      <RcHero site={site} showCorporateCtas />
      <RcKentPlacesStrip />
      <RcTrustBar />
      <RcPopularTransfers />
      <AirportPricing />
      <RcPassengerApp />
      <RcWhyRideConnect />
      <RcSchoolTransport />
      <RcServices />
      <RcCoverageAreas />
      <RcVoiceBooking />
      <RcBookSection
        title="Book with RideConnect UK"
        description="Local taxis, airport transfers, cruise pickups and school transport — all in one booking form."
      />
    </>
  );
}
