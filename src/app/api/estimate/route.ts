import { NextResponse } from "next/server";
import { buildFareEstimate } from "@/lib/fare-estimate";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const result = await buildFareEstimate({
      pickup: String(body.pickup ?? ""),
      destination: String(body.destination ?? ""),
      pickup_coord: body.pickup_coord as { lat: number; lng: number } | null | undefined,
      destination_coord: body.destination_coord as { lat: number; lng: number } | null | undefined,
      pickup_date: String(body.pickup_date ?? ""),
      pickup_time: String(body.pickup_time ?? ""),
      passengers: body.passengers ? Number(body.passengers) : undefined,
      luggageArticles: body.luggageArticles ? Number(body.luggageArticles) : undefined,
      luggage: String(body.luggage ?? ""),
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Estimate failed.",
      },
      { status: 500 },
    );
  }
}
