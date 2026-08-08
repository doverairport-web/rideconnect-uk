import { NextResponse } from "next/server";
import {
  createCardCheckoutSession,
  requiresOnlineCardPayment,
  type CardCheckoutBooking,
} from "@/lib/booking-payment";
import { verifyDispatchPaymentAuth } from "@/lib/payment-proxy";
import { isSquareConfigured } from "@/lib/square";

type PassengerCheckoutBody = {
  booking?: CardCheckoutBooking;
  redirect_url?: string;
  product_name?: string;
  payment_note?: string;
};

export async function POST(request: Request) {
  if (!verifyDispatchPaymentAuth(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isSquareConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Card payment is not configured on dovertaxi." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as PassengerCheckoutBody;
    const booking = body.booking;

    if (
      !booking?.customer_name?.trim() ||
      !booking.phone?.trim() ||
      !booking.pickup?.trim() ||
      !booking.destination?.trim() ||
      !booking.pickup_date?.trim() ||
      !booking.pickup_time?.trim()
    ) {
      return NextResponse.json(
        { ok: false, error: "Missing required booking fields." },
        { status: 400 },
      );
    }

    if (!requiresOnlineCardPayment(booking.payment_method)) {
      return NextResponse.json(
        { ok: false, error: "Booking does not use online card payment." },
        { status: 400 },
      );
    }

    const estimatedFare = Number(booking.estimated_fare);
    if (!Number.isFinite(estimatedFare) || estimatedFare <= 0) {
      return NextResponse.json(
        { ok: false, error: "Valid estimated_fare is required." },
        { status: 400 },
      );
    }

    const redirectUrl = body.redirect_url?.trim();
    if (!redirectUrl) {
      return NextResponse.json({ ok: false, error: "redirect_url is required." }, { status: 400 });
    }

    const checkoutBooking: CardCheckoutBooking = {
      ...booking,
      estimated_fare: estimatedFare,
      rc_src: "passenger_dispatch",
    };

    const { url, paymentLinkId } = await createCardCheckoutSession(checkoutBooking, {
      productName: body.product_name?.trim() || "RideConnect passenger booking",
      redirectUrl,
      paymentNote: body.payment_note?.trim(),
    });

    return NextResponse.json({
      ok: true,
      checkout_url: url,
      payment_link_id: paymentLinkId,
      estimated_fare: estimatedFare,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Could not start card payment.",
      },
      { status: 500 },
    );
  }
}
