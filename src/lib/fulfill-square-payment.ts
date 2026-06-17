import { unpackBookingMetadata, type CardCheckoutBooking } from "@/lib/booking-payment";
import { fulfillWebBooking } from "@/lib/fulfill-booking";
import {
  dispatchPassengerFulfillUrl,
  dispatchPaymentSecret,
} from "@/lib/payment-proxy";
import { getSquareClient } from "@/lib/square";

export type SquareFulfillResult =
  | {
      ok: true;
      passenger: boolean;
      record_id?: string;
      customer_email_sent?: boolean;
    }
  | { ok: false; error: string; status: number };

/** Idempotent: safe to call from webhook and payment success page. */
export async function fulfillFromSquarePayment(paymentId: string): Promise<SquareFulfillResult> {
  const client = getSquareClient();
  const paymentResponse = await client.payments.get({ paymentId });
  const payment = paymentResponse.payment;
  if (!payment || payment.status !== "COMPLETED" || !payment.orderId) {
    return { ok: false, error: "Payment not completed.", status: 409 };
  }

  const orderResponse = await client.orders.get({ orderId: payment.orderId });
  const packed = unpackBookingMetadata(
    orderResponse.order?.metadata as Record<string, string> | undefined,
  );
  if (!packed) {
    return { ok: false, error: "Booking metadata missing on order.", status: 400 };
  }

  const amountPaid = Number(payment.amountMoney?.amount ?? 0) / 100;
  const { estimated_fare, pickup_coord, rc_src, ...booking } = packed as CardCheckoutBooking;
  void pickup_coord;
  void estimated_fare;

  if (rc_src === "passenger_dispatch") {
    const secret = dispatchPaymentSecret();
    if (!secret) {
      return { ok: false, error: "Passenger fulfill not configured.", status: 503 };
    }

    const fulfillResponse = await fetch(dispatchPassengerFulfillUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        booking,
        estimated_fare: amountPaid,
        cardPayment: {
          amountPaid,
          sessionId: paymentId,
        },
      }),
    });

    const fulfillData = (await fulfillResponse.json()) as {
      ok?: boolean;
      error?: string;
      record_id?: string;
      customer_email_sent?: boolean;
    };

    if (!fulfillResponse.ok || !fulfillData.ok) {
      return {
        ok: false,
        error: fulfillData.error ?? "Passenger fulfill failed.",
        status: 500,
      };
    }

    return {
      ok: true,
      passenger: true,
      record_id: fulfillData.record_id,
      customer_email_sent: fulfillData.customer_email_sent,
    };
  }

  const result = await fulfillWebBooking(booking, {
    estimatedFare: amountPaid,
    cardPayment: {
      amountPaid,
      sessionId: paymentId,
    },
    source: booking.source_domain
      ? {
          sourceDomain: booking.source_domain,
          sourceApp: booking.source_app || "website/book",
        }
      : undefined,
    serviceType: booking.service_type,
  });

  if (!result.ok) {
    return { ok: false, error: result.error ?? "Fulfill failed.", status: 500 };
  }

  return {
    ok: true,
    passenger: false,
    record_id: result.recordId,
    customer_email_sent: result.emailSent,
  };
}
