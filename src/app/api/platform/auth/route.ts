import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  DISPATCH_COOKIE,
  dispatchCookieOptions,
  dispatchSessionValue,
  isDispatchConfigured,
  verifyDispatchPassword,
} from "@/lib/platform/dispatch-auth";

export async function GET() {
  const configured = isDispatchConfigured();
  const jar = await cookies();
  const token = jar.get(DISPATCH_COOKIE)?.value;
  const expected = dispatchSessionValue();
  const authenticated = Boolean(
    configured && token && expected && token === expected,
  );

  return NextResponse.json({ configured, authenticated });
}

export async function POST(request: Request) {
  if (!isDispatchConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Platform dispatch password is not configured." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { password?: string };
  const password = String(body.password ?? "");
  if (!verifyDispatchPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "Invalid password." },
      { status: 401 },
    );
  }

  const session = dispatchSessionValue();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Session unavailable." },
      { status: 503 },
    );
  }

  const jar = await cookies();
  jar.set(DISPATCH_COOKIE, session, dispatchCookieOptions());

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(DISPATCH_COOKIE);
  return NextResponse.json({ ok: true });
}
