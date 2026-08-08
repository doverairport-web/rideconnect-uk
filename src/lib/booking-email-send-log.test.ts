import { describe, expect, it } from "vitest";
import {
  emailSendLogKey,
  fallbackEmailSendLogKey,
  isPendingEntry,
  pruneSendLogStore,
  SENT_TTL_MS,
  PENDING_TTL_MS,
} from "@/lib/booking-email-send-log";

describe("booking email send log", () => {
  it("builds stable keys from bookingId and emailType", () => {
    expect(emailSendLogKey("recABC123", "customer_confirmation")).toBe(
      "recABC123:customer_confirmation",
    );
    expect(fallbackEmailSendLogKey("pay_1", "dispatch_notification")).toBe(
      "fallback:pay_1:dispatch_notification",
    );
  });

  it("treats fresh pending entries as in progress", () => {
    const now = Date.now();
    expect(isPendingEntry(`${now}:token`, now)).toBe(true);
    expect(isPendingEntry("sent", now)).toBe(false);
    expect(isPendingEntry(`${now - PENDING_TTL_MS - 1000}:token`, now)).toBe(false);
  });

  it("prunes stale pending and caps oversized stores", () => {
    const now = Date.now();
    const store = {
      sends: {
        "a:customer_confirmation": "sent",
        "b:customer_confirmation": `${now - SENT_TTL_MS - 1000}:old`,
        "c:customer_confirmation": `${now}:fresh`,
      },
    };

    pruneSendLogStore(store, now);
    expect(store.sends["a:customer_confirmation"]).toBe("sent");
    expect(store.sends["b:customer_confirmation"]).toBeUndefined();
    expect(store.sends["c:customer_confirmation"]).toBe(`${now}:fresh`);
  });
});
