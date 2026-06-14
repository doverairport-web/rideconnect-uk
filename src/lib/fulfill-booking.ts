import {
  canCreateAirtableBooking,
  createAirtableBooking,
  findBookingBySquarePaymentId,
  isPrimarySquarePaymentBooking,
  shouldReviewWebBooking,
  type WebBookingInput,
} from "@/lib/booking";
import { saveBookingViaDispatch } from "@/lib/dispatch-save";
import { buildFareEstimate } from "@/lib/fare-estimate";
import { canSendBookingEmail, sendBookingEmails } from "@/lib/notify";
import { dispatchPassengerFulfillUrl, dispatchPaymentSecret } from "@/lib/payment-proxy";

export type CardPaymentInfo = {
  amountPaid: number;
  sessionId: string;
};

export type FulfillBookingResult = {
  ok: boolean;
  recordId?: string;
  emailSent: boolean;
  bookingSaved: boolean;
  needsReview: boolean;
  estimatedFare: number | null;
  warnings: string[];
  error?: string;
};

export async function fulfillWebBooking(
  booking: WebBookingInput,
  options?: {
    estimatedFare?: number | null;
    cardPayment?: CardPaymentInfo;
  },
): Promise<FulfillBookingResult> {
  const errors: string[] = [];
  let recordId: string | undefined;
  let emailSent = false;
  let bookingSaved = false;

  let estimatedFare = options?.estimatedFare ?? null;

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

  const bookingWithPayment: WebBookingInput = {
    ...booking,
    payment_method: options?.cardPayment ? "card" : booking.payment_method,
    notes: [
      booking.notes?.trim(),
      options?.cardPayment
        ? `Card paid online (Square): £${options.cardPayment.amountPaid.toFixed(2)} (${options.cardPayment.sessionId})`
        : null,
    ]
      .filter(Boolean)
      .join("\n"),
  };

  if (options?.cardPayment?.sessionId) {
    const existingId = await findBookingBySquarePaymentId(options.cardPayment.sessionId);
    if (existingId) {
      return {
        ok: true,
        recordId: existingId,
        emailSent: false,
        bookingSaved: true,
        needsReview: shouldReviewWebBooking(booking),
        estimatedFare,
        warnings: [],
      };
    }
  }

  let cardHandledByDispatch = false;

  if (!bookingSaved) {
    try {
      const secret = dispatchPaymentSecret();
      if (options?.cardPayment && secret) {
        const fulfillResponse = await fetch(dispatchPassengerFulfillUrl(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${secret}`,
          },
          body: JSON.stringify({
            booking: bookingWithPayment,
            estimated_fare: estimatedFare ?? options.cardPayment.amountPaid,
            cardPayment: options.cardPayment,
          }),
        });
        const fulfillData = (await fulfillResponse.json()) as {
          ok?: boolean;
          record_id?: string;
          customer_email_sent?: boolean;
          error?: string;
        };
        if (!fulfillResponse.ok || !fulfillData.ok || !fulfillData.record_id) {
          throw new Error(fulfillData.error ?? "Dispatch card fulfill failed.");
        }
        recordId = fulfillData.record_id;
        bookingSaved = true;
        cardHandledByDispatch = true;
        emailSent = fulfillData.customer_email_sent === true;
      } else {
        const saved = await saveBookingViaDispatch(bookingWithPayment, estimatedFare, {
          squarePaymentId: options?.cardPayment?.sessionId,
        });
        recordId = saved.recordId;
        bookingSaved = Boolean(saved.recordId);
        if (bookingSaved && !saved.created) {
          return {
            ok: true,
            recordId,
            emailSent: false,
            bookingSaved: true,
            needsReview: shouldReviewWebBooking(booking),
            estimatedFare,
            warnings: [],
          };
        }
      }
    } catch (error) {
      errors.push(
        error instanceof Error ? error.message : "Could not save booking to dispatch.",
      );
    }
  }

  if (!bookingSaved && canCreateAirtableBooking()) {
    try {
      const airtable = await createAirtableBooking(bookingWithPayment, estimatedFare);
      recordId = airtable.records?.[0]?.id;
      bookingSaved = true;
    } catch (error) {
      errors.push(
        error instanceof Error ? error.message : "Could not save booking to dispatch.",
      );
    }
  }

  if (bookingSaved && canSendBookingEmail() && !emailSent && !cardHandledByDispatch) {
    const paymentId = options?.cardPayment?.sessionId?.trim();
    const shouldSend =
      !paymentId ||
      !recordId ||
      (await isPrimarySquarePaymentBooking(paymentId, recordId));

    if (shouldSend) {
      try {
        const emailResult = await sendBookingEmails(bookingWithPayment, estimatedFare);
        const wantsCustomerEmail = Boolean(booking.email?.trim());
        emailSent =
          emailResult.dispatchSent && (!wantsCustomerEmail || emailResult.customerSent);
        errors.push(...emailResult.errors);
      } catch (error) {
        errors.push(
          error instanceof Error ? error.message : "Could not send booking email.",
        );
      }
    }
  }

  if (!bookingSaved) {
    return {
      ok: false,
      emailSent,
      bookingSaved: false,
      needsReview: shouldReviewWebBooking(booking),
      estimatedFare,
      warnings: errors,
      error:
        "Could not save your booking. Please call 01304 350125 or 01304 208208.",
    };
  }

  return {
    ok: true,
    recordId,
    emailSent,
    bookingSaved,
    needsReview: shouldReviewWebBooking(booking),
    estimatedFare,
    warnings: errors,
  };
}
