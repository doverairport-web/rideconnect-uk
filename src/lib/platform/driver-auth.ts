import { cookies } from "next/headers";
import { verifyDriverSession } from "@/lib/platform/pin";
import { getDriverById } from "@/lib/platform/store";

export const DRIVER_COOKIE = "rc_driver_session";
export const DRIVER_ID_COOKIE = "rc_driver_id";

export async function getAuthenticatedDriver() {
  const jar = await cookies();
  const driverId = jar.get(DRIVER_ID_COOKIE)?.value?.trim();
  const token = jar.get(DRIVER_COOKIE)?.value?.trim();
  if (!driverId || !token) return null;

  const driver = await getDriverById(driverId);
  if (!driver || !driver.active) return null;
  if (!verifyDriverSession(token, driver.id, driver.pinHash)) return null;

  return driver;
}

export function driverCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 30) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
