import { NextResponse } from "next/server";
import { WebhooksHelper } from "square";
import { unpackBookingMetadata, type CardCheckoutBooking } from "@/lib/booking-payment";
import { fulfillWebBooking } from "@/lib/fulfill-booking";
import { SITE_URL } from "@/lib/brand";
import {
  dispatchPassengerFulfillUrl,
  dispatchPaymentSecret,
} from "@/lib/payment-proxy";
import { getSquareClient, getSquareWebhookUrl, isSquareConfigured } from "@/lib/square";

export const runtime = "nodejs";

type SquareWebhookPayload = {
  type?: string;
  data?: {
    object?: {
      payment?: {
        id?: string;
        status?: string;
        order_id?: string;
        amount_money?: { amount?: bigint | number; currency?: string };
      };
    };
  };
};

export async function POST(request: Request) {
  if (!isSquareConfigured()) {
    return NextResponse.json({ ok: false, error: "Square not configured" }, { status: 503 });
  }

  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY?.trim();
  if (!signatureKey) {
    return NextResponse.json(
      { ok: false, error: "Missing SQUARE_WEBHOOK_SIGNATURE_KEY" },
      { status: 503 },
    );
  }

  const payload = await request.text();
  const signature = request.headers.get("x-square-hmacsha256-signature") ?? "";
  const notificationUrl = getSquareWebhookUrl(SITE_URL);

  const valid = await WebhooksHelper.verifySignature({
    requestBody: payload,
    signatureHeader: signature,
    signatureKey,
    notificationUrl,
  });

  if (!valid) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
  }

  let event: SquareWebhookPayload;
  try {
    event = JSON.parse(payload) as SquareWebhookPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (event.type !== "payment.updated") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const payment = event.data?.object?.payment;
  if (!payment || payment.status !== "COMPLETED" || !payment.order_id) {
    return NextResponse.json({ ok: true, skipped: payment?.status ?? "no_payment" });
  }

  const client = getSquareClient();
  const orderResponse = await client.orders.get({ orderId: payment.order_id });
  const packed = unpackBookingMetadata(
    orderResponse.order?.metadata as Record<string, string> | undefined,
  );

  if (!packed) {
    console.error("Square webhook: missing booking metadata on order", payment.order_id);
    return NextResponse.json({ ok: false, error: "Invalid booking metadata" }, { status: 400 });
  }

  const amountPaid = Number(payment.amount_money?.amount ?? 0) / 100;
  const { estimated_fare, pickup_coord, rc_src, ...booking } = packed as CardCheckoutBooking;
  void pickup_coord;

  if (rc_src === "passenger_dispatch") {
    const secret = dispatchPaymentSecret();
    if (!secret) {
      console.error("Square webhook: passenger booking but DISPATCH_PAYMENT_SECRET missing");
      return NextResponse.json(
        { ok: false, error: "Passenger fulfill not configured" },
        { status: 503 },
      );
    }

    const paymentId = payment.id ?? payment.order_id ?? "";
    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    };

    const fulfillResponse = await fetch(dispatchPassengerFulfillUrl(), {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        booking,
        estimated_fare: amountPaid,
        cardPayment: {
          amountPaid,
          sessionId: paymentId,
        },
      }),
    });

    const fulfillData = (await fulfillResponse.json()) as { ok?: boolean; error?: string };
    if (!fulfillResponse.ok || !fulfillData.ok) {
      console.error("Square webhook: passenger fulfill failed", fulfillData.error, payment.id);
      return NextResponse.json(
        { ok: false, error: fulfillData.error ?? "Passenger fulfill failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, fulfilled: true, passenger: true });
  }

  const result = await fulfillWebBooking(booking, {
    estimatedFare: amountPaid,
    cardPayment: {
      amountPaid,
      sessionId: payment.id ?? payment.order_id,
    },
  });

  if (!result.ok) {
    console.error("Square webhook fulfill failed:", result.error, payment.id);
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, fulfilled: true });
}
