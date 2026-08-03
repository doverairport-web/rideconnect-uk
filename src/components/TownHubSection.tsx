import Image from "next/image";
import Link from "next/link";
import type { Town } from "@/lib/towns";
import { TOWN_TAXI_LANDING_BY_ID } from "@/lib/rideconnect/transfer-pages";

type TownHubSectionProps = {
  town: Town;
  reverse?: boolean;
};

export function TownHubSection({ town, reverse = false }: TownHubSectionProps) {
  const { id, title, subtitle, description, image, imageAlt, highlights } = town;
  const transferHref = TOWN_TAXI_LANDING_BY_ID[id] ?? "/book?type=airport";

  return (
    <article
      id={id}
      className="scroll-mt-24 border-b border-navy/8 last:border-b-0"
    >
      <div
        className={`mx-auto grid max-w-6xl items-center gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-10 lg:py-14 ${
          reverse ? "lg:[&>div:first-child]:order-2" : ""
        }`}
      >
        <div className="relative aspect-[16/10] max-h-56 overflow-hidden rounded-xl shadow-md ring-1 ring-navy/10 lg:max-h-none lg:aspect-[4/3]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
          <p className="absolute bottom-3 left-3 text-xs font-medium uppercase tracking-wide text-white/90">
            Airport Pickup
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
            {subtitle}
          </p>
          <h2 className="mt-1 text-xl font-bold text-navy sm:text-2xl">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {highlights.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-navy/90">
                <span className="shrink-0 text-brand-green" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={transferHref}
            className="mt-6 inline-flex rounded-full border border-brand-green bg-white px-5 py-2.5 text-sm font-semibold text-brand-green hover:bg-brand-green hover:text-white"
          >
            Book Airport Transfer from {title}
          </Link>
        </div>
      </div>
    </article>
  );
}
