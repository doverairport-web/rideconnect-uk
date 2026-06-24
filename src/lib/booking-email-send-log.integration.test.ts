import { beforeEach, describe, expect, it, vi } from "vitest";

const memoryStore = { sends: {} as Record<string, string> };

vi.mock("@vercel/blob", () => ({
  list: vi.fn(async () => ({ blobs: [{ url: "https://blob.test/log.json" }] })),
  put: vi.fn(async (_path: string, body: string) => {
    Object.assign(memoryStore, JSON.parse(body) as typeof memoryStore);
  }),
}));

describe("withBookingEmailIdempotency", () => {
  beforeEach(() => {
    memoryStore.sends = {};
    process.env.BLOB_READ_WRITE_TOKEN = "test-token";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: RequestInfo) => {
        if (String(url).includes("blob.test")) {
          return new Response(JSON.stringify(memoryStore));
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
    expect(second.skipped).toBe(true);
    expect(sendCount).toBe(1);
  });
});
