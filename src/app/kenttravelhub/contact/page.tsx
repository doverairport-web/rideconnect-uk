import { KTH_EMAIL, KTH_NAME, KTH_POWERED_BY } from "@/lib/kenttravelhub/brand";
import { kthBookUrl } from "@/lib/kenttravelhub/paths";
import { kthPageMetadata } from "@/lib/kenttravelhub/seo";
import { primaryPhone, telHref } from "@/lib/contact";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return kthPageMetadata({
    title: `Contact | ${KTH_NAME}`,
    description: `Contact ${KTH_NAME} — travel information for Dover port, ferries and cruise. Bookings via ${KTH_POWERED_BY}.`,
    path: "/contact",
  });
}

export default async function KentTravelHubContactPage() {
  const book = await kthBookUrl({ campaign: "contact-book", content: "contact" });

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <h1 className="font-serif text-3xl font-bold text-kth-navy sm:text-4xl">
            Contact &amp; Bookings
          </h1>
          <p className="mt-4 text-kth-muted">
            {KTH_NAME} is powered by {KTH_POWERED_BY}. For taxi bookings,
            airport transfers and cruise terminal pickups, call or book online.
          </p>

          <div className="mt-8 space-y-4 rounded-xl border border-kth-navy/8 bg-kth-sand p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-kth-sea">
                Phone
              </p>
              <a
                href={`tel:${telHref(primaryPhone)}`}
                className="mt-1 block text-lg font-semibold text-kth-navy hover:text-kth-sea"
              >
                {primaryPhone}
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-kth-sea">
                Email
              </p>
              <a
                href={`mailto:${KTH_EMAIL}`}
                className="mt-1 block text-kth-navy hover:text-kth-sea"
              >
                {KTH_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-kth-navy/8 bg-white p-8 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-kth-navy">
            Book a taxi
          </h2>
          <p className="mt-3 text-sm text-kth-muted">
            Pre-book Dover taxis, airport transfers and cruise terminal pickups
            with fixed guide fares and online confirmation.
          </p>
          <Link
            href={book}
            className="mt-6 inline-flex rounded-full bg-kth-accent px-8 py-3.5 text-sm font-bold text-white transition hover:bg-kth-accent-dark"
          >
            Book online with RideConnect
          </Link>
        </div>
      </div>
    </section>
  );
}
