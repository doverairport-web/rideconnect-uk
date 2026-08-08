import {
  canStoreKthSubscribers,
  subscribeKthEmail,
} from "@/lib/kenttravelhub/subscribers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type SubscribeBody = {
  email?: string;
  source?: string;
  website?: string;
};

export async function POST(request: Request) {
  if (!canStoreKthSubscribers()) {
    return NextResponse.json(
      { error: "Subscriptions are not configured yet." },
      { status: 503 },
    );
  }

  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const result = await subscribeKthEmail(
    String(body.email ?? ""),
    String(body.source ?? "website"),
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    alreadySubscribed: result.alreadySubscribed ?? false,
  });
}
