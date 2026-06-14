import { KTH_DOVER_RESTAURANTS, KTH_LOCAL_ADVERTISE } from "@/lib/kenttravelhub/content";
import { KthDoverRestaurantLinks } from "@/components/kenttravelhub/KthDoverRestaurantLinks";
import { resolveDoverRestaurantLinks } from "@/lib/kenttravelhub/resolve-hub-links";

export async function KthEatKent() {
  const places = await resolveDoverRestaurantLinks();

  return (
    <div id="restaurants" className="mt-14 scroll-mt-24 border-t border-kth-navy/10 pt-14">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-kth-sea">
        Eat &amp; drink
      </p>
      <h3 className="mt-2 text-2xl font-extrabold text-kth-navy sm:text-3xl">
        Restaurants within 5 miles of Dover
      </h3>
      <p className="mt-3 max-w-2xl text-sm text-kth-muted">
        {KTH_DOVER_RESTAURANTS.length} places near the port, seafront, cliffs and Deal —
        click for the restaurant website or Google Maps.
      </p>

      <div className="mt-8">
        <KthDoverRestaurantLinks places={places} />
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-kth-sea/40 bg-white p-6 text-center">
        <p className="text-lg font-extrabold text-kth-navy">{KTH_LOCAL_ADVERTISE.title}</p>
        <p className="mx-auto mt-2 max-w-lg text-sm text-kth-muted">
          {KTH_LOCAL_ADVERTISE.description}
        </p>
        <a
          href={`mailto:${KTH_LOCAL_ADVERTISE.email}?subject=Kent%20Travel%20Hub%20restaurant%20listing`}
          className="mt-4 inline-flex text-sm font-semibold text-kth-sea hover:text-kth-navy"
        >
          List your restaurant →
        </a>
      </div>
    </div>
  );
}
