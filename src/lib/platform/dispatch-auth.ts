import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { dispatchSessionToken } from "@/lib/platform/pin";

export const DISPATCH_COOKIE = "rc_dispatch_session";

function dispatchPassword(): string | null {
  const value = process.env.PLATFORM_DISPATCH_PASSWORD?.trim();
  return value || null;
}

export function isDispatchConfigured(): boolean {
  return Boolean(dispatchPassword());
}

export function verifyDispatchPassword(candidate: string): boolean {
  const expected = dispatchPassword();
  if (!expected) return false;

  const a = Buffer.from(expected);
  const b = Buffer.from(candidate);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function dispatchSessionValue(): string | null {
  const password = dispatchPassword();
  return password ? dispatchSessionToken(password) : null;
}

export async function isDispatchAuthenticated(): Promise<boolean> {
  const expected = dispatchSessionValue();
  if (!expected) return false;

  const jar = await cookies();
  const token = jar.get(DISPATCH_COOKIE)?.value;
  if (!token || token.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function dispatchCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 14) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
