import { NextResponse } from "next/server";
import { fulfillFromSquarePayment } from "@/lib/fulfill-square-payment";
import { verifyDispatchPaymentAuth } from "@/lib/payment-proxy";
import { isSquareConfigured } from "@/lib/square";

type Body = {
  payment_id?: string;
};

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
      already_fulfilled: false,
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
