import { NextResponse } from "next/server";
import { parseWebBookingBody } from "@/lib/booking";
import { fulfillWebBooking } from "@/lib/fulfill-booking";

export async function POST(request: Request) {
  try {
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

    const clientFare = Number(body.estimated_fare);
    const estimatedFare =
      Number.isFinite(clientFare) && clientFare > 0 ? clientFare : undefined;

    const result = await fulfillWebBooking(booking, { estimatedFare });

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Booking received. Our dispatch team will confirm your journey.",
      record_id: result.recordId,
      email_sent: result.emailSent,
      booking_saved: result.bookingSaved,
      needs_review: result.needsReview,
      estimated_fare: result.estimatedFare ?? null,
      ...(result.warnings.length ? { warnings: result.warnings } : {}),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
