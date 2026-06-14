import type { ResolvedDoverRestaurant } from "@/lib/kenttravelhub/resolve-hub-links";

type Props = {
  places: ResolvedDoverRestaurant[];
  compact?: boolean;
};

export function KthDoverRestaurantLinks({ places, compact = false }: Props) {
  return (
    <ul className={compact ? "space-y-2" : "space-y-2.5"}>
      {places.map((place) => (
        <li key={place.id}>
          <a
            href={place.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center gap-3 rounded-xl border border-kth-navy/8 bg-white transition hover:border-kth-sea/35 hover:shadow-sm active:scale-[0.99] ${
              compact ? "px-3 py-2.5" : "px-4 py-3"
            }`}
          >
            <div className="min-w-0 flex-1">
              <p
                className={`font-bold text-kth-navy group-hover:text-kth-sea ${
                  compact ? "text-sm" : "text-sm sm:text-base"
                }`}
              >
                {place.label}
              </p>
              <p className="mt-0.5 text-[11px] text-kth-muted">{place.subtitle}</p>
            </div>
            <span className="shrink-0 rounded-full bg-kth-sand px-2 py-0.5 text-[10px] font-bold uppercase text-kth-sea">
              {place.type}
            </span>
            <span className="shrink-0 text-kth-sea" aria-hidden>
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
