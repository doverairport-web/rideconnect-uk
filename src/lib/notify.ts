import type { WebBookingInput } from "@/lib/booking";
import {
  customerConfirmationBody,
  customerConfirmationSubject,
  dispatchBookingSubject,
  dispatchNotificationBody,
  isCustomerEmail,
} from "@/lib/booking-emails";
import {
  dispatchEmail,
  emailFromAddress,
  smtpTransportConfigs,
  smtpTransportOptions,
} from "@/lib/smtp";

const DISPATCH_EMAIL = dispatchEmail();
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

export function canSendBookingEmail(): boolean {
  return Boolean(
    RESEND_API_KEY ||
      (SMTP_USER && SMTP_PASS) ||
      WEB3FORMS_ACCESS_KEY,
  );
}

export async function sendPlainEmail(options: {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  if (RESEND_API_KEY) {
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
      throw new Error(`Email send failed: ${response.status} ${body}`);
    }
    return;
  }

  if (SMTP_USER && SMTP_PASS) {
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

  if (WEB3FORMS_ACCESS_KEY) {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: options.subject,
        from_name: "RideConnect UK",
        email: options.replyTo || DISPATCH_EMAIL,
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

export async function sendBookingEmails(
  booking: WebBookingInput,
  estimatedFare?: number | null,
): Promise<BookingEmailResult> {
  if (!canSendBookingEmail()) {
    throw new Error(
      "Email is not configured. Add SMTP_USER + SMTP_PASS (123 Reg) in Vercel, or RESEND_API_KEY.",
    );
  }

  const errors: string[] = [];
  let dispatchSent = false;
  let customerSent = false;

  const dispatchSummary = dispatchNotificationBody(booking, estimatedFare);

  try {
    if (WEB3FORMS_ACCESS_KEY && !SMTP_USER && !SMTP_PASS && !RESEND_API_KEY) {
      await sendViaWeb3FormsDispatch(booking, dispatchSummary);
    } else {
      await sendPlainEmail({
        to: DISPATCH_EMAIL,
        subject: dispatchBookingSubject(booking),
        text: dispatchSummary,
        replyTo: booking.email,
      });
    }
    dispatchSent = true;
  } catch (error) {
    errors.push(
      error instanceof Error ? error.message : "Could not send dispatch email.",
    );
  }

  if (isCustomerEmail(booking.email)) {
    try {
      await sendPlainEmail({
        to: booking.email.trim(),
        subject: customerConfirmationSubject(booking),
        text: customerConfirmationBody(booking, estimatedFare),
        replyTo: DISPATCH_EMAIL,
      });
      customerSent = true;
    } catch (error) {
      errors.push(
        error instanceof Error
          ? error.message
          : "Could not send customer confirmation email.",
      );
    }
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
