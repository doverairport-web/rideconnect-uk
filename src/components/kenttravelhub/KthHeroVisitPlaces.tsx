import { KTH_EXPLORE_GRID } from "@/lib/kenttravelhub/content";
import Image from "next/image";
import Link from "next/link";

export function KthHeroVisitPlaces() {
  return (
    <div id="visit" className="scroll-mt-24">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-kth-navy/70">
        Visit Kent
      </p>
      <p className="mt-1 text-sm font-semibold text-kth-navy">
        Top sights near Dover
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {KTH_EXPLORE_GRID.map((place) => (
          <Link
            key={place.id}
            href={place.external}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-kth-navy/10 shadow-sm"
          >
            <Image
              src={place.image}
              alt={place.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kth-navy/90 via-kth-navy/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-xs font-bold leading-snug text-white">{place.title}</p>
              <p className="mt-0.5 text-[10px] font-medium text-white/75">
                {place.linkLabel} →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
