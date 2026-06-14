import { NextResponse } from "next/server";
import { isDispatchAuthenticated } from "@/lib/platform/dispatch-auth";
import { updateDriver } from "@/lib/platform/store";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isDispatchAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    name?: string;
    phone?: string;
    vehicle?: string;
    active?: boolean;
    pin?: string;
  };

  const driver = await updateDriver(id, body);
  if (!driver) {
    return NextResponse.json({ ok: false, error: "Driver not found." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    driver: {
      id: driver.id,
      name: driver.name,
      phone: driver.phone,
      vehicle: driver.vehicle,
      active: driver.active,
    },
  });
}
