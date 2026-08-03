import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  DRIVER_COOKIE,
  DRIVER_ID_COOKIE,
  driverCookieOptions,
} from "@/lib/platform/driver-auth";
import { driverSessionToken, verifyPin } from "@/lib/platform/pin";
import { findDriverByPhone } from "@/lib/platform/store";

export async function GET() {
  const jar = await cookies();
  const driverId = jar.get(DRIVER_ID_COOKIE)?.value;
  const authenticated = Boolean(driverId && jar.get(DRIVER_COOKIE)?.value);
  return NextResponse.json({ authenticated: Boolean(authenticated) });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { phone?: string; pin?: string };
  const phone = String(body.phone ?? "").trim();
  const pin = String(body.pin ?? "").trim();

  if (!phone || !pin) {
    return NextResponse.json(
      { ok: false, error: "Phone and PIN are required." },
      { status: 400 },
    );
  }

  const driver = await findDriverByPhone(phone);
  if (!driver || !driver.active) {
    return NextResponse.json(
      { ok: false, error: "Invalid credentials." },
      { status: 401 },
    );
  }

  if (!verifyPin(pin, driver.pinHash)) {
    return NextResponse.json(
      { ok: false, error: "Invalid credentials." },
      { status: 401 },
    );
  }

  const token = driverSessionToken(driver.id, driver.pinHash);
  const jar = await cookies();
  jar.set(DRIVER_COOKIE, token, driverCookieOptions());
  jar.set(DRIVER_ID_COOKIE, driver.id, driverCookieOptions());

  return NextResponse.json({
    ok: true,
    driver: {
      id: driver.id,
      name: driver.name,
      phone: driver.phone,
      vehicle: driver.vehicle,
    },
  });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(DRIVER_COOKIE);
  jar.delete(DRIVER_ID_COOKIE);
  return NextResponse.json({ ok: true });
}
