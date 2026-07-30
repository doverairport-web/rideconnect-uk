import Link from "next/link";

/** On-page SEO content for dovertogatwicktaxi.com homepage. */
export function RcGatwickSeoContent() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">
          Why book a Dover to Gatwick taxi with us
        </h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-muted">
            <p>
              <strong className="text-navy">dovertogatwicktaxi.com</strong> is RideConnect UK’s
              East Kent airport specialist. We run fixed-guide-fare private hire from Dover and
              nearby towns straight to Gatwick North or South — no airport rank queues, no
              surprise meter surprises on the M25.
            </p>
            <p>
              Local licensed drivers know the A2 / M20 / M26 / M25 / M23 corridor and Dover cruise
              and ferry pickups. Add your flight number when you book so we can plan for landing
              and baggage time.
            </p>
          </div>
          <div className="space-y-3 text-sm text-muted">
            <p className="font-semibold text-navy">Quick facts</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Dover → Gatwick from £150 (car) · £225 (MPV)</li>
              <li>Journey time typically 1h 30m–2h 15m</li>
              <li>Cruise Terminal 1 &amp; 2 and Eastern Docks pickups</li>
              <li>Also Deal, Sandwich, Folkestone and Canterbury</li>
            </ul>
            <p className="pt-2">
              Full route pages:{" "}
              <Link href="/transfers/dover-to-gatwick" className="font-medium text-brand-green hover:underline">
                Dover to Gatwick taxi
              </Link>
              {" · "}
              <Link href="/transfers/canterbury-to-gatwick" className="font-medium text-brand-green hover:underline">
                Canterbury to Gatwick
              </Link>
              {" · "}
              <Link href="/transfers/deal-to-gatwick" className="font-medium text-brand-green hover:underline">
                Deal to Gatwick
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
