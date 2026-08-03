import { beforeEach, describe, expect, it, vi } from "vitest";

const memoryEntries = new Map<string, string>();

vi.mock("@vercel/blob", () => ({
  list: vi.fn(async ({ prefix }: { prefix: string }) => ({
    blobs: memoryEntries.has(prefix)
      ? [{ url: `https://blob.test/${prefix}` }]
      : [],
  })),
  put: vi.fn(async (path: string, body: string) => {
    memoryEntries.set(path, body);
  }),
  del: vi.fn(async (path: string) => {
    memoryEntries.delete(path);
  }),
}));

describe("withBookingEmailIdempotency", () => {
  beforeEach(() => {
    memoryEntries.clear();
    process.env.BLOB_READ_WRITE_TOKEN = "test-token";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: RequestInfo) => {
        const path = String(url).replace("https://blob.test/", "").split("?")[0];
        const value = memoryEntries.get(path);
        if (value != null) {
          return new Response(value);
        }
        throw new Error(`unexpected fetch ${String(url)}`);
      }),
    );
  });

  it("sends customer confirmation only once per bookingId", async () => {
    const { withBookingEmailIdempotency } = await import("@/lib/booking-email-send-log");
    let sendCount = 0;

    const first = await withBookingEmailIdempotency(
      { bookingId: "recBOOK1", emailType: "customer_confirmation" },
      async () => {
        sendCount += 1;
      },
    );
    const second = await withBookingEmailIdempotency(
      { bookingId: "recBOOK1", emailType: "customer_confirmation" },
      async () => {
        sendCount += 1;
      },
    );

    expect(first.sent).toBe(true);
    expect(second.sent).toBe(true);
    expect(second.skipped).toBe(true);
    expect(sendCount).toBe(1);
  });
});
