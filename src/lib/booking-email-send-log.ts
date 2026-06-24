import { randomUUID } from "crypto";
import { del, list, put } from "@vercel/blob";

/** Per-key blobs avoid lost updates when dispatch + customer emails claim concurrently. */
const BLOB_PREFIX = "rideconnect/booking-email-keys";
export const PENDING_TTL_MS = 5 * 60 * 1000;
export const SENT_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const CLAIM_VERIFY_ATTEMPTS = 8;
const IN_PROGRESS_WAIT_MS = 12_000;

export type BookingEmailType = "customer_confirmation" | "dispatch_notification";

export type EmailSendLogEvent =
  | "email_send_attempt"
  | "email_send_success"
  | "email_send_skipped_duplicate"
  | "email_send_failed";

type SendLogStore = {
  sends: Record<string, string>;
};

export function emailSendLogKey(bookingId: string, emailType: BookingEmailType): string {
  return `${bookingId.trim()}:${emailType}`;
}

export function fallbackEmailSendLogKey(
  fallbackKey: string,
  emailType: BookingEmailType,
): string {
  return `fallback:${fallbackKey.trim()}:${emailType}`;
}

export function isBookingEmailSendLogConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function logEmailSendEvent(
  event: EmailSendLogEvent,
  details: Record<string, unknown>,
): void {
  console.info(`[booking-email] ${event}`, details);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function entryTimestamp(raw: string | undefined): number {
  if (!raw || raw === "sent") return NaN;
  const body = raw.startsWith("failed:") ? raw.slice("failed:".length) : raw;
  const at = Number(body.split(":")[0]);
  return Number.isFinite(at) ? at : NaN;
}

export function isPendingEntry(raw: string | undefined, now = Date.now()): boolean {
  if (!raw || raw === "sent" || raw.startsWith("failed:")) return false;
  const at = entryTimestamp(raw);
  return Number.isFinite(at) && now - at < PENDING_TTL_MS;
}

/** @deprecated Legacy JSON store — kept for unit tests only. */
export function pruneSendLogStore(store: SendLogStore, now = Date.now()): void {
  for (const [key, raw] of Object.entries(store.sends)) {
    if (raw === "sent") continue;
    if (raw.startsWith("failed:")) {
      const at = entryTimestamp(raw.slice("failed:".length));
      if (!Number.isFinite(at) || now - at > PENDING_TTL_MS) {
        delete store.sends[key];
      }
      continue;
    }
    const at = entryTimestamp(raw);
    if (!Number.isFinite(at) || now - at > SENT_TTL_MS) {
      delete store.sends[key];
    }
  }
}

function blobPathForLogKey(logKey: string): string {
  const safe = logKey.trim().replace(/:/g, "--").replace(/\//g, "_");
  return `${BLOB_PREFIX}/${encodeURIComponent(safe)}.txt`;
}

async function readLogEntry(logKey: string): Promise<string | undefined> {
  if (!isBookingEmailSendLogConfigured()) return undefined;

  try {
    const path = blobPathForLogKey(logKey);
    const { blobs } = await list({ prefix: path, limit: 1 });
    const blob = blobs[0];
    if (!blob?.url) return undefined;

    const response = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return undefined;

    const text = (await response.text()).trim();
    return text || undefined;
  } catch {
    return undefined;
  }
}

async function writeLogEntry(logKey: string, value: string): Promise<void> {
  await put(blobPathForLogKey(logKey), value, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "text/plain",
  });
}

async function deleteLogEntry(logKey: string): Promise<void> {
  try {
    await del(blobPathForLogKey(logKey));
  } catch {
    /* ignore */
  }
}

export type EmailSendClaimResult =
  | { action: "proceed"; token: string }
  | { action: "already_sent" }
  | { action: "in_progress" };

export async function claimBookingEmailSend(
  logKey: string,
): Promise<EmailSendClaimResult> {
  const key = logKey.trim();
  if (!key) return { action: "proceed", token: "anonymous" };

  if (!isBookingEmailSendLogConfigured()) {
    console.warn("[booking-email] BLOB_READ_WRITE_TOKEN missing — email idempotency disabled");
    return { action: "proceed", token: "unconfigured" };
  }

  const token = `${Date.now()}:${randomUUID()}`;

  for (let attempt = 0; attempt < CLAIM_VERIFY_ATTEMPTS; attempt++) {
    const existing = await readLogEntry(key);
    if (existing === "sent") return { action: "already_sent" };
    if (isPendingEntry(existing)) return { action: "in_progress" };

    try {
      await writeLogEntry(key, token);
      const verify = await readLogEntry(key);
      if (verify === token) return { action: "proceed", token };
    } catch {
      /* retry */
    }
    await sleep(40 + attempt * 80);
  }

  return { action: "in_progress" };
}

export async function markBookingEmailSendSuccess(
  logKey: string,
  token: string,
): Promise<void> {
  const key = logKey.trim();
  if (!key || token === "anonymous" || token === "unconfigured") return;
  if (!isBookingEmailSendLogConfigured()) return;

  for (let attempt = 0; attempt < CLAIM_VERIFY_ATTEMPTS; attempt++) {
    const existing = await readLogEntry(key);
    if (existing === "sent") return;
    if (existing && existing !== token) return;

    try {
      await writeLogEntry(key, "sent");
      const verify = await readLogEntry(key);
      if (verify === "sent") return;
    } catch {
      /* retry */
    }
    await sleep(40 + attempt * 80);
  }
}

export async function releaseBookingEmailSendClaim(
  logKey: string,
  token: string,
): Promise<void> {
  const key = logKey.trim();
  if (!key || token === "anonymous" || token === "unconfigured") return;
  if (!isBookingEmailSendLogConfigured()) return;

  for (let attempt = 0; attempt < CLAIM_VERIFY_ATTEMPTS; attempt++) {
    const existing = await readLogEntry(key);
    if (existing === "sent") return;
    if (existing !== token) return;

    try {
      await deleteLogEntry(key);
      return;
    } catch {
      await sleep(40 + attempt * 80);
    }
  }
}

async function waitForPeerEmailSend(logKey: string): Promise<"sent" | "timeout"> {
  const started = Date.now();
  while (Date.now() - started < IN_PROGRESS_WAIT_MS) {
    const existing = await readLogEntry(logKey);
    if (existing === "sent") return "sent";
    if (!isPendingEntry(existing)) return "timeout";
    await sleep(400);
  }
  return "timeout";
}

export async function withBookingEmailIdempotency(
  params: {
    bookingId?: string;
    emailType: BookingEmailType;
    fallbackKey?: string;
  },
  sendFn: () => Promise<void>,
): Promise<{ sent: boolean; skipped: boolean; error?: string }> {
  const logKey =
    params.bookingId?.trim()
      ? emailSendLogKey(params.bookingId, params.emailType)
      : params.fallbackKey?.trim()
        ? fallbackEmailSendLogKey(params.fallbackKey, params.emailType)
        : "";

  logEmailSendEvent("email_send_attempt", {
    bookingId: params.bookingId ?? null,
    emailType: params.emailType,
    logKey: logKey || null,
    fallbackKey: params.fallbackKey ?? null,
  });

  let claim = await claimBookingEmailSend(logKey);

  if (claim.action === "already_sent") {
    logEmailSendEvent("email_send_skipped_duplicate", {
      bookingId: params.bookingId ?? null,
      emailType: params.emailType,
      logKey: logKey || null,
      reason: "already_sent",
    });
    return { sent: true, skipped: true };
  }

  if (claim.action === "in_progress") {
    const peer = await waitForPeerEmailSend(logKey);
    if (peer === "sent") {
      logEmailSendEvent("email_send_skipped_duplicate", {
        bookingId: params.bookingId ?? null,
        emailType: params.emailType,
        logKey: logKey || null,
        reason: "peer_completed",
      });
      return { sent: true, skipped: true };
    }

    claim = await claimBookingEmailSend(logKey);
    if (claim.action === "already_sent") {
      return { sent: true, skipped: true };
    }
    if (claim.action === "in_progress") {
      logEmailSendEvent("email_send_skipped_duplicate", {
        bookingId: params.bookingId ?? null,
        emailType: params.emailType,
        logKey: logKey || null,
        reason: "in_progress",
      });
      return {
        sent: false,
        skipped: true,
        error: "Email send already in progress.",
      };
    }
  }

  try {
    await sendFn();
    await markBookingEmailSendSuccess(logKey, claim.token);
    logEmailSendEvent("email_send_success", {
      bookingId: params.bookingId ?? null,
      emailType: params.emailType,
      logKey: logKey || null,
    });
    return { sent: true, skipped: false };
  } catch (error) {
    await releaseBookingEmailSendClaim(logKey, claim.token);
    const message = error instanceof Error ? error.message : "Could not send email.";
    logEmailSendEvent("email_send_failed", {
      bookingId: params.bookingId ?? null,
      emailType: params.emailType,
      logKey: logKey || null,
      error: message,
    });
    return { sent: false, skipped: false, error: message };
  }
}
