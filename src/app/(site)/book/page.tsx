import { BookingForm } from "@/components/BookingForm";
import { primaryPhone, telHref, whatsappHref } from "@/lib/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a taxi | Dover Taxi",
  description:
    "Book a Dover taxi online. Pick pickup and destination on the map, see live meter fare estimate, and send your request to dispatch.",
};

export default function BookPage() {
  return (
    <section className="bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">Book your journey</h1>
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
              href={whatsappHref("Hi, I'd like to book a taxi.")}
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
  );
}
