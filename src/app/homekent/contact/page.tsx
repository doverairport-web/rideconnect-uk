import { HomeKentQuoteForm } from "@/components/homekent/HomeKentQuoteForm";
import {
  HOMEKENT_AREAS,
  HOMEKENT_EMAIL,
  HOMEKENT_NAME,
  HOMEKENT_PHONE,
  homekentTelHref,
} from "@/lib/homekent/brand";
import { homekentCanonicalUrl } from "@/lib/homekent/site";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Contact | ${HOMEKENT_NAME}`,
    description: `Get in touch with ${HOMEKENT_NAME} for a free cleaning quote in ${HOMEKENT_AREAS}.`,
    alternates: { canonical: await homekentCanonicalUrl("/contact") },
  };
}

export default function HomeKentContactPage() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <h1 className="font-serif text-3xl font-bold text-homekent-navy sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-4 text-homekent-muted">
            Call, email or send us a message — we&apos;ll get back to you with a
            free, no-obligation quote for your home or holiday let.
          </p>

          <div className="mt-8 space-y-4 rounded-xl border border-homekent-navy/8 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-homekent-gold">
                Phone
              </p>
              <a
                href={`tel:${homekentTelHref()}`}
                className="mt-1 block text-lg font-semibold text-homekent-navy hover:text-homekent-gold"
              >
                {HOMEKENT_PHONE}
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-homekent-gold">
                Email
              </p>
              <a
                href={`mailto:${HOMEKENT_EMAIL}`}
                className="mt-1 block text-homekent-navy hover:text-homekent-gold"
              >
                {HOMEKENT_EMAIL}
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-homekent-gold">
                Service area
              </p>
              <p className="mt-1 text-homekent-muted">{HOMEKENT_AREAS}</p>
            </div>
          </div>
        </div>

        <HomeKentQuoteForm />
      </div>
    </section>
  );
}
