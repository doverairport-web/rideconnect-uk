import { RcBookSection } from "@/components/rideconnect/RcBookSection";
import { RcGatwickFares } from "@/components/rideconnect/RcGatwickFares";
import { RcHero } from "@/components/rideconnect/RcHero";
import { RcPassengerApp } from "@/components/rideconnect/RcPassengerApp";
import { RcWhyRideConnect } from "@/components/rideconnect/RcWhyRideConnect";
import { getRideConnectSite } from "@/lib/rideconnect/sites";

export default function DoverToGatwickHomePage() {
  const site = getRideConnectSite("dovertogatwick");

  return (
    <>
      <RcHero site={site} />
      <RcGatwickFares />
      <RcPassengerApp />
      <RcWhyRideConnect />
      <RcBookSection
        title="Book East Kent airport transfers online"
        description="Pre-book from Dover, Deal, Sandwich, Folkestone or Canterbury — add pickup town, flight and cruise details in the notes."
      />
    </>
  );
}
