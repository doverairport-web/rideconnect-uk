import { HomeKentQuoteForm } from "@/components/homekent/HomeKentQuoteForm";
import {
  HOMEKENT_EMAIL,
  HOMEKENT_PHONE,
  HOMEKENT_SEO_LINE,
  homekentTelHref,
} from "@/lib/homekent/brand";
import Image from "next/image";

const TRUST_BADGES = [
  "Fully Insured",
  "DBS Checked",
  "5★ Rated Service",
] as const;

export function HomeKentHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1920&q=80"
          alt="Bright, premium living space with coastal light"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/97 via-white/88 to-white/55" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <h1 className="font-serif text-4xl font-bold leading-tight text-homekent-navy sm:text-5xl">
            Professional Cleaning Services Across Kent
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-homekent-muted">
            {HOMEKENT_SEO_LINE} Regular visits, deep cleans, holiday homes and
            Airbnb changeovers — reliable, detail-focused and fully insured.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`tel:${homekentTelHref()}`}
              className="rounded bg-homekent-gold px-7 py-3 text-sm font-bold uppercase tracking-wide text-homekent-navy shadow-md transition hover:bg-homekent-gold-light"
            >
              Call Now
            </a>
            <a
              href="#quote"
              className="rounded border-2 border-homekent-navy px-7 py-3 text-sm font-bold uppercase tracking-wide text-homekent-navy transition hover:bg-homekent-navy hover:text-white"
            >
              Get a Free Quote
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-homekent-navy/80">
            {TRUST_BADGES.map((badge) => (
              <li key={badge} className="flex items-center gap-2">
                <CheckIcon />
                {badge}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-homekent-muted">
            Call{" "}
            <a
              href={`tel:${homekentTelHref()}`}
              className="font-semibold text-homekent-navy hover:text-homekent-gold"
            >
              {HOMEKENT_PHONE}
            </a>{" "}
            or email{" "}
            <a
              href={`mailto:${HOMEKENT_EMAIL}`}
              className="font-semibold text-homekent-navy hover:text-homekent-gold"
            >
              {HOMEKENT_EMAIL}
            </a>
          </p>
        </div>

        <HomeKentQuoteForm id="quote" />
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 text-homekent-gold"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M6.2 11.6L3.4 8.8l-1 1 3.8 3.8 8-8-1-1-7 7z"
      />
    </svg>
  );
}
