import { CustomerAppDownload } from "@/components/AppStoreButtons";
import { RC_PASSENGER_APP_URL } from "@/lib/rideconnect/content";

export function RcPassengerApp() {
  return (
    <section id="app" className="scroll-mt-24 border-y border-navy/8 bg-cream py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
          Passenger App
        </p>
        <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
          Book and track in the RideConnect app
        </h2>
        <p className="mt-4 text-muted">
          Open the passenger app in your browser — book airport and cruise transfers,
          message dispatch and track your driver when assigned.
        </p>
        <CustomerAppDownload
          className="mt-6"
          variant="light"
          title=""
          subtitle="Works in Safari on iPhone and Android — no download required."
        />
        <a
          href={RC_PASSENGER_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-semibold text-brand-green hover:underline"
        >
          Open passenger app →
        </a>
      </div>
    </section>
  );
}
