import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";
import { PaymentFulfillmentVerify } from "@/components/PaymentFulfillmentVerify";
import { PaymentSuccessTracking } from "@/components/PaymentSuccessTracking";

export const metadata = {
  title: "Payment received",
  robots: { index: false },
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; transactionId?: string; transaction_id?: string }>;
}) {
  const params = await searchParams;
  const paymentId = params.transactionId ?? params.transaction_id ?? params.session_id ?? null;

  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <PaymentSuccessTracking />
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8">
        <p className="text-xl font-semibold text-navy">Payment received</p>
        <p className="mt-3 text-muted">
          Thank you. Your card payment was successful and your booking is being sent to our
          dispatch team.
        </p>
        <PaymentFulfillmentVerify paymentId={paymentId} />
        <p className="mt-2 text-sm text-muted">
          {BRAND_NAME} will confirm your pickup time shortly. A driver is assigned after dispatch
          accepts the job.
        </p>
        {paymentId ? (
          <p className="mt-4 text-xs text-muted">Reference: {paymentId.slice(0, 20)}…</p>
        ) : null}
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
