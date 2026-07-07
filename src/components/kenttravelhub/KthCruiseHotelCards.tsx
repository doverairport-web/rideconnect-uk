import {
  KTH_CRUISE_HOTELS,
  formatHotelPrice,
  type KthCruiseHotel,
} from "@/lib/kenttravelhub/cruise-hotels";
import { kthBookUrl } from "@/lib/kenttravelhub/paths";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  /** Show only the first N hotels (e.g. on the cruise terminal guide). */
  limit?: number;
};

function isRemoteImage(src: string): boolean {
  return src.startsWith("http");
}

function HotelPhoto({ hotel }: { hotel: KthCruiseHotel }) {
  const common =
    "h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]";
  if (isRemoteImage(hotel.image)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={hotel.image}
        alt={hotel.name}
        className={common}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <Image
      src={hotel.image}
      alt={hotel.name}
      fill
      className={common}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}

function YesNo({ value }: { value: boolean }) {
  return (
    <span
      className={
        value
          ? "font-semibold text-emerald-700"
          : "font-medium text-kth-muted"
      }
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-kth-navy/6 bg-kth-sand/60 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-kth-muted">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-kth-navy">{children}</p>
    </div>
  );
}

export async function KthCruiseHotelCards({ limit }: Props) {
  const hotels = limit ? KTH_CRUISE_HOTELS.slice(0, limit) : KTH_CRUISE_HOTELS;

  const cards = await Promise.all(
    hotels.map(async (hotel) => ({
      hotel,
      bookUrl: await kthBookUrl({
        campaign: "cruise-hotels",
        content: `${hotel.id}-to-terminal`,
      }),
    })),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {cards.map(({ hotel, bookUrl }) => (
        <article
          key={hotel.id}
          className="group overflow-hidden rounded-2xl border border-kth-navy/10 bg-white shadow-sm transition hover:border-kth-sea/25 hover:shadow-md"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-kth-navy/5">
            <HotelPhoto hotel={hotel} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-kth-navy/80 via-kth-navy/30 to-transparent px-5 pb-4 pt-16">
              <p className="text-xs font-semibold text-white/75">
                from {formatHotelPrice(hotel.priceFrom)}
              </p>
              <h3 className="mt-0.5 font-serif text-xl font-bold leading-snug text-white sm:text-2xl">
                {hotel.name}
              </h3>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-sm leading-relaxed text-kth-muted">
              {hotel.cruiseNote}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Fact label="CT1">{hotel.distanceCt1}</Fact>
              <Fact label="CT2">{hotel.distanceCt2}</Fact>
              <Fact label="Taxi">{hotel.taxiMinutes}</Fact>
              <Fact label="Rating">
                <span className="text-kth-gold">★</span> {hotel.guestRating.toFixed(1)}
              </Fact>
            </div>

            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
              <div className="flex justify-between gap-2 sm:block">
                <dt className="text-kth-muted">Parking</dt>
                <dd>
                  <YesNo value={hotel.parking} />
                </dd>
              </div>
              <div className="flex justify-between gap-2 sm:block">
                <dt className="text-kth-muted">Restaurant</dt>
                <dd>
                  <YesNo value={hotel.restaurant} />
                </dd>
              </div>
              <div className="flex justify-between gap-2 sm:col-span-1 sm:block">
                <dt className="text-kth-muted">Breakfast</dt>
                <dd className="font-semibold text-kth-navy">{hotel.breakfast}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={hotel.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-kth-navy/15 bg-white px-4 py-2.5 text-center text-sm font-bold text-kth-navy transition hover:border-kth-sea/40 hover:text-kth-sea"
              >
                Visit Official Website
              </a>
              <Link
                href={bookUrl}
                className="inline-flex flex-1 items-center justify-center rounded-lg bg-kth-gold px-4 py-2.5 text-center text-sm font-extrabold text-kth-navy transition hover:bg-kth-gold-dark"
              >
                Book Taxi to Cruise Terminal
              </Link>
            </div>

            <p className="mt-3 text-[10px] leading-snug text-kth-muted/80">
              {hotel.imageCredit}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
