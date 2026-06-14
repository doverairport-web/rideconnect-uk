import { fetchJson } from "@/lib/kenttravelhub/fetchers/http";

/** Dover town centre — used for live weather card. */
const DOVER_LAT = 51.126;
const DOVER_LON = 1.313;

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
};

function weatherLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  return "Changeable";
}

export type WeatherFeedResult = {
  tempC: number;
  label: string;
  source: string;
};

export async function fetchDoverWeather(): Promise<WeatherFeedResult> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${DOVER_LAT}&longitude=${DOVER_LON}` +
    `&current=temperature_2m,weather_code`;

  const data = await fetchJson<OpenMeteoResponse>(url);
  const code = data?.current?.weather_code ?? 1;

  return {
    tempC: Math.round(data?.current?.temperature_2m ?? 14),
    label: weatherLabel(code),
    source: "open-meteo.com",
  };
}
