import type { WebBookingInput } from "@/lib/booking";
import {
  dispatchBookingSubject,
  dispatchNotificationBody,
  isCustomerEmail,
} from "@/lib/booking-emails";
import { withBookingEmailIdempotency } from "@/lib/booking-email-send-log";
import {
  dispatchEmail,
  emailFromAddress,
  smtpTransportConfigs,
  smtpTransportOptions,
} from "@/lib/smtp";

const SMTP_USER = process.env.SMTP_USER?.trim();
const SMTP_PASS = process.env.SMTP_PASS?.trim();
const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY?.trim();
const EMAIL_FROM = emailFromAddress();

export type BookingEmailResult = {
  dispatchSent: boolean;
  customerSent: boolean;
  errors: string[];
};

type MailPayload = {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
};

export function canSendBookingEmail(): boolean {
  return Boolean(
    RESEND_API_KEY ||
      (SMTP_USER && SMTP_PASS) ||
      WEB3FORMS_ACCESS_KEY,
  );
}

function hasSmtp(): boolean {
  return Boolean(SMTP_USER && SMTP_PASS);
}

function hasResend(): boolean {
  return Boolean(RESEND_API_KEY);
}

async function sendViaResend(options: MailPayload): Promise<void> {
  if (!RESEND_API_KEY) {
    throw new Error("Resend is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      text: options.text,
      reply_to: options.replyTo,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend failed: ${response.status} ${body}`);
  }
}

async function sendViaSmtpOnly(options: MailPayload): Promise<void> {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP is not configured.");
  }

  const nodemailer = await import("nodemailer");
  let lastError: Error | null = null;

  for (const config of smtpTransportConfigs()) {
    const transporter = nodemailer.createTransport(
      smtpTransportOptions(SMTP_USER, SMTP_PASS, config),
    );

    try {
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: options.to,
        replyTo: options.replyTo,
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

export async function sendPlainEmail(options: MailPayload): Promise<void> {
  if (hasResend()) {
    await sendViaResend(options);
    return;
  }

  if (hasSmtp()) {
    await sendViaSmtpOnly(options);
    return;
  }

  if (WEB3FORMS_ACCESS_KEY) {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: options.subject,
        from_name: "RideConnect UK",
        email: options.replyTo || dispatchEmail(),
        message: options.text,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Web3Forms email failed.");
    }
    return;
  }

  throw new Error(
    "Email is not configured. Add SMTP_USER + SMTP_PASS (123 Reg) in Vercel, or RESEND_API_KEY.",
  );
}

async function sendViaWeb3FormsDispatch(
  booking: WebBookingInput,
  summary: string,
): Promise<void> {
  if (!WEB3FORMS_ACCESS_KEY) return;

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: dispatchBookingSubject(booking),
      from_name: "RideConnect UK",
      name: booking.customer_name,
      phone: booking.phone,
      email: booking.email || "",
      pickup: booking.pickup,
      destination: booking.destination,
      date: booking.pickup_date,
      time: booking.pickup_time,
      message: summary,
    }),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Web3Forms email failed.");
  }
}

function logAdminEmailFailure(
  booking: WebBookingInput,
  to: string,
  stage: string,
  error: string,
): void {
  console.error("[booking-email] Admin notification failed", {
    stage,
    to,
    error,
    customer: booking.customer_name,
    phone: booking.phone,
    pickup: booking.pickup,
    destination: booking.destination,
    when: `${booking.pickup_date} ${booking.pickup_time}`,
  });
}

/** Send dispatch alert only — no idempotency (used by dispatch proxy after outer claim). */
export async function deliverDispatchNotification(
  booking: WebBookingInput,
  estimatedFare?: number | null,
): Promise<void> {
  const to = dispatchEmail();
  const subject = dispatchBookingSubject(booking);
  const text = dispatchNotificationBody(booking, estimatedFare);
  const mail: MailPayload = {
    to,
    subject,
    text,
    replyTo: booking.email,
  };

  if (WEB3FORMS_ACCESS_KEY && !hasSmtp() && !hasResend()) {
    await sendViaWeb3FormsDispatch(booking, text);
    return;
  }

  try {
    if (hasResend()) {
      await sendViaResend(mail);
    } else {
      await sendViaSmtpOnly(mail);
    }
  } catch (primaryError) {
    if (hasResend() && hasSmtp()) {
      await sendViaSmtpOnly(mail);
      console.info("[booking-email] Admin notification sent via SMTP fallback", {
        to,
        customer: booking.customer_name,
      });
      return;
    }
    throw primaryError;
  }
}

/** Admin/dispatch alert with Resend → SMTP fallback (avoids silent info@→info@ Resend failures). */
export async function sendDispatchNotification(
  booking: WebBookingInput,
  estimatedFare?: number | null,
  options?: { bookingId?: string; fallbackKey?: string },
): Promise<Pick<BookingEmailResult, "dispatchSent" | "errors">> {
  const errors: string[] = [];
  const to = dispatchEmail();

  const idempotent = await withBookingEmailIdempotency(
    {
      bookingId: options?.bookingId,
      emailType: "dispatch_notification",
      fallbackKey: options?.fallbackKey,
    },
    () => deliverDispatchNotification(booking, estimatedFare),
  );

  if (idempotent.skipped) {
    return { dispatchSent: true, errors };
  }

  if (idempotent.sent) {
    return { dispatchSent: true, errors };
  }

  const message = idempotent.error ?? "Could not send dispatch email.";
  errors.push(`Admin alert: ${message}`);
  logAdminEmailFailure(booking, to, "idempotent", message);
  return { dispatchSent: false, errors };
}

export async function sendBookingEmails(
  booking: WebBookingInput,
  estimatedFare?: number | null,
  options?: { bookingId?: string; squarePaymentId?: string },
): Promise<BookingEmailResult> {
  if (!canSendBookingEmail()) {
    throw new Error(
      "Email is not configured. Add SMTP_USER + SMTP_PASS (123 Reg) in Vercel, or RESEND_API_KEY.",
    );
  }

  const errors: string[] = [];
  const { sendCustomerBookingConfirmation } = await import("@/lib/customer-booking-notify");

  const dispatchResult = await sendDispatchNotification(booking, estimatedFare, {
    bookingId: options?.bookingId,
    fallbackKey: options?.squarePaymentId,
  });
  const dispatchSent = dispatchResult.dispatchSent;
  errors.push(...dispatchResult.errors);

  let customerSent = false;
  if (isCustomerEmail(booking.email)) {
    const customerResult = await sendCustomerBookingConfirmation(booking, estimatedFare, {
      bookingId: options?.bookingId,
      squarePaymentId: options?.squarePaymentId,
    });
    customerSent = customerResult.sent;
    if (customerResult.error && !customerResult.skipped) {
      errors.push(`Customer confirmation: ${customerResult.error}`);
    }
  }

  if (!dispatchSent) {
    console.error("[booking-email] Booking saved but admin was not notified", {
      customer: booking.customer_name,
      phone: booking.phone,
      adminTo: dispatchEmail(),
      customerSent,
      errors,
    });
  }

  return { dispatchSent, customerSent, errors };
}

/** @deprecated Use sendBookingEmails */
export async function sendBookingEmail(
  booking: WebBookingInput,
  estimatedFare?: number | null,
): Promise<void> {
  const result = await sendBookingEmails(booking, estimatedFare);
  if (!result.dispatchSent) {
    throw new Error(result.errors[0] || "Could not send booking email.");
  }
}
