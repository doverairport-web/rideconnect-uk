import { NextResponse } from "next/server";
import { isLedgerAuthenticated } from "@/lib/personal-ledger/auth";
import {
  createPersonalJob,
  listPersonalJobs,
  parseJobInput,
} from "@/lib/personal-ledger/store";

async function requireAuth() {
  if (!(await isLedgerAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Neautorizováno." }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  const jobs = await listPersonalJobs();
  const total = jobs.reduce((sum, job) => sum + job.price, 0);

  return NextResponse.json({ ok: true, jobs, total });
}

export async function POST(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const input = parseJobInput(await request.json());
  if (!input) {
    return NextResponse.json(
      { ok: false, error: "Vyplňte typ, datum, řidiče a cenu." },
      { status: 400 },
    );
  }

  const job = await createPersonalJob(input);
  return NextResponse.json({ ok: true, job });
}
