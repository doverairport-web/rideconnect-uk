import {
  calculateMeterFare,
  formatMeterFare,
  parseLuggageArticles,
  parsePickupDateTime,
  type MeterBreakdown,
} from "@/lib/meter";
import { estimateRoute, type RouteMapData } from "@/lib/route-estimate";

export type FareEstimateInput = {
  pickup: string;
  destination: string;
  pickup_coord?: { lat: number; lng: number } | null;
  destination_coord?: { lat: number; lng: number } | null;
  pickup_date?: string;
  pickup_time?: string;
  passengers?: number;
  luggage?: string;
  luggageArticles?: number;
};

export type FareEstimateResult = {
  ok: true;
  fare: number;
  fareFormatted: string;
  tariff: number;
  tariffLabel: string;
  distanceMiles: number;
  durationMinutes: number;
  breakdown: MeterBreakdown;
  source: string;
  note: string;
  map?: RouteMapData;
};

export async function buildFareEstimate(
  input: FareEstimateInput,
): Promise<FareEstimateResult | { ok: false; error: string }> {
  const pickup = input.pickup?.trim();
  const destination = input.destination?.trim();

  if (!pickup || !destination) {
    return { ok: false, error: "Pickup and destination are required." };
  }

  const pickupAt =
    parsePickupDateTime(input.pickup_date ?? "", input.pickup_time ?? "") ??
    new Date();

  const route = await estimateRoute(
    pickup,
    destination,
    pickupAt,
    input.pickup_coord ?? null,
    input.destination_coord ?? null,
  );
  if (!route) {
    return {
      ok: false,
      error: "Could not estimate route. Check the addresses and try again.",
    };
  }

  const passengers = Math.max(1, input.passengers ?? 1);
  const luggageArticles =
    input.luggageArticles ??
    parseLuggageArticles(input.luggage);
  const breakdown = calculateMeterFare(route.distanceMeters, route.durationSeconds, {
    pickupAt,
    passengers,
    luggageArticles,
    isMpv: passengers > 4,
  });

  return {
    ok: true,
    fare: breakdown.total,
    fareFormatted: formatMeterFare(breakdown.total),
    tariff: breakdown.tariff.id,
    tariffLabel: breakdown.tariff.label,
    distanceMiles: Math.round((route.distanceMeters / 1609.344) * 10) / 10,
    durationMinutes: Math.round(route.durationSeconds / 60),
    breakdown,
    source: route.source,
    map: route.map,
    note:
      "Approximate Hackney meter fare (distance + waiting time). Final fare is the in-car meter, usually within £0.20.",
  };
}
