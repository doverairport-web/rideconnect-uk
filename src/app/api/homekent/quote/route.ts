import { HOMEKENT_EMAIL, HOMEKENT_NAME } from "@/lib/homekent/brand";
import { homekentSmtpConfigured, sendHomekentEmail } from "@/lib/homekent/email";
import { NextResponse } from "next/server";

type QuoteBody = {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
};

function parseBody(body: QuoteBody) {
  const name = body.name?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim();
  const service = body.service?.trim();
  const message = body.message?.trim() || "";

  if (!name || !email || !phone || !service) {
    return null;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }

  return { name, email, phone, service, message };
}

async function sendQuoteEmail(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) {
  if (!homekentSmtpConfigured()) {
    throw new Error("HomeKent email is not configured on the server.");
  }

  const to =
    process.env.HOMEKENT_QUOTE_EMAIL?.trim() ||
    process.env.HOMEKENT_EMAIL?.trim() ||
    HOMEKENT_EMAIL;
  const subject = `${HOMEKENT_NAME} quote request — ${data.service}`;
  const text = [
    `New quote request from ${HOMEKENT_NAME} website`,
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Service: ${data.service}`,
    data.message ? `Message: ${data.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await sendHomekentEmail({
    to,
    subject,
    text,
    replyTo: data.email,
  });
}

function publicSendError(error: unknown): string {
  if (error instanceof Error) {
    if (/not configured/i.test(error.message)) {
      return `Could not send your message right now. Please email ${HOMEKENT_EMAIL} or call us instead.`;
    }
    if (/550|SMTP|mailfrom|authentication|Message failed/i.test(error.message)) {
      return `Could not send your message right now. Please email ${HOMEKENT_EMAIL} or call us instead.`;
    }
    return error.message;
  }
  return "Could not send your message. Please call us instead.";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuoteBody;
    const data = parseBody(body);

    if (!data) {
      return NextResponse.json(
        { ok: false, error: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    await sendQuoteEmail(data);

    return NextResponse.json({
      ok: true,
      message: "Thank you — we'll be in touch shortly.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: publicSendError(error),
      },
      { status: 500 },
    );
  }
}
