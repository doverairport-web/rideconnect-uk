import Link from "next/link";

const POPULAR_TRANSFERS = [
  {
    href: "https://dovertogatwicktaxi.com/transfers/dover-to-gatwick",
    title: "Dover to Gatwick",
    detail: "Fixed-fare airport taxi from £150",
    external: true,
  },
  {
    href: "/transfers/dover-to-heathrow",
    title: "Dover to Heathrow",
    detail: "From £248 — all terminals",
    external: false,
  },
  {
    href: "/transfers/dover-cruise-terminal-taxi",
    title: "Cruise Terminal",
    detail: "Ship pickup in Dover",
    external: false,
  },
  {
    href: "/transfers/deal-taxi",
    title: "Deal taxi",
    detail: "Local & airport from Deal",
    external: false,
  },
  {
    href: "/transfers/canterbury-taxi",
    title: "Canterbury taxi",
    detail: "Gatwick from £107",
    external: false,
  },
  {
    href: "/transfers/folkestone-taxi",
    title: "Folkestone taxi",
    detail: "Eurotunnel & airport links",
    external: false,
  },
  {
    href: "/transfers/corporate-staff-transfers",
    title: "Corporate & staff",
    detail: "Regular account transfers",
    external: false,
  },
  {
    href: "/transfers/dover-ferry-port-taxi",
    title: "Ferry Port",
    detail: "Eastern Docks pickup",
    external: false,
  },
] as const;

const linkClass =
  "block rounded-2xl border border-navy/10 bg-white px-5 py-4 transition hover:border-brand-green/40";

/** SEO + UX strip — strengthens network landings and points Gatwick to the specialist domain. */
export function RcPopularTransfers({
  title = "Popular RideConnect transfers",
  description = "Book the routes customers search for most — airport, cruise, Deal, Canterbury and corporate staff transfers across Kent.",
}: {
  title?: string;
  description?: string;
} = {}) {
  return (
    <section id="popular-transfers" className="border-y border-navy/8 bg-cream/60 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-muted">{description}</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_TRANSFERS.map((item) => (
            <li key={item.href}>
              {item.external ? (
                <a href={item.href} className={linkClass}>
                  <span className="font-semibold text-navy">{item.title}</span>
                  <span className="mt-1 block text-sm text-muted">{item.detail}</span>
                </a>
              ) : (
                <Link href={item.href} className={linkClass}>
                  <span className="font-semibold text-navy">{item.title}</span>
                  <span className="mt-1 block text-sm text-muted">{item.detail}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
