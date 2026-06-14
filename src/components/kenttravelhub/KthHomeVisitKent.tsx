import { KTH_EXPLORE_GRID } from "@/lib/kenttravelhub/content";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Image from "next/image";
import Link from "next/link";

export async function KthHomeVisitKent() {
  const visit = await kthPath("/visit");

  return (
    <section id="visit" className="scroll-mt-24 border-b border-kth-navy/8 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
              Visit Kent
            </h2>
            <p className="mt-1 max-w-xl text-sm text-kth-muted">
              Castles, coastline and cathedral towns — official links from Dover
              port and cruise terminal.
            </p>
          </div>
          <Link
            href={visit}
            className="text-xs font-bold text-kth-sea hover:text-kth-navy"
          >
            All places to see →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {KTH_EXPLORE_GRID.map((place) => (
            <div key={place.id} className="min-w-0">
              <Link
                href={place.external}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-[4/3] overflow-hidden rounded-xl border border-kth-navy/10 shadow-sm"
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
                  <p className="text-xs font-bold leading-snug text-white">
                    {place.title}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-white/75">
                    {place.linkLabel} →
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
