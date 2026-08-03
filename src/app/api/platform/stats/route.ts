import { NextResponse } from "next/server";
import { isDispatchAuthenticated } from "@/lib/platform/dispatch-auth";
import { getPlatformStats } from "@/lib/platform/store";

export async function GET() {
  if (!(await isDispatchAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const stats = await getPlatformStats();
  return NextResponse.json({ ok: true, stats });
}
