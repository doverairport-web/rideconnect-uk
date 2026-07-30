import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/lib/destinations";
import { DESTINATION_TRANSFER_HREF } from "@/lib/rideconnect/transfer-pages";

type DestinationSectionProps = {
  destination: Destination;
  reverse?: boolean;
};

export function DestinationSection({
  destination,
  reverse = false,
}: DestinationSectionProps) {
  const { id, title, subtitle, description, image, imageAlt, highlights } =
    destination;
  const bookHref = DESTINATION_TRANSFER_HREF[id] ?? "/book";

  return (
    <article
      id={id}
      className="scroll-mt-24 border-b border-navy/8 last:border-b-0"
    >
      <div
        className={`mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-20 ${
          reverse ? "lg:[&>div:first-child]:order-2" : ""
        }`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg ring-1 ring-navy/10">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
          <p className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white drop-shadow">
            {subtitle}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-green">
            {subtitle}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
          <p className="mt-4 leading-relaxed text-muted">{description}</p>
          <ul className="mt-6 space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-navy/90">
                <span className="mt-0.5 text-brand-green" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={bookHref}
            className="mt-8 inline-flex rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-green-dark"
          >
            Book this transfer
          </Link>
        </div>
      </div>
    </article>
  );
}
