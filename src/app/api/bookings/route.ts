import { NextResponse } from "next/server";
import { parseWebBookingBody } from "@/lib/booking";
import { requestBookingSource, serviceTypeFromTripType } from "@/lib/booking-source";
import { fulfillWebBooking } from "@/lib/fulfill-booking";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
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

    const source = requestBookingSource(request, body);
    const clientFare = Number(body.estimated_fare);
    const estimatedFare =
      Number.isFinite(clientFare) && clientFare > 0 ? clientFare : undefined;

    const serviceRaw = String(body.service_type ?? body.trip_type ?? "");
    const serviceType =
      serviceRaw === "airport_transfer" || serviceRaw === "airport"
        ? "airport_transfer"
        : serviceRaw === "cruise_transfer" || serviceRaw === "cruise"
          ? "cruise_transfer"
          : serviceRaw === "standard" || serviceRaw === "local"
            ? "standard"
            : undefined;

    const result = await fulfillWebBooking(booking, {
      estimatedFare,
      source,
      serviceType,
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Booking received. Our dispatch team will confirm your journey.",
      record_id: result.recordId,
      booking_id: result.recordId,
      email_sent: result.emailSent,
      dispatch_notified: result.dispatchNotified,
      booking_saved: result.bookingSaved,
      needs_review: result.needsReview,
      estimated_fare: result.estimatedFare ?? null,
      source_domain: source.sourceDomain,
      source_app: source.sourceApp,
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
