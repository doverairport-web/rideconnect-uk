import { NextResponse } from "next/server";
import { hasGooglePlacesSuggest, resolveGooglePlace, searchGooglePlaces } from "@/lib/google-places-suggest";
import { hitsToSuggestions, searchNominatim } from "@/lib/nominatim";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const placeId = url.searchParams.get("place_id")?.trim() ?? "";

  if (placeId) {
    if (!hasGooglePlacesSuggest()) {
      return NextResponse.json({ ok: false, error: "Place lookup unavailable." }, { status: 503 });
    }

    const selectedText = url.searchParams.get("label")?.trim() ?? "";

    try {
      const resolved = await resolveGooglePlace(placeId, selectedText || undefined);
      if (!resolved) {
        return NextResponse.json({ ok: false, error: "Place not found." }, { status: 404 });
      }
      return NextResponse.json({ ok: true, suggestion: resolved });
    } catch {
      return NextResponse.json({ ok: false, error: "Place lookup failed." }, { status: 502 });
    }
  }

  const query = url.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ ok: true, suggestions: [] });
  }

  try {
    if (hasGooglePlacesSuggest()) {
      const googleSuggestions = await searchGooglePlaces(query, 6);
      if (googleSuggestions.length > 0) {
        return NextResponse.json({ ok: true, suggestions: googleSuggestions, source: "google" });
      }
    }

    const results = await searchNominatim(
      query,
      6,
      "RideConnectUk-DoverTaxi/1.0 (address-suggest; dovertaxi.co.uk)",
    );

    return NextResponse.json({
      ok: true,
      suggestions: hitsToSuggestions(results),
      source: "nominatim",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Address search unavailable." },
      { status: 502 },
    );
  }
}
