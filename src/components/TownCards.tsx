import Image from "next/image";
import Link from "next/link";
import { mainHub, pickupHubs } from "@/lib/towns";
import { TOWN_TAXI_LANDING_BY_ID } from "@/lib/rideconnect/transfer-pages";

export function TownCards() {
  return (
    <div className="mt-10 space-y-6">
      <Link
        href={`#${mainHub.id}`}
        className="group flex overflow-hidden rounded-2xl border border-navy/8 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row"
      >
        <div className="relative aspect-[16/9] w-full shrink-0 sm:aspect-auto sm:h-auto sm:w-2/5 sm:min-h-[200px]">
          <Image
            src={mainHub.image}
            alt={mainHub.imageAlt}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent sm:bg-gradient-to-r" />
          <span className="absolute left-4 top-4 rounded-full bg-brand-green px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Home base
          </span>
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-green">
            {mainHub.subtitle}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-navy">{mainHub.title}</h3>
          <p className="mt-2 text-sm text-muted line-clamp-3">{mainHub.description}</p>
          <span className="mt-4 text-sm font-medium text-brand-green group-hover:underline">
            Full Dover service →
          </span>
        </div>
      </Link>

      <div>
        <p className="text-sm font-medium text-navy/70">
          Airport Transfer Pickup Hubs
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pickupHubs.map((town) => (
            <Link
              key={town.id}
              href={TOWN_TAXI_LANDING_BY_ID[town.id] ?? `#${town.id}`}
              className="group overflow-hidden rounded-xl border border-navy/8 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={town.image}
                  alt={town.imageAlt}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/75 to-transparent" />
                <p className="absolute bottom-2 left-3 right-3 text-sm font-bold leading-tight text-white">
                  From {town.title}
                </p>
              </div>
              <p className="px-3 py-2 text-xs text-muted">Airport Transfers · Paris</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
