import Link from "next/link";
import { customerBookUrl, driverWebLoginUrl } from "@/lib/apps";
import { RC_MARKETING_WHY_CARDS } from "@/lib/rideconnect/content";

type IconName = (typeof RC_MARKETING_WHY_CARDS)[number]["icon"];

function MarketingIcon({ name }: { name: IconName }) {
  const className = "h-6 w-6";
  switch (name) {
    case "wallet":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case "map":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16M7 16V9m5 7V5m5 11v-3" />
        </svg>
      );
    case "plane":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      );
    case "ship":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18M5 15l2-8h10l2 8M8 15h8M6 18a2 2 0 104 0M14 18a2 2 0 104 0" />
        </svg>
      );
    case "devices":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2zM16 5h2a2 2 0 012 2v10" />
        </svg>
      );
  }
}

function CardTitle({ title, highlight }: { title: string; highlight?: string }) {
  if (!highlight) {
    return <h3 className="font-semibold text-navy">{title}</h3>;
  }
  const parts = title.split(highlight);
  return (
    <h3 className="font-semibold text-navy">
      {parts[0]}
      <span className="text-brand-orange">{highlight}</span>
      {parts[1] ?? ""}
    </h3>
  );
}

export function RcWhyRideConnect() {
  return (
    <section id="why" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">Why RideConnect UK?</h2>
        <p className="mt-2 max-w-2xl text-lg text-muted">
          Better for passengers. Better for drivers. Built for local transport.
        </p>

        <div className="mt-8 max-w-3xl rounded-2xl border border-brand-green/25 bg-brand-green/5 px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-base leading-relaxed text-navy sm:text-lg">
            RideConnect UK helps local drivers keep up to{" "}
            <span className="font-semibold text-brand-orange">90%</span> of their fare, while
            passengers get reliable local service, fixed airport prices and easy booking.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RC_MARKETING_WHY_CARDS.map((card) => (
            <article
              key={card.id}
              className={`rounded-2xl border p-5 shadow-sm ${
                card.accent === "green"
                  ? "border-brand-green/30 bg-brand-green/5"
                  : "border-navy/10 bg-cream/30"
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  card.accent === "green"
                    ? "bg-brand-green/15 text-brand-green"
                    : "bg-navy/8 text-navy"
                }`}
              >
                <MarketingIcon name={card.icon} />
              </div>
              <div className="mt-4">
                <CardTitle
                  title={card.title}
                  highlight={"highlight" in card ? card.highlight : undefined}
                />
                <p className="mt-2 text-sm leading-relaxed text-muted">{card.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <Link
            href={customerBookUrl}
            className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-brand-green-dark"
          >
            Book with RideConnect UK
          </Link>
          <a
            href={driverWebLoginUrl}
            className="inline-flex items-center justify-center rounded-full border-2 border-brand-green bg-white px-6 py-3 text-center text-sm font-semibold text-brand-green hover:bg-brand-green/5"
          >
            Become a Driver
          </a>
        </div>
      </div>
    </section>
  );
}
