import { HOMEKENT_EMAIL, HOMEKENT_NAME } from "@/lib/homekent/brand";
import {
  smtpFromAddress,
  smtpTransportConfigs,
  smtpTransportOptions,
} from "@/lib/smtp";

export function homekentSmtpConfigured(): boolean {
  return Boolean(
    process.env.HOMEKENT_SMTP_USER?.trim() &&
      process.env.HOMEKENT_SMTP_PASS?.trim(),
  );
}

export async function sendHomekentEmail(options: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const smtpUser = process.env.HOMEKENT_SMTP_USER?.trim();
  const smtpPass = process.env.HOMEKENT_SMTP_PASS?.trim();
  if (!smtpUser || !smtpPass) {
    throw new Error("HomeKent email is not configured on the server.");
  }

  const preferredFrom =
    process.env.HOMEKENT_EMAIL_FROM?.trim() ||
    `HomeKent <${HOMEKENT_EMAIL}>`;
  const from = smtpFromAddress(smtpUser, HOMEKENT_NAME, preferredFrom);
  const host =
    process.env.HOMEKENT_SMTP_HOST?.trim() || "smtpout.secureserver.net";
  const port = process.env.HOMEKENT_SMTP_PORT?.trim();
  const configs =
    port === "587"
      ? [{ port: 587, secure: false, requireTLS: true as const }]
      : port === "465"
        ? [{ port: 465, secure: true as const }]
        : smtpTransportConfigs();

  const nodemailer = await import("nodemailer");
  let lastError: Error | null = null;

  for (const config of configs) {
    const transporter = nodemailer.createTransport(
      smtpTransportOptions(smtpUser, smtpPass, config, host),
    );

    try {
      await transporter.sendMail({
        from,
        to: options.to,
        replyTo: options.replyTo,
        subject: options.subject,
        text: options.text,
      });
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("SMTP send failed");
    }
  }

  throw lastError ?? new Error("SMTP send failed");
}
