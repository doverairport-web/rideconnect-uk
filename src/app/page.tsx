import { BookingForm } from "@/components/BookingForm";
import { BRAND_NAME } from "@/lib/brand";

const phone = process.env.NEXT_PUBLIC_PHONE || "";

const services = [
  {
    title: "Airport transfers",
    description: "Gatwick, Heathrow, Stansted and local airports — fixed quotes on request.",
  },
  {
    title: "Cruise & port",
    description: "Dover cruise terminal and ferry port pickups with luggage space.",
  },
  {
    title: "Stations & hospitals",
    description: "Dover Priory, Ashford, William Harvey and cross-Kent journeys.",
  },
  {
    title: "Local & business",
    description: "Town runs, school contracts, and account bookings for local firms.",
  },
];

const areas = [
  "Dover town & cliffs",
  "Deal & Sandwich",
  "Folkestone & Hythe",
  "Canterbury & Ashford",
  "Eurotunnel & port",
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,184,0,0.18),_transparent_45%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gold">
              Dover, Kent
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {BRAND_NAME} — book your taxi online in minutes
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/75">
              Airport, cruise terminal, station, or anywhere in Kent. Online
              bookings go straight to RideConnect dispatch — the same system we
              use for phone and AI reservations.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#book"
                className="rounded-full bg-brand-green px-6 py-3 font-semibold text-white shadow-lg hover:bg-brand-green-dark"
              >
                Book online
              </a>
              {phone ? (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="rounded-full border border-white/25 px-6 py-3 font-medium text-white hover:border-gold hover:text-gold"
                >
                  Or call {phone}
                </a>
              ) : (
                <a
                  href="#book"
                  className="rounded-full border border-white/25 px-6 py-3 font-medium text-white hover:border-gold hover:text-gold"
                >
                  Prefer to call? Use the number on your confirmation
                </a>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <p className="text-sm font-medium uppercase tracking-wide text-gold">
              Why book with us
            </p>
            <ul className="mt-4 space-y-4 text-white/85">
              <li className="flex gap-3">
                <span className="text-gold">✓</span>
                Licensed local drivers who know Dover and the A2/M20 corridors
              </li>
              <li className="flex gap-3">
                <span className="text-gold">✓</span>
                Dispatch-managed bookings — not an anonymous app algorithm
              </li>
              <li className="flex gap-3">
                <span className="text-gold">✓</span>
                One RideConnect dispatch queue for web, phone, and AI bookings
              </li>
              <li className="flex gap-3">
                <span className="text-gold">✓</span>
                Clear confirmation before a driver is assigned to your job
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">Services</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Tell us where you are going — we will confirm price and vehicle when
          dispatch processes your booking.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-2xl border border-navy/8 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-navy">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="book" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                Book online
              </h2>
              <p className="mt-3 text-muted">
                Fill in your journey details below. Your request is sent to
                dispatch immediately — a driver is offered only after our team
                confirms the booking.
              </p>
              <p className="mt-4 rounded-xl bg-cream p-4 text-sm text-muted">
                Need help with a complex trip (multi-stop, minibus, account
                invoice)? Add notes in the form or call us — our AI phone
                assistant can also take bookings when lines are busy.
              </p>
            </div>
            <div className="rounded-2xl border border-navy/8 bg-cream p-6 shadow-sm lg:col-span-3 sm:p-8">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      <section id="areas" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">Areas we cover</h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {areas.map((area) => (
            <li
              key={area}
              className="rounded-full border border-navy/10 bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm"
            >
              {area}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
