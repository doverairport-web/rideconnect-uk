import { NextResponse } from "next/server";
import {
  isLedgerAuthenticated,
  isLedgerConfigured,
  ledgerCookieOptions,
  ledgerSessionValue,
  LEDGER_COOKIE,
  verifyLedgerPassword,
} from "@/lib/personal-ledger/auth";

export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: isLedgerConfigured(),
    authenticated: await isLedgerAuthenticated(),
  });
}

export async function POST(request: Request) {
  if (!isLedgerConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Není nastaveno PERSONAL_LEDGER_PASSWORD v .env",
      },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { password?: string };
  const password = String(body.password ?? "");

  if (!verifyLedgerPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "Špatné heslo." },
      { status: 401 },
    );
  }

  const token = ledgerSessionValue();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Session nelze vytvořit." },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(LEDGER_COOKIE, token, ledgerCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(LEDGER_COOKIE, "", { ...ledgerCookieOptions(0), maxAge: 0 });
  return response;
}
