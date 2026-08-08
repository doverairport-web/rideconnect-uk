import { Suspense } from "react";
import { BookingForm } from "@/components/BookingForm";
import { BookPageHero } from "@/components/rideconnect/BookPageHero";
import { RcTransferHeroBanner } from "@/components/rideconnect/RcTransferHeroBanner";
import { primaryPhone, telHref, whatsappHref } from "@/lib/contact";
import {
  getRideConnectSiteForRequest,
  rideConnectPageMetadata,
} from "@/lib/rideconnect/page-metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getRideConnectSiteForRequest();
  return rideConnectPageMetadata(
    "/book",
    `Book a taxi | ${site.brandTitle}`,
    `Book a taxi online with ${site.brandTitle}. Pick pickup and destination on the map, see a fare estimate, and send your request to dispatch.`,
  );
}

export default async function BookPage() {
  const site = await getRideConnectSiteForRequest();
  const wa = whatsappHref(`Hi, I'd like to book a taxi with ${site.brandTitle}.`);

  return (
    <>
      <Suspense
        fallback={
          <RcTransferHeroBanner
            slug="dover-ferry-port-taxi"
            title={`Book with ${site.brandTitle}`}
          />
        }
      >
        <BookPageHero brandTitle={site.brandTitle} />
      </Suspense>
      <section className="bg-cream py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
              {site.brandTitle}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">Book your journey</h1>
            <p className="mt-3 text-muted">
              Airport, cruise or local — choose your route, see an approximate fare, and request your
              pickup. We confirm by phone or text.
            </p>
            <p className="mt-4 text-sm text-muted">
              Rather speak to someone?{" "}
              <a href={`tel:${telHref(primaryPhone)}`} className="font-semibold text-brand-green">
                Call {primaryPhone}
              </a>{" "}
              ·{" "}
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-green"
              >
                WhatsApp
              </a>
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-navy/8 bg-white p-6 shadow-sm sm:p-8">
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  );
}
