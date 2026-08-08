import { NextResponse } from "next/server";
import {
  isSeoAuthenticated,
  isSeoConfigured,
  seoCookieOptions,
  seoSessionValue,
  SEO_COOKIE,
  verifySeoPassword,
} from "@/lib/seo/auth";

export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: isSeoConfigured(),
    authenticated: await isSeoAuthenticated(),
  });
}

export async function POST(request: Request) {
  if (!isSeoConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Není nastaveno SEO_PASSWORD v .env.local",
      },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { password?: string };
  const password = String(body.password ?? "");

  if (!verifySeoPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "Špatné heslo." },
      { status: 401 },
    );
  }

  const token = seoSessionValue();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Session nelze vytvořit." },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SEO_COOKIE, token, seoCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SEO_COOKIE, "", {
    ...seoCookieOptions(0),
    maxAge: 0,
  });
  return response;
}
