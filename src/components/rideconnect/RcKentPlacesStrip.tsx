import Image from "next/image";
import Link from "next/link";

export type KentPlaceItem = {
  src: string;
  alt: string;
  label: string;
  detail: string;
  href: string;
  external?: boolean;
};

const DEFAULT_PLACES: KentPlaceItem[] = [
  {
    src: "/kenttravelhub/explore/white-cliffs.jpg",
    alt: "White Cliffs of Dover overlooking the Channel",
    label: "Dover cliffs",
    detail: "Cruise & ferry pickups",
    href: "https://dovertogatwicktaxi.com/transfers/dover-to-gatwick",
    external: true,
  },
  {
    src: "/kenttravelhub/explore/dover-castle.jpg",
    alt: "Dover Castle on the hill above the town",
    label: "Dover town",
    detail: "Local taxis & station",
    href: "/transfers/dover-cruise-terminal-taxi",
  },
  {
    src: "/kenttravelhub/explore/deal-beach.jpg",
    alt: "Deal beach and seafront on the Kent coast",
    label: "Deal",
    detail: "Local & airport from Deal",
    href: "/transfers/deal-taxi",
  },
  {
    src: "/kenttravelhub/explore/canterbury-cathedral.jpg",
    alt: "Canterbury Cathedral in the city centre",
    label: "Canterbury",
    detail: "Airport transfers",
    href: "/transfers/canterbury-airport-transfer",
  },
];

const GATWICK_PLACES: KentPlaceItem[] = [
  {
    src: "/kenttravelhub/explore/white-cliffs.jpg",
    alt: "White Cliffs of Dover overlooking the Channel",
    label: "Dover cliffs",
    detail: "Cruise & ferry pickups",
    href: "/transfers/dover-to-gatwick",
  },
  {
    src: "/kenttravelhub/explore/dover-castle.jpg",
    alt: "Dover Castle on the hill above the town",
    label: "Dover town",
    detail: "Priory, hotels & harbour",
    href: "/transfers/dover-to-gatwick",
  },
  {
    src: "/kenttravelhub/explore/deal-beach.jpg",
    alt: "Deal beach and seafront on the Kent coast",
    label: "Deal",
    detail: "From £135 to Gatwick",
    href: "/transfers/deal-to-gatwick",
  },
  {
    src: "/kenttravelhub/explore/canterbury-cathedral.jpg",
    alt: "Canterbury Cathedral in the city centre",
    label: "Canterbury",
    detail: "From £107 to Gatwick",
    href: "/transfers/canterbury-to-gatwick",
  },
];

type Props = {
  variant?: "network" | "gatwick";
  title?: string;
  subtitle?: string;
};

/** Full-bleed Dover & Kent place photography for RideConnect network sites. */
export function RcKentPlacesStrip({
  variant = "network",
  title = "From the White Cliffs across Kent",
  subtitle = "Real Dover and East Kent pickups — local taxis, cruise port and airport transfers.",
}: Props) {
  const places = variant === "gatwick" ? GATWICK_PLACES : DEFAULT_PLACES;

  return (
    <section aria-label="Pickup places across East Kent" className="bg-navy">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-white/70">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4">
        {places.map((place, index) => {
          const className =
            "group relative block min-h-[220px] overflow-hidden sm:min-h-[280px] lg:min-h-[320px]";
          const inner = (
            <>
              <Image
                src={place.src}
                alt={place.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-105"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="text-lg font-semibold text-white">{place.label}</p>
                <p className="mt-0.5 text-sm text-white/75">{place.detail}</p>
              </div>
            </>
          );

          if (place.external) {
            return (
              <a key={place.label} href={place.href} className={className}>
                {inner}
              </a>
            );
          }

          return (
            <Link key={place.label} href={place.href} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
