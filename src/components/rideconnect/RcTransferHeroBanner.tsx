import Image from "next/image";

/** Map transfer slugs to local Dover/Kent photography. */
export function transferHeroImage(slug: string): { src: string; alt: string } {
  if (slug.includes("deal")) {
    return {
      src: "/kenttravelhub/explore/deal-beach.jpg",
      alt: "Deal beach and seafront — taxi and airport transfers from Deal",
    };
  }
  if (slug.includes("canterbury")) {
    return {
      src: "/kenttravelhub/explore/canterbury-cathedral.jpg",
      alt: "Canterbury Cathedral — airport transfers from Canterbury",
    };
  }
  if (slug.includes("folkestone")) {
    return {
      src: "/kenttravelhub/explore/white-cliffs.jpg",
      alt: "Kent coast near Folkestone — airport taxi transfers",
    };
  }
  if (slug.includes("ashford")) {
    return {
      src: "/kenttravelhub/explore/white-cliffs.jpg",
      alt: "Kent countryside near Ashford — airport taxi transfers",
    };
  }
  if (slug.includes("cruise") || slug.includes("ferry") || slug.includes("gatwick") || slug.includes("heathrow") || slug.includes("sandwich")) {
    return {
      src: "/kenttravelhub/hero-dover.jpg",
      alt: "Dover port and White Cliffs — cruise, ferry and airport taxi pickups",
    };
  }
  if (slug.includes("priory") || slug.includes("hospital") || slug.includes("town")) {
    return {
      src: "/kenttravelhub/explore/dover-castle.jpg",
      alt: "Dover Castle above the town — local Dover taxi services",
    };
  }
  return {
    src: "/kenttravelhub/explore/white-cliffs.jpg",
    alt: "White Cliffs of Dover — RideConnect UK taxi and transfers",
  };
}

type Props = {
  slug: string;
  title: string;
};

/** Compact full-bleed photo banner for transfer landing pages. */
export function RcTransferHeroBanner({ slug, title }: Props) {
  const image = transferHeroImage(slug);

  return (
    <div className="relative isolate h-48 overflow-hidden bg-navy sm:h-64 lg:h-72">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/40 to-navy/20" />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 pb-6 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
          RideConnect UK
        </p>
        <p className="mt-1 text-lg font-semibold text-white sm:text-xl">{title}</p>
      </div>
    </div>
  );
}
