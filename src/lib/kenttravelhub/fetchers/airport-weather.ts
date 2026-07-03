import { fetchJson } from "@/lib/kenttravelhub/fetchers/http";
import type { KthAirportId, KthAirportWeather } from "@/lib/kenttravelhub/airport-live";
import { KTH_AIRPORTS } from "@/lib/kenttravelhub/airport-live";

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
};

function weatherLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Fog";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  return "Changeable";
}

export async function fetchAirportWeather(
  airportId: KthAirportId,
): Promise<KthAirportWeather> {
  const airport = KTH_AIRPORTS[airportId];
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${airport.lat}&longitude=${airport.lon}` +
    `&current=temperature_2m,weather_code&timezone=Europe%2FLondon`;

  const data = await fetchJson<OpenMeteoResponse>(url);
  const code = data?.current?.weather_code ?? 1;

  return {
    tempC: Math.round(data?.current?.temperature_2m ?? 14),
    label: weatherLabel(code),
  };
}
