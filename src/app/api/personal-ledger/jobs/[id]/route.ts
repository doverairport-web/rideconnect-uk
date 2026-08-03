import { NextResponse } from "next/server";
import { isLedgerAuthenticated } from "@/lib/personal-ledger/auth";
import {
  deletePersonalJob,
  parseJobInput,
  updatePersonalJob,
} from "@/lib/personal-ledger/store";

type RouteContext = { params: Promise<{ id: string }> };

async function requireAuth() {
  if (!(await isLedgerAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Neautorizováno." }, { status: 401 });
  }
  return null;
}

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await context.params;
  const input = parseJobInput(await request.json());
  if (!input) {
    return NextResponse.json(
      { ok: false, error: "Vyplňte typ, datum, řidiče a cenu." },
      { status: 400 },
    );
  }

  const job = await updatePersonalJob(id, input);
  if (!job) {
    return NextResponse.json({ ok: false, error: "Záznam nenalezen." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, job });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await context.params;
  const removed = await deletePersonalJob(id);
  if (!removed) {
    return NextResponse.json({ ok: false, error: "Záznam nenalezen." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
