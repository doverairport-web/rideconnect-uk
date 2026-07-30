import { RcBookSection } from "@/components/rideconnect/RcBookSection";
import { RcGatwickFares } from "@/components/rideconnect/RcGatwickFares";
import { RcGatwickPopularTransfers } from "@/components/rideconnect/RcGatwickPopularTransfers";
import { RcGatwickSeoContent } from "@/components/rideconnect/RcGatwickSeoContent";
import { RcHero } from "@/components/rideconnect/RcHero";
import { RcKentPlacesStrip } from "@/components/rideconnect/RcKentPlacesStrip";
import { RcPassengerApp } from "@/components/rideconnect/RcPassengerApp";
import { RcTrustBar } from "@/components/rideconnect/RcTrustBar";
import { RcWhyRideConnect } from "@/components/rideconnect/RcWhyRideConnect";
import { getRideConnectSite } from "@/lib/rideconnect/sites";

export default function DoverToGatwickHomePage() {
  const site = getRideConnectSite("dovertogatwick");

  return (
    <>
      <RcHero site={site} />
      <RcKentPlacesStrip
        variant="gatwick"
        title="From the White Cliffs to Gatwick"
        subtitle="Real East Kent pickups — Dover, Deal, Canterbury and the coast — then a direct run to Gatwick North or South."
      />
      <RcTrustBar />
      <RcGatwickPopularTransfers />
      <RcGatwickFares />
      <RcGatwickSeoContent />
      <RcPassengerApp />
      <RcWhyRideConnect />
      <RcBookSection
        title="Book your Dover to Gatwick taxi online"
        description="Pre-book from Dover, Deal, Sandwich, Folkestone or Canterbury — add pickup town, flight number and cruise details in the notes."
      />
    </>
  );
}
