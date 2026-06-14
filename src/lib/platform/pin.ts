import { createHash, timingSafeEqual } from "crypto";

export function hashPin(pin: string): string {
  return createHash("sha256").update(`rc-pin:${pin}`).digest("hex");
}

export function verifyPin(candidate: string, expectedHash: string): boolean {
  const hash = hashPin(candidate);
  const a = Buffer.from(hash);
  const b = Buffer.from(expectedHash);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function generatePin(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function driverSessionToken(driverId: string, pinHash: string): string {
  return createHash("sha256")
    .update(`rc-driver:${driverId}:${pinHash}`)
    .digest("hex");
}

export function verifyDriverSession(
  token: string,
  driverId: string,
  pinHash: string,
): boolean {
  const expected = driverSessionToken(driverId, pinHash);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function dispatchSessionToken(password: string): string {
  return createHash("sha256").update(`rc-dispatch:${password}`).digest("hex");
}
