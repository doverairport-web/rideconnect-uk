import {
  customerConfirmationBody,
  customerConfirmationSubject,
  isCustomerEmail,
} from "@/lib/booking-emails";
import type { WebBookingInput } from "@/lib/booking";
import { withBookingEmailIdempotency } from "@/lib/booking-email-send-log";
import {
  dispatchPaymentSecret,
  dispatchSquareClaimUrl,
} from "@/lib/payment-proxy";
import {
  dispatchEmail,
  emailFromAddress,
  smtpTransportConfigs,
  smtpTransportOptions,
} from "@/lib/smtp";

const SMTP_USER = () => process.env.SMTP_USER?.trim();
const SMTP_PASS = () => process.env.SMTP_PASS?.trim();
const RESEND_API_KEY = () => process.env.RESEND_API_KEY?.trim();

export function canSendCustomerEmail(): boolean {
  return Boolean(RESEND_API_KEY() || (SMTP_USER() && SMTP_PASS()));
}

async function sendPlainEmail(options: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const resendKey = RESEND_API_KEY();
  if (resendKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFromAddress(),
        to: [options.to],
        subject: options.subject,
        text: options.text,
        reply_to: options.replyTo ?? dispatchEmail(),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Email send failed: ${response.status} ${body}`);
    }
    return;
  }

  const user = SMTP_USER();
  const pass = SMTP_PASS();
  if (user && pass) {
    const nodemailer = await import("nodemailer");
    let lastError: Error | null = null;

    for (const config of smtpTransportConfigs()) {
      const transporter = nodemailer.createTransport(
        smtpTransportOptions(user, pass, config),
      );

      try {
        await transporter.sendMail({
          from: emailFromAddress(),
          to: options.to,
          replyTo: options.replyTo ?? dispatchEmail(),
          subject: options.subject,
          text: options.text,
        });
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("SMTP send failed.");
      }
    }

    throw lastError ?? new Error("SMTP send failed.");
  }

  throw new Error("Email is not configured.");
}

async function legacySquarePaymentEmailClaim(paymentId: string): Promise<boolean> {
  const secret = dispatchPaymentSecret();
  if (!secret) return true;

  const claimResponse = await fetch(dispatchSquareClaimUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({ payment_id: paymentId, kind: "email" }),
  });
  const claimData = (await claimResponse.json()) as { proceed?: boolean };
  return claimResponse.ok && claimData.proceed === true;
}

export async function sendCustomerBookingConfirmation(
  booking: WebBookingInput,
  estimatedFare?: number | null,
  options?: { squarePaymentId?: string; bookingId?: string },
): Promise<{ sent: boolean; skipped?: boolean; error?: string }> {
  if (!isCustomerEmail(booking.email)) {
    return { sent: false, error: "No valid customer email." };
  }

  const paymentId = options?.squarePaymentId?.trim();
  if (paymentId && !options?.bookingId?.trim()) {
    const claimed = await legacySquarePaymentEmailClaim(paymentId);
    if (!claimed) {
      return {
        sent: false,
        skipped: true,
        error: "Confirmation email already sent for this payment.",
      };
    }
  }

  if (!canSendCustomerEmail()) {
    return { sent: false, error: "Email is not configured on the server." };
  }

  const result = await withBookingEmailIdempotency(
    {
      bookingId: options?.bookingId,
      emailType: "customer_confirmation",
      fallbackKey: paymentId,
    },
    async () => {
      await sendPlainEmail({
        to: booking.email!.trim(),
        subject: customerConfirmationSubject(booking),
        text: customerConfirmationBody(booking, estimatedFare),
        replyTo: dispatchEmail(),
      });
    },
  );

  if (result.skipped) {
    return {
      sent: false,
      skipped: true,
      error: result.error ?? "Confirmation email already sent for this booking.",
    };
  }

  return {
    sent: result.sent,
    error: result.error,
  };
}
