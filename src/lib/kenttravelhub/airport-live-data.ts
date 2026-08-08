import {
  KTH_AIRPORT_ORDER,
  KTH_AIRPORTS,
  type KthAirportFlight,
  type KthAirportId,
  type KthAirportLiveBoard,
  type KthAirportLiveDashboard,
} from "@/lib/kenttravelhub/airport-live";
import {
  fetchGatwickFlights,
  fetchHeathrowFlights,
  lookupGatwickFlight,
  lookupHeathrowFlight,
} from "@/lib/kenttravelhub/fetchers/airport-flights/heathrow-gatwick";
import {
  fetchLutonFlights,
  fetchStanstedFlights,
  lookupLutonFlight,
  lookupStanstedFlight,
} from "@/lib/kenttravelhub/fetchers/airport-flights/luton-stansted";
import { fetchAirportJourney } from "@/lib/kenttravelhub/fetchers/airport-journey";
import { fetchAirportWeather } from "@/lib/kenttravelhub/fetchers/airport-weather";
import { getLiveTravelSnapshot } from "@/lib/kenttravelhub/live-data";
import { buildWeatherTravelImpacts } from "@/lib/kenttravelhub/home-dashboard";

const FETCHERS: Record<
  KthAirportId,
  () => Promise<{ arrivals: KthAirportFlight[]; departures: KthAirportFlight[]; source: string }>
> = {
  heathrow: fetchHeathrowFlights,
  gatwick: fetchGatwickFlights,
  stansted: fetchStanstedFlights,
  luton: fetchLutonFlights,
};

function countDelayed(flights: KthAirportFlight[]): number {
  return flights.filter((f) => f.delayed && !f.cancelled).length;
}

function countCancelled(flights: KthAirportFlight[]): number {
  return flights.filter((f) => f.cancelled).length;
}

export async function getAirportLiveDashboard(): Promise<KthAirportLiveDashboard> {
  const boardUpdatedAt = new Date().toISOString();
  const [live, ...boards] = await Promise.all([
    getLiveTravelSnapshot().catch(() => null),
    ...KTH_AIRPORT_ORDER.map(async (id): Promise<KthAirportLiveBoard> => {
      const meta = KTH_AIRPORTS[id];
      const [flights, weather, journey] = await Promise.all([
        FETCHERS[id](),
        fetchAirportWeather(id),
        fetchAirportJourney(id),
      ]);

      return {
        id,
        name: meta.name,
        iata: meta.iata,
        officialFlightsUrl: meta.officialFlightsUrl,
        arrivals: flights.arrivals.slice(0, 12),
        departures: flights.departures.slice(0, 12),
        weather,
        journey,
        terminals: meta.terminals,
        source: flights.source,
        updatedAt: boardUpdatedAt,
      };
    }),
  ]);

  const allFlights = boards.flatMap((b) => [...b.arrivals, ...b.departures]);
  const arrivals = boards.reduce((n, b) => n + b.arrivals.length, 0);
  const departures = boards.reduce((n, b) => n + b.departures.length, 0);

  const busiest = [...boards]
    .map((b) => ({
      id: b.id,
      flights: b.arrivals.length + b.departures.length,
    }))
    .sort((a, b) => b.flights - a.flights)[0];

  const journeyMinutes = boards.map((b) => b.journey.journeyMinutes);
  const averageDoverMinutes = journeyMinutes.length
    ? Math.round(journeyMinutes.reduce((a, b) => a + b, 0) / journeyMinutes.length)
    : null;

  const weatherImpacts = live
    ? [
        buildWeatherTravelImpacts(live).driving,
        buildWeatherTravelImpacts(live).ferries,
      ]
    : ["Allow extra time on the M20 and M25 for Dover–London airport runs."];

  return {
    updatedAt: boardUpdatedAt,
    flightsToday: allFlights.length,
    arrivals,
    departures,
    delayed: countDelayed(allFlights),
    cancelled: countCancelled(allFlights),
    weatherLabel: live?.weather.label ?? boards[0]?.weather.label ?? "—",
    doverTravelMinutes: live?.m20JourneyMinutes ?? null,
    airports: boards,
    m20: live
      ? {
          label: live.m20Traffic.label,
          detail: live.m20Traffic.detail,
          severity: live.m20Traffic.severity,
          journeyMinutes: live.m20JourneyMinutes,
          delayMinutes: live.m20DelayMinutes,
        }
      : {
          label: "M20",
          detail: "Check live M20 before airport transfers",
          severity: "ok" as const,
        },
    brock: live
      ? {
          label: live.operationBrock.label,
          active: live.operationBrock.active,
          detail: live.operationBrock.detail,
          severity: live.operationBrock.severity,
        }
      : {
          label: "Operation Brock",
          active: false,
          detail: "No Brock alert loaded",
          severity: "ok" as const,
        },
    weatherImpacts,
    busiestAirport: busiest?.flights
      ? { id: busiest.id, name: KTH_AIRPORTS[busiest.id].shortName, flights: busiest.flights }
      : null,
    averageDoverMinutes,
  };
}

export type KthFlightLookupResult = {
  query: string;
  flight: KthAirportFlight | null;
  airport: KthAirportId | null;
  airportName: string | null;
  bookCampaign: string;
};

export async function lookupFlightNumber(
  rawQuery: string,
): Promise<KthFlightLookupResult> {
  const query = rawQuery.trim().toUpperCase().replace(/\s+/g, "");
  const empty: KthFlightLookupResult = {
    query,
    flight: null,
    airport: null,
    airportName: null,
    bookCampaign: "airport-flight-tracker",
  };
  if (!query || query.length < 3) return empty;

  const attempts: Array<{
    id: KthAirportId;
    fn: (q: string) => Promise<KthAirportFlight | null>;
  }> = [
    { id: "heathrow", fn: lookupHeathrowFlight },
    { id: "gatwick", fn: lookupGatwickFlight },
    { id: "luton", fn: lookupLutonFlight },
    { id: "stansted", fn: lookupStanstedFlight },
  ];

  for (const { id, fn } of attempts) {
    const flight = await fn(query);
    if (flight) {
      return {
        query,
        flight,
        airport: id,
        airportName: KTH_AIRPORTS[id].name,
        bookCampaign: `airport-${id}-flight`,
      };
    }
  }

  return empty;
}
