import { NextResponse } from "next/server";
import { isDispatchAuthenticated } from "@/lib/platform/dispatch-auth";
import {
  createDriver,
  listDrivers,
  parseDriverInput,
} from "@/lib/platform/store";

export async function GET() {
  if (!(await isDispatchAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const drivers = await listDrivers();
  return NextResponse.json({
    ok: true,
    drivers: drivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      phone: driver.phone,
      vehicle: driver.vehicle,
      active: driver.active,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt,
    })),
  });
}

export async function POST(request: Request) {
  if (!(await isDispatchAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const input = parseDriverInput(await request.json());
  if (!input) {
    return NextResponse.json(
      { ok: false, error: "Invalid driver data. Name and phone are required." },
      { status: 400 },
    );
  }

  const { driver, pin } = await createDriver(input);
  return NextResponse.json({
    ok: true,
    driver: {
      id: driver.id,
      name: driver.name,
      phone: driver.phone,
      vehicle: driver.vehicle,
      active: driver.active,
    },
    pin,
  });
}
