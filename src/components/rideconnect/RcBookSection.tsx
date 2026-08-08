import { BookingForm } from "@/components/BookingForm";

export function RcBookSection({
  title = "Book online",
  description = "Choose pickup and destination — we show the route on the map and an approximate fare before you confirm.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section id="book" className="scroll-mt-24 bg-cream py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
          <p className="mt-3 text-muted">{description}</p>
        </div>
        <div className="mt-10 rounded-2xl border border-navy/8 bg-white p-6 shadow-sm sm:p-8">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
