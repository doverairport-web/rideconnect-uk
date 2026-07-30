import { ContactLinks } from "@/components/ContactLinks";
import { RcTransferHeroBanner } from "@/components/rideconnect/RcTransferHeroBanner";
import {
  email,
  primaryPhone,
  telHref,
  whatsappDisplay,
  whatsappHref,
} from "@/lib/contact";
import { GOOGLE_MAPS_URL } from "@/lib/directories";
import {
  getRideConnectSiteForRequest,
  rideConnectPageMetadata,
} from "@/lib/rideconnect/page-metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getRideConnectSiteForRequest();
  return rideConnectPageMetadata(
    "/contact",
    `Contact | ${site.brandTitle}`,
    `Call, email or WhatsApp ${site.brandTitle} for taxi bookings, airport transfers and general enquiries.`,
  );
}

export default async function ContactPage() {
  const site = await getRideConnectSiteForRequest();
  const wa = whatsappHref(`Hi, I'd like to book a taxi with ${site.brandTitle}.`);

  return (
    <>
      <RcTransferHeroBanner slug="dover-town" title={`Contact ${site.brandTitle}`} />
      <section className="bg-cream py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">Contact us</h1>
          <p className="mt-4 text-muted">
            {site.brandTitle} is based in Dover, Kent. For bookings, call or use WhatsApp for the
            fastest response. You can also book online — jobs go straight to dispatch.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-navy">Phone &amp; email</h2>
              <ContactLinks className="mt-4 text-navy/80" />
            </div>

            <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-navy">Quick actions</h2>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href={`tel:${telHref(primaryPhone)}`}
                  className="rounded-full bg-brand-green px-5 py-3 text-center text-sm font-semibold text-white hover:bg-brand-green-dark"
                >
                  Call {primaryPhone}
                </a>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-navy/20 px-5 py-3 text-center text-sm font-semibold text-navy hover:border-brand-green hover:text-brand-green"
                >
                  WhatsApp {whatsappDisplay}
                </a>
                <a
                  href="/book"
                  className="rounded-full border border-navy/20 px-5 py-3 text-center text-sm font-semibold text-navy hover:border-brand-green hover:text-brand-green"
                >
                  Book online
                </a>
                <a
                  href={`mailto:${email}`}
                  className="rounded-full border border-navy/20 px-5 py-3 text-center text-sm font-semibold text-navy hover:border-brand-green hover:text-brand-green"
                >
                  Email {email}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy">Find us</h2>
            <p className="mt-3 text-muted">
              Dover, Kent CT16 — local taxis, port, cruise, station and hospital transfers. Airport
              runs from Dover, Deal, Folkestone, Canterbury and Ashford.
            </p>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-brand-green hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>

          <p className="mt-8 text-sm text-muted">
            For privacy enquiries see our{" "}
            <a href="/privacy" className="text-brand-green hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
