import { NextResponse } from "next/server";
import { parseWebBookingBody } from "@/lib/booking";
import { createCardCheckoutSession, requiresOnlineCardPayment } from "@/lib/booking-payment";
import { buildFareEstimate } from "@/lib/fare-estimate";
import { isSquareConfigured } from "@/lib/square";

export async function POST(request: Request) {
  try {
    if (!isSquareConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Card payment is not set up yet. Choose cash or bank transfer, or call 01304 350125.",
        },
        { status: 503 },
      );
    }

    const body = await request.json();
    const booking = parseWebBookingBody(body);

    if (!booking) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Please provide name, phone, pickup, destination, date, and time.",
        },
        { status: 400 },
      );
    }

    if (!requiresOnlineCardPayment(booking.payment_method)) {
      return NextResponse.json(
        { ok: false, error: "This booking does not use card payment." },
        { status: 400 },
      );
    }

    const clientFare = Number(body.estimated_fare);
    let estimatedFare = Number.isFinite(clientFare) && clientFare > 0 ? clientFare : null;

    if (estimatedFare == null) {
      const fareResult = await buildFareEstimate({
        pickup: booking.pickup,
        destination: booking.destination,
        pickup_date: booking.pickup_date,
        pickup_time: booking.pickup_time,
        passengers: booking.passengers,
        luggageArticles: (booking.luggage_small ?? 0) + (booking.luggage_large ?? 0),
        luggage: booking.luggage,
      });
      if (fareResult.ok) {
        estimatedFare = fareResult.fare;
      }
    }

    if (estimatedFare == null || estimatedFare <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Pick addresses from the list so we can calculate the fare before card payment.",
        },
        { status: 400 },
      );
    }

    const { url, paymentLinkId } = await createCardCheckoutSession({
      ...booking,
      estimated_fare: estimatedFare,
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
