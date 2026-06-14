import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const LEDGER_COOKIE = "personal_ledger_session";

function ledgerPassword(): string | null {
  const value = process.env.PERSONAL_LEDGER_PASSWORD?.trim();
  return value || null;
}

function sessionToken(password: string): string {
  return createHash("sha256")
    .update(`ledger:${password}`)
    .digest("hex");
}

export function isLedgerConfigured(): boolean {
  return Boolean(ledgerPassword());
}

export function verifyLedgerPassword(candidate: string): boolean {
  const expected = ledgerPassword();
  if (!expected) return false;

  const a = Buffer.from(expected);
  const b = Buffer.from(candidate);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function ledgerSessionValue(): string | null {
  const password = ledgerPassword();
  return password ? sessionToken(password) : null;
}

export async function isLedgerAuthenticated(): Promise<boolean> {
  const expected = ledgerSessionValue();
  if (!expected) return false;

  const jar = await cookies();
  const token = jar.get(LEDGER_COOKIE)?.value;
  if (!token || token.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function ledgerCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 14) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
