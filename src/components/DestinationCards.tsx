import Image from "next/image";
import Link from "next/link";
import { destinations } from "@/lib/destinations";
import { DESTINATION_TRANSFER_HREF } from "@/lib/rideconnect/transfer-pages";

export function DestinationCards() {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {destinations.map((destination) => {
        const href =
          DESTINATION_TRANSFER_HREF[destination.id] ?? `#${destination.id}`;
        return (
          <Link
            key={destination.id}
            href={href}
            className="group overflow-hidden rounded-2xl border border-navy/8 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={destination.image}
                alt={destination.imageAlt}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-navy/25 transition group-hover:bg-navy/15" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-navy group-hover:text-brand-blue">
                {destination.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{destination.subtitle}</p>
              <span className="mt-3 inline-block text-sm font-medium text-brand-green">
                View transfer →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
