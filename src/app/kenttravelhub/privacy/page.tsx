import { KTH_NAME, KTH_POWERED_BY, KTH_SITE_URL } from "@/lib/kenttravelhub/brand";
import { kthPageMetadata } from "@/lib/kenttravelhub/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return kthPageMetadata({
    title: `Privacy | ${KTH_NAME}`,
    description: `Privacy policy and cookie information for ${KTH_NAME} — analytics, advertising and newsletter sign-up.`,
    path: "/privacy",
  });
}

export default function KentTravelHubPrivacyPage() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-kth-navy sm:text-4xl">
          Privacy Policy
        </h1>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-kth-muted">
          <p>
            {KTH_NAME} ({KTH_SITE_URL}) provides travel information and links to
            taxi booking services operated by {KTH_POWERED_BY}.
          </p>

          <h2 className="pt-4 font-serif text-lg font-bold text-kth-navy">
            Taxi bookings
          </h2>
          <p>
            When you book a taxi via our booking links, your data is handled
            according to the RideConnect UK booking and privacy policies on the
            main booking site.
          </p>

          <h2 className="pt-4 font-serif text-lg font-bold text-kth-navy">
            Cookies &amp; analytics
          </h2>
          <p>
            When you first visit Kent Travel Hub, we ask for your consent before
            loading optional analytics cookies. You can accept or reject analytics
            cookies using the banner or{" "}
            <strong>Cookie settings</strong> link in the footer.
          </p>
          <p>
            If you accept, we use <strong>Google Analytics 4</strong> to measure
            page views, section visits (cruise, ferries, airports), taxi booking
            link clicks and newsletter sign-ups. We use{" "}
            <strong>Microsoft Clarity</strong> for session recordings and heatmaps
            to improve the site. Analytics only runs after you opt in.
          </p>
          <p>
            We configure Google Analytics with consent mode and without ad
            personalisation signals. You can withdraw consent at any time via
            Cookie settings. Clearing your browser storage will also reset your
            choice.
          </p>

          <h2 className="pt-4 font-serif text-lg font-bold text-kth-navy">
            Advertising
          </h2>
          <p>
            We may display Google AdSense advertisements on travel guides.
            Google and its partners may use cookies to serve ads based on your
            visits. See Google&apos;s ad settings to manage personalised
            advertising.
          </p>

          <h2 className="pt-4 font-serif text-lg font-bold text-kth-navy">
            Affiliate links
          </h2>
          <p>
            Hotel links may be affiliate links (e.g. Booking.com). We may earn a
            commission at no extra cost to you. Affiliate partners have their own
            privacy policies.
          </p>

          <h2 className="pt-4 font-serif text-lg font-bold text-kth-navy">
            Contact
          </h2>
          <p>
            For questions about this site or your data, contact us via the
            details on our contact page.
          </p>
        </div>
      </div>
    </section>
  );
}
