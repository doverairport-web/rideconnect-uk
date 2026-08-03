import { NextResponse } from "next/server";
import type { WebBookingInput } from "@/lib/booking";
import { deliverDispatchNotification } from "@/lib/notify";
import { verifyDispatchPaymentAuth } from "@/lib/payment-proxy";

type SendBody = {
  booking?: WebBookingInput;
  estimated_fare?: number | null;
  booking_id?: string;
  source_domain?: string;
};

export async function POST(request: Request) {
  if (!verifyDispatchPaymentAuth(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SendBody;
    const booking = body.booking;

    if (
      !booking?.customer_name?.trim() ||
      !booking.phone?.trim() ||
      !booking.pickup?.trim() ||
      !booking.destination?.trim() ||
      !booking.pickup_date?.trim() ||
      !booking.pickup_time?.trim()
    ) {
      return NextResponse.json({ ok: false, error: "Missing booking fields." }, { status: 400 });
    }

    const enriched: WebBookingInput = {
      ...booking,
      notes: [
        booking.notes?.trim(),
        body.source_domain ? `Source: ${body.source_domain}` : null,
        body.booking_id ? `Booking ID: ${body.booking_id}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    };

    await deliverDispatchNotification(enriched, body.estimated_fare ?? null);
    return NextResponse.json({
      ok: true,
      sent: true,
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        sent: false,
        error: error instanceof Error ? error.message : "Could not send booking email.",
      },
      { status: 500 },
    );
  }
}
