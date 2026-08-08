import Link from "next/link";
import {
  GOOGLE_MAPS_URL,
  GOOGLE_REVIEW_URL,
  YELL_LISTING_URL,
} from "@/lib/directories";

const TRUST_ITEMS = [
  {
    title: "Licensed Dover district",
    detail: "Private hire operated to Dover district standards",
  },
  {
    title: "Fixed guide fares",
    detail: "Airport and long-distance prices confirmed when you book",
  },
  {
    title: "Flight & ship aware",
    detail: "Share flight or ship details — we plan pickup around them",
  },
  {
    title: "Cars and MPVs",
    detail: "Luggage space for families, cruise and airport transfers",
  },
] as const;

/** On-page trust strip for RideConnect network taxi sites. */
export function RcTrustBar() {
  return (
    <section
      aria-label="Why book with us"
      className="border-y border-navy/8 bg-white py-10 sm:py-12"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy sm:text-2xl">
              Trusted East Kent private hire
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Licensed local operators, clear guide fares, and advance booking for
              Dover, Deal, Canterbury, Folkestone and Ashford.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-green hover:underline"
            >
              Google reviews
            </a>
            <span className="text-navy/20" aria-hidden>
              ·
            </span>
            <a
              href={YELL_LISTING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-green hover:underline"
            >
              Yell listing
            </a>
            <span className="text-navy/20" aria-hidden>
              ·
            </span>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-green hover:underline"
            >
              Find us on Maps
            </a>
          </div>
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <li key={item.title}>
              <p className="font-semibold text-navy">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.detail}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-muted">
          Ready to travel?{" "}
          <Link href="/book" className="font-semibold text-brand-green hover:underline">
            Book online
          </Link>{" "}
          or browse{" "}
          <Link
            href="/transfers/dover-to-heathrow"
            className="font-semibold text-brand-green hover:underline"
          >
            airport transfers
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
