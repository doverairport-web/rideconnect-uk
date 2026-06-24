import { randomUUID } from "crypto";
import { list, put } from "@vercel/blob";

const BLOB_PATH = "rideconnect/booking-email-send-log.json";
export const PENDING_TTL_MS = 5 * 60 * 1000;
export const SENT_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 8000;

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
  const at = Number(raw.split(":")[0]);
  return Number.isFinite(at) ? at : NaN;
}

export function isPendingEntry(raw: string | undefined, now = Date.now()): boolean {
  if (!raw || raw === "sent" || raw.startsWith("failed:")) return false;
  const at = entryTimestamp(raw);
  return Number.isFinite(at) && now - at < PENDING_TTL_MS;
}

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

  const keys = Object.keys(store.sends);
  if (keys.length <= MAX_ENTRIES) return;

  keys
    .sort((a, b) => entryTimestamp(store.sends[a]) - entryTimestamp(store.sends[b]))
    .slice(0, keys.length - MAX_ENTRIES)
    .forEach((key) => delete store.sends[key]);
}

async function loadSendLogStore(): Promise<SendLogStore> {
  if (!isBookingEmailSendLogConfigured()) return { sends: {} };

  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    const blob = blobs[0];
    if (!blob?.url) return { sends: {} };

    const response = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return { sends: {} };

    const parsed = JSON.parse(await response.text()) as SendLogStore;
    if (!parsed?.sends || typeof parsed.sends !== "object") return { sends: {} };
    return parsed;
  } catch {
    return { sends: {} };
  }
}

async function saveSendLogStore(store: SendLogStore): Promise<void> {
  if (!isBookingEmailSendLogConfigured()) return;

  await put(BLOB_PATH, JSON.stringify(store), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
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

  for (let attempt = 0; attempt < 16; attempt++) {
    const store = await loadSendLogStore();
    pruneSendLogStore(store);

    const existing = store.sends[key];
    if (existing === "sent") return { action: "already_sent" };
    if (isPendingEntry(existing)) return { action: "in_progress" };

    store.sends[key] = token;
    try {
      await saveSendLogStore(store);
      const verify = await loadSendLogStore();
      if (verify.sends[key] === token) return { action: "proceed", token };
    } catch {
      /* retry */
    }
    await sleep(40 + attempt * 60);
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

  for (let attempt = 0; attempt < 8; attempt++) {
    const store = await loadSendLogStore();
    pruneSendLogStore(store);
    const existing = store.sends[key];
    if (existing === "sent") return;
    if (existing && existing !== token) return;

    store.sends[key] = "sent";
    try {
      await saveSendLogStore(store);
      return;
    } catch {
      await sleep(40 + attempt * 60);
    }
  }
}

export async function releaseBookingEmailSendClaim(
  logKey: string,
  token: string,
): Promise<void> {
  const key = logKey.trim();
  if (!key || token === "anonymous" || token === "unconfigured") return;
  if (!isBookingEmailSendLogConfigured()) return;

  for (let attempt = 0; attempt < 8; attempt++) {
    const store = await loadSendLogStore();
    const existing = store.sends[key];
    if (existing === "sent") return;
    if (existing !== token) return;

    delete store.sends[key];
    try {
      await saveSendLogStore(store);
      return;
    } catch {
      await sleep(40 + attempt * 60);
    }
  }
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

  const claim = await claimBookingEmailSend(logKey);
  if (claim.action === "already_sent") {
    logEmailSendEvent("email_send_skipped_duplicate", {
      bookingId: params.bookingId ?? null,
      emailType: params.emailType,
      logKey: logKey || null,
    });
    return { sent: false, skipped: true };
  }

  if (claim.action === "in_progress") {
    logEmailSendEvent("email_send_skipped_duplicate", {
      bookingId: params.bookingId ?? null,
      emailType: params.emailType,
      logKey: logKey || null,
      reason: "in_progress",
    });
    return { sent: false, skipped: true, error: "Email send already in progress." };
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
