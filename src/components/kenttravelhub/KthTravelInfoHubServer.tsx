import { KthTravelInfoHubClient } from "@/components/kenttravelhub/KthTravelInfoHub";
import {
  resolveDoverHotelLinks,
  resolveDoverRestaurantLinks,
  resolveHubSections,
  resolveVisitLinks,
} from "@/lib/kenttravelhub/resolve-hub-links";

export async function KthTravelInfoHub() {
  const [sections, visitLinks, doverHotels, doverRestaurants] = await Promise.all([
    resolveHubSections(),
    resolveVisitLinks(),
    resolveDoverHotelLinks(),
    resolveDoverRestaurantLinks(),
  ]);

  return (
    <KthTravelInfoHubClient
      sections={sections}
      visitLinks={visitLinks}
      doverHotels={doverHotels}
      doverRestaurants={doverRestaurants}
    />
  );
}
