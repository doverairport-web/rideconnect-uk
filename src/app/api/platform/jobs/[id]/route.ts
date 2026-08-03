import { NextResponse } from "next/server";
import { isDispatchAuthenticated } from "@/lib/platform/dispatch-auth";
import { cancelJob, getJobById } from "@/lib/platform/store";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  if (!(await isDispatchAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const job = await getJobById(id);
  if (!job) {
    return NextResponse.json({ ok: false, error: "Job not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, job });
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isDispatchAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as { action?: string; reason?: string };

  if (body.action !== "cancel") {
    return NextResponse.json({ ok: false, error: "Unsupported action." }, { status: 400 });
  }

  const job = await cancelJob(id, String(body.reason ?? ""));
  if (!job) {
    return NextResponse.json(
      { ok: false, error: "Job cannot be cancelled." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, job });
}
