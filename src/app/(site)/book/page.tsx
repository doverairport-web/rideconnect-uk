import { BookingForm } from "@/components/BookingForm";
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
            Choose pickup and destination on the map. We calculate the approximate Dover
            Hackney meter fare before you confirm — dispatch then accepts and assigns a
            driver.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-navy/8 bg-white p-6 shadow-sm sm:p-8">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
