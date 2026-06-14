import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";
import { PaymentSuccessTracking } from "@/components/PaymentSuccessTracking";

export const metadata = {
  title: "Payment received",
  robots: { index: false },
};

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <PaymentSuccessTracking />
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8">
        <p className="text-xl font-semibold text-navy">Payment received</p>
        <p className="mt-3 text-muted">
          Thank you. Your card payment was successful and your booking is being sent to our
          dispatch team.
        </p>
        <p className="mt-2 text-sm text-muted">
          {BRAND_NAME} will confirm your pickup time shortly. A driver is assigned after dispatch
          accepts the job.
        </p>
        <PaymentReference searchParams={searchParams} />
        <Link
          href="/book"
          className="mt-8 inline-block rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-light"
        >
          Book another journey
        </Link>
      </div>
    </main>
  );
}

async function PaymentReference({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  if (!params.session_id) return null;
  return (
    <p className="mt-4 text-xs text-muted">
      Reference: {params.session_id.slice(0, 20)}…
    </p>
  );
}
