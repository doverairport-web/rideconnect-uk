import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SEO_COOKIE = "seo_os_session";

function seoPassword(): string | null {
  const value = process.env.SEO_PASSWORD?.trim();
  return value || null;
}

function sessionToken(password: string): string {
  return createHash("sha256").update(`seo-os:${password}`).digest("hex");
}

export function isSeoConfigured(): boolean {
  return Boolean(seoPassword());
}

export function verifySeoPassword(candidate: string): boolean {
  const expected = seoPassword();
  if (!expected) return false;

  const a = Buffer.from(expected);
  const b = Buffer.from(candidate);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function seoSessionValue(): string | null {
  const password = seoPassword();
  return password ? sessionToken(password) : null;
}

export async function isSeoAuthenticated(): Promise<boolean> {
  const expected = seoSessionValue();
  if (!expected) return false;

  const jar = await cookies();
  const token = jar.get(SEO_COOKIE)?.value;
  if (!token || token.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function seoCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 14) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
