import { NextResponse } from "next/server";
import { getAuthenticatedDriver } from "@/lib/platform/driver-auth";
import { startJob } from "@/lib/platform/store";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const driver = await getAuthenticatedDriver();
  if (!driver) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const job = await startJob(id, driver.id);
  if (!job) {
    return NextResponse.json(
      { ok: false, error: "Cannot start this job." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, job });
}
