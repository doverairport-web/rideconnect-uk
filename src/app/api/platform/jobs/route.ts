import { NextResponse } from "next/server";
import { isDispatchAuthenticated } from "@/lib/platform/dispatch-auth";
import {
  createJob,
  listJobs,
  parseJobInput,
} from "@/lib/platform/store";

export async function GET() {
  if (!(await isDispatchAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const jobs = await listJobs();
  return NextResponse.json({ ok: true, jobs });
}

export async function POST(request: Request) {
  if (!(await isDispatchAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const input = parseJobInput(await request.json());
  if (!input) {
    return NextResponse.json(
      { ok: false, error: "Invalid job data. Check pickup and fixed fare (£5–£500)." },
      { status: 400 },
    );
  }

  const job = await createJob(input);
  return NextResponse.json({ ok: true, job });
}
