import { sendPlainEmail, canSendBookingEmail } from "@/lib/notify";
import { dispatchEmail } from "@/lib/smtp";

const AIRTABLE_TOKEN = () => process.env.AIRTABLE_TOKEN?.trim();
const AIRTABLE_BASE_ID =
  process.env.AIRTABLE_BASE_ID?.trim() || "appp3gYwPeng1JnRG";
const AIRTABLE_SUBSCRIBERS_TABLE =
  process.env.AIRTABLE_SUBSCRIBERS_TABLE?.trim() || "Travel Subscribers";

export type KthSubscribeResult =
  | { ok: true; alreadySubscribed?: boolean }
  | { ok: false; error: string };

function escapeAirtableFormula(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export function isValidSubscriberEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export function normalizeSubscriberEmail(value: string): string {
  return value.trim().toLowerCase();
}

function airtableConfigured(): boolean {
  return Boolean(AIRTABLE_TOKEN());
}

function airtableRecordsUrl(query = ""): string {
  const base = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_SUBSCRIBERS_TABLE,
  )}`;
  return query ? `${base}?${query}` : base;
}

async function airtableGet(query: string): Promise<Response> {
  const token = AIRTABLE_TOKEN();
  if (!token) throw new Error("Airtable not configured");

  return fetch(airtableRecordsUrl(query), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

async function findSubscriberInAirtable(email: string): Promise<boolean> {
  const safe = escapeAirtableFormula(email);
  const formula = `OR({Email} = '${safe}', {Name} = '${safe}')`;
  const response = await airtableGet(
    `maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`,
  );

  if (!response.ok) return false;
  const data = (await response.json()) as { records?: unknown[] };
  return (data.records?.length ?? 0) > 0;
}

function subscriberFieldSets(
  email: string,
  source: string,
): Record<string, string>[] {
  const subscribedAt = new Date().toISOString();

  return [
    {
      Email: email,
      Source: source,
      "Subscribed At": subscribedAt,
    },
    {
      Name: email,
      Source: source,
      "Subscribed At": subscribedAt,
    },
    {
      Name: email,
      Notes: `Source: ${source}\nSubscribed: ${subscribedAt}`,
    },
  ];
}

async function createSubscriberInAirtable(
  email: string,
  source: string,
): Promise<void> {
  const token = AIRTABLE_TOKEN();
  if (!token) {
    throw new Error("Airtable not configured");
  }

  const attempts = subscriberFieldSets(email, source);
  let lastError = "Airtable subscriber create failed";

  for (const fields of attempts) {
    const response = await fetch(airtableRecordsUrl(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records: [{ fields }] }),
    });

    if (response.ok) return;

    lastError = `${response.status} ${await response.text()}`;
  }

  throw new Error(lastError);
}

async function notifySubscriberByEmail(
  email: string,
  source: string,
): Promise<void> {
  await sendPlainEmail({
    to: dispatchEmail(),
    subject: `Kent Travel Hub subscriber — ${email}`,
    text: [
      "New Dover travel updates subscriber",
      "",
      `Email: ${email}`,
      `Source: ${source}`,
      `Time: ${new Date().toISOString()}`,
      "",
      "Stored in Airtable Travel Subscribers when configured.",
    ].join("\n"),
    replyTo: email,
  });
}

async function sendSubscriberWelcomeEmail(email: string): Promise<void> {
  await sendPlainEmail({
    to: email,
    subject: "You're subscribed — Dover Travel Updates | Kent Travel Hub",
    text: [
      "Thanks for subscribing to Kent Travel Hub.",
      "",
      "We'll email you about:",
      "• Cruise ships at Dover port",
      "• Ferry delays (DFDS & P&O)",
      "• M20 traffic and Operation Brock",
      "• Port waiting times",
      "",
      "Visit anytime: https://kenttravelhub.co.uk",
      "",
      "Kent Travel Hub — your guide to travelling through Dover.",
    ].join("\n"),
  });
}

export function canStoreKthSubscribers(): boolean {
  return airtableConfigured() || canSendBookingEmail();
}

export async function subscribeKthEmail(
  rawEmail: string,
  source: string,
): Promise<KthSubscribeResult> {
  const email = normalizeSubscriberEmail(rawEmail);
  if (!isValidSubscriberEmail(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const cleanSource = source.trim().slice(0, 80) || "website";

  async function finishSubscribe(
    alreadySubscribed: boolean,
  ): Promise<KthSubscribeResult> {
    if (!alreadySubscribed && canSendBookingEmail()) {
      try {
        await sendSubscriberWelcomeEmail(email);
      } catch (error) {
        console.error("KTH welcome email failed:", error);
      }
    }
    return { ok: true, alreadySubscribed };
  }

  if (airtableConfigured()) {
    try {
      const exists = await findSubscriberInAirtable(email);
      if (exists) {
        return finishSubscribe(true);
      }
      await createSubscriberInAirtable(email, cleanSource);
      return finishSubscribe(false);
    } catch (error) {
      console.error("KTH Airtable subscribe failed:", error);
      if (canSendBookingEmail()) {
        try {
          await notifySubscriberByEmail(email, cleanSource);
          return finishSubscribe(false);
        } catch (notifyError) {
          console.error("KTH subscribe email fallback failed:", notifyError);
        }
      }
      return {
        ok: false,
        error: "Subscription is temporarily unavailable. Please try again later.",
      };
    }
  }

  if (canSendBookingEmail()) {
    try {
      await notifySubscriberByEmail(email, cleanSource);
      return finishSubscribe(false);
    } catch {
      return {
        ok: false,
        error: "Subscription is temporarily unavailable. Please try again later.",
      };
    }
  }

  return {
    ok: false,
    error: "Subscriptions are not configured yet.",
  };
}
