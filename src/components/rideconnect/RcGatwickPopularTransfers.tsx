import Link from "next/link";

const GATWICK_TRANSFERS = [
  {
    href: "/transfers/dover-to-gatwick",
    title: "Dover to Gatwick",
    detail: "From £150 · North & South",
  },
  {
    href: "/transfers/deal-to-gatwick",
    title: "Deal to Gatwick",
    detail: "From £135 fixed guide",
  },
  {
    href: "/transfers/canterbury-to-gatwick",
    title: "Canterbury to Gatwick",
    detail: "From £107 fixed guide",
  },
  {
    href: "/transfers/folkestone-to-gatwick",
    title: "Folkestone to Gatwick",
    detail: "From £130 · Eurotunnel links",
  },
  {
    href: "/transfers/sandwich-to-gatwick",
    title: "Sandwich to Gatwick",
    detail: "From £130 fixed guide",
  },
  {
    href: "/transfers/dover-to-heathrow",
    title: "Dover to Heathrow",
    detail: "All Heathrow terminals",
  },
] as const;

/** Money-keyword strip for dovertogatwicktaxi.com */
export function RcGatwickPopularTransfers() {
  return (
    <section id="routes" className="scroll-mt-24 border-y border-navy/8 bg-cream/60 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">
          Popular East Kent → Gatwick routes
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Fixed-guide-fare taxis from Dover, Deal, Sandwich, Folkestone and Canterbury to
          Gatwick Airport — book the route people search for.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GATWICK_TRANSFERS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-2xl border border-navy/10 bg-white px-5 py-4 transition hover:border-brand-green/40"
              >
                <span className="font-semibold text-navy">{item.title}</span>
                <span className="mt-1 block text-sm text-muted">{item.detail}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
