import { RcBookSection } from "@/components/rideconnect/RcBookSection";
import { RcCoverageAreas } from "@/components/rideconnect/RcCoverageAreas";
import { RcHero } from "@/components/rideconnect/RcHero";
import { RcPassengerApp } from "@/components/rideconnect/RcPassengerApp";
import { RcSchoolTransport } from "@/components/rideconnect/RcSchoolTransport";
import { RcServices } from "@/components/rideconnect/RcServices";
import { RcVoiceBooking } from "@/components/rideconnect/RcVoiceBooking";
import { RcWhyRideConnect } from "@/components/rideconnect/RcWhyRideConnect";
import { getRideConnectSite } from "@/lib/rideconnect/sites";

export default function RideConnectHomePage() {
  const site = getRideConnectSite("rideconnect");

  return (
    <>
      <RcHero site={site} showCorporateCtas />
      <RcServices />
      <RcPassengerApp />
      <RcCoverageAreas />
      <RcSchoolTransport />
      <RcWhyRideConnect />
      <RcVoiceBooking />
      <RcBookSection
        title="Book with RideConnect UK"
        description="Local taxis, airport transfers, cruise pickups and school transport — all in one booking form."
      />
    </>
  );
}
