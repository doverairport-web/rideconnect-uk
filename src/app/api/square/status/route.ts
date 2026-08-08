import { NextResponse } from "next/server";
import { isSquareConfigured } from "@/lib/square";

export async function GET() {
  return NextResponse.json(
    { ok: true, configured: isSquareConfigured() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
