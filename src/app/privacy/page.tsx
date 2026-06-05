import { BRAND_LEGAL, BRAND_NAME, SITE_URL } from "@/lib/brand";
import { email } from "@/lib/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Privacy Policy | ${BRAND_NAME}`,
  description:
    "How RideConnect UK collects, uses and protects personal data for passengers, drivers and website bookings under UK GDPR.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const LAST_UPDATED = "31 May 2026";

export default function PrivacyPage() {
  return (
    <section className="bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated: {LAST_UPDATED}</p>
        <p className="mt-6 text-muted">
          This policy explains how {BRAND_LEGAL} (&ldquo;we&rdquo;, &ldquo;us&rdquo;)
          collects, uses and stores personal data when you use our websites, booking
          services and mobile apps, including <strong>RideConnect Driver</strong>. We
          process data in line with UK data protection law, including UK GDPR.
        </p>

        <div className="prose-policy mt-10 space-y-8 text-navy/90">
          <section>
            <h2 className="text-xl font-semibold text-navy">Who we are</h2>
            <p className="mt-3 text-muted">
              {BRAND_LEGAL} provides taxi and private hire dispatch services in Dover,
              Kent and surrounding areas. For privacy enquiries contact{" "}
              <a href={`mailto:${email}`} className="text-brand-green hover:underline">
                {email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-navy">Data we collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
              <li>
                <strong>Contact information</strong> — name, phone number and email when
                you book, register as a driver or contact us.
              </li>
              <li>
                <strong>Location data</strong> — pickup and destination addresses, GPS
                position while using driver navigation, and route information needed to
                complete journeys.
              </li>
              <li>
                <strong>Account identifiers</strong> — login credentials and driver or
                booking reference numbers used to operate the dispatch system.
              </li>
              <li>
                <strong>Journey details</strong> — dates, times, fares, notes and
                messages related to trips.
              </li>
              <li>
                <strong>Technical data</strong> — device type, app version and basic
                usage information to keep services secure and reliable.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-navy">How we use your data</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
              <li>Accept and assign taxi and private hire bookings.</li>
              <li>Provide navigation and trip updates to drivers.</li>
              <li>Communicate about bookings, earnings and service messages.</li>
              <li>Operate accounts, support and safety processes.</li>
              <li>Meet legal, licensing and insurance obligations.</li>
            </ul>
            <p className="mt-3 text-muted">
              We rely on contractual necessity, legitimate interests and, where
              required, your consent. We do not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-navy">RideConnect Driver app</h2>
            <p className="mt-3 text-muted">
              The RideConnect Driver app is for licensed drivers on our network. It may
              access location in the foreground and background while you are online or
              on an active job, so dispatch and passengers can track trip progress. Chat
              and profile features use your account contact details. You can manage
              location permissions in your device settings; some features may not work
              if location is disabled.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-navy">Sharing and retention</h2>
            <p className="mt-3 text-muted">
              We share data only where needed to run the service — for example with
              assigned drivers, passengers (limited trip details), payment processors,
              hosting providers and regulators where the law requires it. We keep data
              only as long as needed for bookings, accounts, tax and licensing, then
              delete or anonymise it where possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-navy">Your rights</h2>
            <p className="mt-3 text-muted">
              Under UK GDPR you may request access, correction, erasure, restriction or
              portability of your data, and object to certain processing. You may also
              complain to the Information Commissioner&apos;s Office (ICO). To exercise
              your rights, email{" "}
              <a href={`mailto:${email}`} className="text-brand-green hover:underline">
                {email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-navy">Security and changes</h2>
            <p className="mt-3 text-muted">
              We use appropriate technical and organisational measures to protect
              personal data. We may update this policy from time to time; the date at
              the top of this page shows when it was last revised.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
