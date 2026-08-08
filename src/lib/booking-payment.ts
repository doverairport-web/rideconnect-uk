import { randomUUID } from "crypto";
import type { WebBookingInput } from "@/lib/booking";
import { getSquareClient, getSquareLocationId, isSquareConfigured } from "@/lib/square";
import { SITE_URL } from "@/lib/brand";

export type CardCheckoutBooking = WebBookingInput & {
  estimated_fare: number;
  pickup_coord?: { lat: number; lng: number } | null;
  /** Routed to dispatch after Square webhook (passenger app). */
  rc_src?: "passenger_dispatch";
};

const CHUNK_SIZE = 250;

export function requiresOnlineCardPayment(method: string | undefined): boolean {
  return method === "card" || method === "payment_link";
}

export function packBookingMetadata(booking: CardCheckoutBooking): Record<string, string> {
  const json = JSON.stringify(booking);
  const chunks: string[] = [];
  for (let i = 0; i < json.length; i += CHUNK_SIZE) {
    chunks.push(json.slice(i, i + CHUNK_SIZE));
  }
  const metadata: Record<string, string> = { rc_bc: String(chunks.length) };
  chunks.forEach((chunk, index) => {
    metadata[`rc_b${index}`] = chunk;
  });
  return metadata;
}

export function unpackBookingMetadata(
  metadata: Record<string, string> | null | undefined,
): CardCheckoutBooking | null {
  if (!metadata) return null;
  const count = Number(metadata.rc_bc);
  if (!Number.isFinite(count) || count < 1 || count > 40) return null;

  let json = "";
  for (let i = 0; i < count; i++) {
    const part = metadata[`rc_b${i}`];
    if (typeof part !== "string") return null;
    json += part;
  }

  try {
    const parsed = JSON.parse(json) as CardCheckoutBooking;
    if (!parsed.estimated_fare || parsed.estimated_fare <= 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function createCardCheckoutSession(
  booking: CardCheckoutBooking,
  options?: { productName?: string; redirectUrl?: string; paymentNote?: string },
): Promise<{ url: string; paymentLinkId: string }> {
  if (!isSquareConfigured()) {
    throw new Error("Card payments are not configured yet. Please choose cash or call us.");
  }

  const amountPence = Math.round(booking.estimated_fare * 100);
  if (amountPence < 100) {
    throw new Error("Estimated fare is too low for card payment.");
  }

  const client = getSquareClient();
  const siteUrl = SITE_URL.replace(/\/$/, "");
  const productName = options?.productName ?? "Taxi booking — estimated meter fare";

  const response = await client.checkout.paymentLinks.create({
    idempotencyKey: randomUUID(),
    order: {
      locationId: getSquareLocationId(),
      metadata: packBookingMetadata(booking),
      lineItems: [
        {
          name: productName,
          quantity: "1",
          basePriceMoney: {
            amount: BigInt(amountPence),
            currency: "GBP",
          },
        },
      ],
    },
    checkoutOptions: {
      redirectUrl: options?.redirectUrl ?? `${siteUrl}/book/payment/success`,
    },
    prePopulatedData: booking.email?.trim()
      ? { buyerEmail: booking.email.trim() }
      : undefined,
    paymentNote: options?.paymentNote ?? `Web booking ${booking.pickup_date} ${booking.pickup_time}`,
  });

  const paymentLink = response.paymentLink;
  const url = paymentLink?.longUrl ?? paymentLink?.url;
  if (!url || !paymentLink?.id) {
    throw new Error("Could not start card payment.");
  }

  return { url, paymentLinkId: paymentLink.id };
}
