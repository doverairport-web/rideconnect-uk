import { NextResponse } from "next/server";
import type { WebBookingInput } from "@/lib/booking";
import { sendCustomerBookingConfirmation } from "@/lib/customer-booking-notify";
import { verifyDispatchPaymentAuth } from "@/lib/payment-proxy";
type SendBody = {
  booking?: WebBookingInput;
  estimated_fare?: number | null;
  square_payment_id?: string;
  booking_id?: string;
};

export async function POST(request: Request) {
  if (!verifyDispatchPaymentAuth(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SendBody;
    const booking = body.booking;

    if (!booking?.customer_name?.trim() || !booking.pickup_date?.trim() || !booking.pickup_time?.trim()) {
      return NextResponse.json({ ok: false, error: "Missing booking fields." }, { status: 400 });
    }

    const result = await sendCustomerBookingConfirmation(
      booking,
      body.estimated_fare ?? null,
      {
        squarePaymentId: body.square_payment_id,
        bookingId: body.booking_id,
      },
    );
    return NextResponse.json({
      ok: true,
      sent: result.sent,
      error: result.error,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Could not send email.",
      },
      { status: 500 },
    );
  }
}
