import {
  canCreateAirtableBooking,
  createAirtableBooking,
  findBookingBySquarePaymentId,
  isPrimarySquarePaymentBooking,
  shouldReviewWebBooking,
  type WebBookingInput,
} from "@/lib/booking";
import { saveBookingViaDispatch } from "@/lib/dispatch-save";
import type { BookingSourceMeta } from "@/lib/booking-source";
import { buildFareEstimate } from "@/lib/fare-estimate";
import {
  canSendBookingEmail,
  sendDispatchNotification,
} from "@/lib/notify";
import { sendCustomerBookingConfirmation } from "@/lib/customer-booking-notify";
import { dispatchPassengerFulfillUrl, dispatchPaymentSecret } from "@/lib/payment-proxy";

export type CardPaymentInfo = {
  amountPaid: number;
  sessionId: string;
};

export type FulfillBookingResult = {
  ok: boolean;
  recordId?: string;
  emailSent: boolean;
  dispatchNotified: boolean;
  bookingSaved: boolean;
  needsReview: boolean;
  estimatedFare: number | null;
  warnings: string[];
  error?: string;
};

function logFulfillWarnings(booking: WebBookingInput, warnings: string[]): void {
  if (warnings.length === 0) return;
  console.error("[booking-fulfill] Completed with warnings", {
    customer: booking.customer_name,
    phone: booking.phone,
    pickup: booking.pickup,
    destination: booking.destination,
    warnings,
  });
}

export async function fulfillWebBooking(
  booking: WebBookingInput,
  options?: {
    estimatedFare?: number | null;
    cardPayment?: CardPaymentInfo;
    source?: BookingSourceMeta;
    serviceType?: "standard" | "airport_transfer" | "cruise_transfer";
  },
): Promise<FulfillBookingResult> {
  const errors: string[] = [];
  let recordId: string | undefined;
  let emailSent = false;
  let dispatchNotified = false;
  let bookingSaved = false;

  let estimatedFare = options?.estimatedFare ?? null;

  if (estimatedFare == null) {
    try {
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
    } catch (error) {
      // Never block fulfill/save for fare estimate failures (esp. after Square charge).
      console.error(
        "[booking-fulfill] Fare estimate failed (continuing without estimate):",
        error instanceof Error ? error.message : error,
      );
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
        dispatchNotified: false,
        bookingSaved: true,
        needsReview: shouldReviewWebBooking(booking),
        estimatedFare,
        warnings: [],
      };
    }
  }

  let customerEmailFromDispatch = false;
  let dispatchNotifiedByApi = false;

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
          dispatch_email_sent?: boolean;
          error?: string;
        };
        if (!fulfillResponse.ok || !fulfillData.ok || !fulfillData.record_id) {
          throw new Error(fulfillData.error ?? "Dispatch card fulfill failed.");
        }
        recordId = fulfillData.record_id;
        bookingSaved = true;
        customerEmailFromDispatch = fulfillData.customer_email_sent === true;
        dispatchNotifiedByApi = fulfillData.dispatch_email_sent === true;
        emailSent = customerEmailFromDispatch;
      } else {
        const saved = await saveBookingViaDispatch(bookingWithPayment, estimatedFare, {
          squarePaymentId: options?.cardPayment?.sessionId,
          source: options?.source,
          serviceType: options?.serviceType,
        });
        recordId = saved.recordId;
        bookingSaved = Boolean(saved.recordId);
        dispatchNotifiedByApi = saved.dispatchEmailSent === true;
        customerEmailFromDispatch = saved.customerEmailSent === true;
        emailSent = customerEmailFromDispatch;
        if (bookingSaved && !saved.created) {
          return {
            ok: true,
            recordId,
            emailSent: false,
            dispatchNotified: dispatchNotifiedByApi,
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

  if (bookingSaved && canSendBookingEmail() && recordId) {
    const paymentId = options?.cardPayment?.sessionId?.trim();
    const shouldSend =
      !paymentId || (await isPrimarySquarePaymentBooking(paymentId, recordId));

    if (shouldSend) {
      try {
        if (!dispatchNotifiedByApi) {
          const adminResult = await sendDispatchNotification(
            bookingWithPayment,
            estimatedFare,
            { bookingId: recordId, fallbackKey: paymentId },
          );
          dispatchNotified = adminResult.dispatchSent;
          errors.push(...adminResult.errors);
        } else {
          dispatchNotified = true;
        }

        if (!customerEmailFromDispatch && bookingWithPayment.email) {
          const customerResult = await sendCustomerBookingConfirmation(
            bookingWithPayment,
            estimatedFare,
            { bookingId: recordId, squarePaymentId: paymentId },
          );
          if (customerResult.sent) emailSent = true;
          if (customerResult.error && !customerResult.skipped) {
            errors.push(`Customer confirmation: ${customerResult.error}`);
          }
        }
      } catch (error) {
        errors.push(
          error instanceof Error ? error.message : "Could not send booking email.",
        );
      }
    }
  }

  if (!bookingSaved) {
    logFulfillWarnings(bookingWithPayment, errors);
    return {
      ok: false,
      emailSent,
      dispatchNotified,
      bookingSaved: false,
      needsReview: shouldReviewWebBooking(booking),
      estimatedFare,
      warnings: errors,
      error:
        "Could not save your booking. Please call 01304 350125 or 01304 208208.",
    };
  }

  logFulfillWarnings(bookingWithPayment, errors);

  return {
    ok: true,
    recordId,
    emailSent,
    dispatchNotified,
    bookingSaved,
    needsReview: shouldReviewWebBooking(booking),
    estimatedFare,
    warnings: errors,
  };
}
