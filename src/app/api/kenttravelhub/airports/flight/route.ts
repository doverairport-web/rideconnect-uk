import { lookupFlightNumber } from "@/lib/kenttravelhub/airport-live-data";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? searchParams.get("flight") ?? "";
  const result = await lookupFlightNumber(q);
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15",
    },
  });
}
