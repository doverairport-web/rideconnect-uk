import { fetchBustimesDepartures } from "@/lib/kenttravelhub/fetchers/bus-bustimes";
import { fetchStagecoachDisruptions } from "@/lib/kenttravelhub/fetchers/bus-disruptions";
import {
  bustimesStopUrl,
  isLondonCoachDeparture,
  KTH_BUS_GUIDES,
  KTH_BUS_OFFICIAL_LINKS,
  KTH_BUS_STOP_ORDER,
  KTH_BUS_STOPS,
  KTH_LONDON_COACH_STOP_IDS,
  matchesDestination,
  pickNextDeparture,
  type KthBusDeparture,
  type KthBusLiveBoard,
  type KthBusLiveDashboard,
  type KthBusStopId,
} from "@/lib/kenttravelhub/bus-live";

function countDelayed(departures: KthBusDeparture[]): number {
  return departures.filter((d) => d.delayed && !d.cancelled).length;
}

function countCancelled(departures: KthBusDeparture[]): number {
  return departures.filter((d) => d.cancelled).length;
}

export async function getBusLiveDashboard(): Promise<KthBusLiveDashboard> {
  const boardUpdatedAt = new Date().toISOString();

  const [stopResults, disruptions] = await Promise.all([
    Promise.all(
      KTH_BUS_STOP_ORDER.map(async (id) => {
        const meta = KTH_BUS_STOPS[id];
        const board = await fetchBustimesDepartures(meta.atcoCode);
        return { id, meta, board };
      }),
    ),
    fetchStagecoachDisruptions(),
  ]);

  const stops: KthBusLiveBoard[] = stopResults.map(({ id, meta, board }) => ({
    id,
    name: board.stopName?.replace(/ – Bus Times/, "") ?? meta.name,
    areaLabel: meta.areaLabel,
    atcoCode: meta.atcoCode,
    officialBoardUrl: bustimesStopUrl(meta.atcoCode),
    officialTimetableUrl: bustimesStopUrl(meta.atcoCode),
    departures: board.departures,
    source: board.source,
    updatedAt: boardUpdatedAt,
    liveAvailable: board.liveAvailable,
    featuredRoutes: meta.featuredRoutes,
  }));

  const allDepartures = stops.flatMap((s) => s.departures);
  const townCentre = stops.find((s) => s.id === "dover-town-centre");
  const townDeps = townCentre?.departures ?? [];

  const toPriory = [
    ...(stops.find((s) => s.id === "dover-priory")?.departures ?? []),
    ...townDeps.filter((d) =>
      matchesDestination(d, [/priory/i, /^d$/i]) || ["63", "66", "D"].includes(d.routeNumber),
    ),
  ].slice(0, 6);

  const toCruiseTerminal = [
    ...(stops.find((s) => s.id === "cruise-terminal")?.departures ?? []),
    ...townDeps.filter((d) =>
      matchesDestination(d, [/whitfield/i, /gateway/i, /western/i, /docks/i]) ||
        d.routeNumber === "66",
    ),
  ].slice(0, 6);

  const toFerryTerminal = [
    ...(stops.find((s) => s.id === "ferry-terminal")?.departures ?? []),
    ...townDeps.filter((d) =>
      matchesDestination(d, [/eastern/i, /docks/i, /whitfield/i]) ||
        d.routeNumber === "66",
    ),
  ].slice(0, 6);

  const londonCoachDeps = stops
    .filter((s) => KTH_LONDON_COACH_STOP_IDS.includes(s.id))
    .flatMap((s) => s.departures.filter(isLondonCoachDeparture));

  const toLondon = londonCoachDeps.slice(0, 8);

  return {
    updatedAt: boardUpdatedAt,
    nextDeparture: pickNextDeparture(townDeps),
    toPriory,
    toCruiseTerminal,
    toFerryTerminal,
    toLondon,
    nextLondonDeparture: pickNextDeparture(londonCoachDeps),
    delayed: countDelayed(allDepartures),
    cancelled: countCancelled(allDepartures),
    disruptions,
    stops,
    mainStopId: "dover-town-centre" as KthBusStopId,
    guides: KTH_BUS_GUIDES,
    officialLinks: KTH_BUS_OFFICIAL_LINKS,
  };
}
