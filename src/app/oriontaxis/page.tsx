import { AirportPricing } from "@/components/AirportPricing";
import { RcBookSection } from "@/components/rideconnect/RcBookSection";
import { RcCoverageAreas } from "@/components/rideconnect/RcCoverageAreas";
import { RcHero } from "@/components/rideconnect/RcHero";
import { RcPassengerApp } from "@/components/rideconnect/RcPassengerApp";
import { RcSchoolTransport } from "@/components/rideconnect/RcSchoolTransport";
import { RcServices } from "@/components/rideconnect/RcServices";
import { RcWhyRideConnect } from "@/components/rideconnect/RcWhyRideConnect";
import { getRideConnectSite } from "@/lib/rideconnect/sites";

export default function OrionHomePage() {
  const site = getRideConnectSite("oriontaxis");

  return (
    <>
      <RcHero site={site} />
      <RcServices />
      <RcPassengerApp />
      <RcCoverageAreas />
      <RcSchoolTransport />
      <AirportPricing />
      <RcWhyRideConnect />
      <RcBookSection />
    </>
  );
}
