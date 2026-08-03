import { NextResponse } from "next/server";
import { fulfillFromSquarePayment } from "@/lib/fulfill-square-payment";
import { isSquareConfigured } from "@/lib/square";

type Body = {
  payment_id?: string;
  transaction_id?: string;
};

/** Verify completed Square payment and create booking if webhook was delayed. */
export async function POST(request: Request) {
  if (!isSquareConfigured()) {
    return NextResponse.json({ ok: false, error: "Square not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as Body;
    const paymentId = (body.payment_id ?? body.transaction_id)?.trim();
    if (!paymentId) {
      return NextResponse.json(
        { ok: false, error: "payment_id or transaction_id is required." },
        { status: 400 },
      );
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
    console.error("Square complete failed:", error);
    return NextResponse.json(
      { ok: false, error: "Could not confirm your booking. Please call us." },
      { status: 500 },
    );
  }
}
