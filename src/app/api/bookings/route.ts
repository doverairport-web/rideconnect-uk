import { NextResponse } from "next/server";
import {
  createAirtableBooking,
  parseWebBookingBody,
  shouldReviewWebBooking,
} from "@/lib/booking";

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

    const airtable = await createAirtableBooking(booking);
    const record = airtable.records?.[0];

    return NextResponse.json({
      ok: true,
      message: "Booking received. Our dispatch team will confirm your journey.",
      record_id: record?.id,
      needs_review: shouldReviewWebBooking(booking),
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
