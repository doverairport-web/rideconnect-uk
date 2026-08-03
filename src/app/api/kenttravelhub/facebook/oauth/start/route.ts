import { buildFacebookOAuthUrl } from "@/lib/kenttravelhub/facebook-oauth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Redirect to Meta OAuth — one-click Facebook Page connection. */
export async function GET() {
  try {
    const url = buildFacebookOAuthUrl();
    return NextResponse.redirect(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : "OAuth is not configured";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
