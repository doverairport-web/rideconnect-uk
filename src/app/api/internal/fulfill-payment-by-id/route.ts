import { NextResponse } from "next/server";
import { unpackBookingMetadata, type CardCheckoutBooking } from "@/lib/booking-payment";
import { fulfillWebBooking } from "@/lib/fulfill-booking";
import {
  dispatchPassengerFulfillUrl,
  dispatchPaymentSecret,
  verifyDispatchPaymentAuth,
} from "@/lib/payment-proxy";
import { getSquareClient, isSquareConfigured } from "@/lib/square";

type Body = {
  payment_id?: string;
};

async function fulfillFromSquarePayment(paymentId: string) {
  const client = getSquareClient();
  const paymentResponse = await client.payments.get({ paymentId });
  const payment = paymentResponse.payment;
  if (!payment || payment.status !== "COMPLETED" || !payment.orderId) {
    return { ok: false as const, error: "Payment not completed.", status: 409 };
  }

  const orderResponse = await client.orders.get({ orderId: payment.orderId });
  const packed = unpackBookingMetadata(
    orderResponse.order?.metadata as Record<string, string> | undefined,
  );
  if (!packed) {
    return { ok: false as const, error: "Booking metadata missing on order.", status: 400 };
  }

  const amountPaid = Number(payment.amountMoney?.amount ?? 0) / 100;
  const { estimated_fare, pickup_coord, rc_src, ...booking } = packed as CardCheckoutBooking;
  void pickup_coord;
  void estimated_fare;

  if (rc_src === "passenger_dispatch") {
    const secret = dispatchPaymentSecret();
    if (!secret) {
      return { ok: false as const, error: "Passenger fulfill not configured.", status: 503 };
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
        ok: false as const,
        error: fulfillData.error ?? "Passenger fulfill failed.",
        status: 500,
      };
    }

    return {
      ok: true as const,
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
  });

  if (!result.ok) {
    return { ok: false as const, error: result.error ?? "Fulfill failed.", status: 500 };
  }

  return {
    ok: true as const,
    passenger: false,
    record_id: result.recordId,
    customer_email_sent: result.emailSent,
  };
}

/** Retry fulfill after Square redirect when webhook failed or was delayed. */
export async function POST(request: Request) {
  if (!verifyDispatchPaymentAuth(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isSquareConfigured()) {
    return NextResponse.json({ ok: false, error: "Square not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as Body;
    const paymentId = body.payment_id?.trim();
    if (!paymentId) {
      return NextResponse.json({ ok: false, error: "payment_id is required." }, { status: 400 });
    }

    const result = await fulfillFromSquarePayment(paymentId);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      ok: true,
      fulfilled: true,
      passenger: result.passenger,
      record_id: result.record_id,
      customer_email_sent: result.customer_email_sent,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Fulfill failed.",
      },
      { status: 500 },
    );
  }
}
