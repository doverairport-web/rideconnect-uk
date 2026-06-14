import type { LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import { fetchCruiseArrivals } from "@/lib/kenttravelhub/fetchers/cruise";
import { buildFerryAndPortStatus } from "@/lib/kenttravelhub/fetchers/ferry";
import { fetchFerryArrivalsFromFrance } from "@/lib/kenttravelhub/fetchers/ferry-arrivals";
import {
  estimateBrockStatus,
  fetchHighwaysIncidents,
} from "@/lib/kenttravelhub/fetchers/highways";
import { fetchM20Traffic } from "@/lib/kenttravelhub/fetchers/m20";
import { fetchPortNews } from "@/lib/kenttravelhub/fetchers/port-news";
import { fetchDoverWeather } from "@/lib/kenttravelhub/fetchers/weather";

export async function getLiveTravelSnapshot(): Promise<LiveTravelSnapshot> {
  const [cruise, highways, portNews, weather, ferryArrivals] = await Promise.all([
    fetchCruiseArrivals(),
    fetchHighwaysIncidents(),
    fetchPortNews(),
    fetchDoverWeather(),
    fetchFerryArrivalsFromFrance(),
  ]);

  const brock = highways?.brock ?? estimateBrockStatus();
  const m20 = await fetchM20Traffic(new Date(), highways?.incidents ?? []);
  const ferryPort = buildFerryAndPortStatus({
    m20Severity: m20.severity,
    brockActive: brock.active,
    cruiseCount: cruise.arrivals.length,
    portNews,
    m20Incidents: highways?.incidents,
  });

  const ferryArrivalsData = ferryArrivals;

  return {
    updatedAt: new Date().toISOString(),
    sources: {
      cruise: cruise.source,
      m20: m20.source,
      ferry: ferryPort.source,
      port: ferryPort.source,
      brock: brock.source,
      weather: weather.source,
      ferryArrivals: ferryArrivalsData.source,
    },
    doverPortTraffic: ferryPort.port,
    ferryDelays: ferryPort.ferry,
    m20Traffic: {
      label: m20.label,
      detail: m20.detail,
      severity: m20.severity,
    },
    m20JourneyMinutes: m20.journeyMinutes,
    m20DelayMinutes: m20.delayMinutes,
    operationBrock: {
      label: brock.label,
      active: brock.active,
      detail: brock.detail,
      severity: brock.severity,
    },
    cruiseArrivals: cruise.arrivals,
    cruiseCalendar: cruise.calendar,
    ferryArrivals: ferryArrivalsData.arrivals,
    weather: {
      tempC: weather.tempC,
      label: weather.label,
    },
  };
}
