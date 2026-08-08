import { HOMEKENT_EMAIL, HOMEKENT_NAME } from "@/lib/homekent/brand";
import { homekentCanonicalUrl } from "@/lib/homekent/site";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Privacy Policy | ${HOMEKENT_NAME}`,
    alternates: { canonical: await homekentCanonicalUrl("/privacy") },
  };
}

export default function HomeKentPrivacyPage() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-homekent-navy sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-homekent-muted">
          Last updated: {new Date().toLocaleDateString("en-GB")}
        </p>

        <div className="prose-homekent mt-8 space-y-6 text-sm leading-relaxed text-homekent-muted">
          <p>
            {HOMEKENT_NAME} (&quot;we&quot;, &quot;us&quot;) respects your privacy.
            This policy explains how we collect and use personal information when
            you contact us or request a quote through our website.
          </p>

          <div>
            <h2 className="font-serif text-lg font-bold text-homekent-navy">
              Information we collect
            </h2>
            <p className="mt-2">
              When you submit a quote form or contact us, we may collect your
              name, email address, phone number, the service you are interested in,
              and any message you provide.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-homekent-navy">
              How we use your information
            </h2>
            <p className="mt-2">
              We use your details to respond to enquiries, provide quotes, arrange
              cleaning services and communicate about bookings. We do not sell your
              personal data to third parties.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-homekent-navy">
              Contact
            </h2>
            <p className="mt-2">
              For privacy enquiries, email{" "}
              <a
                href={`mailto:${HOMEKENT_EMAIL}`}
                className="font-medium text-homekent-navy hover:text-homekent-gold"
              >
                {HOMEKENT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
