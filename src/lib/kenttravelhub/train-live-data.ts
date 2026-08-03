import { fetchSoutheasternDisruptions } from "@/lib/kenttravelhub/fetchers/rail-disruptions";
import { fetchStationTransfers } from "@/lib/kenttravelhub/fetchers/rail-journey";
import { fetchStationBoard } from "@/lib/kenttravelhub/fetchers/rail-ldb";
import {
  isLondonDestination,
  KTH_STATIONS,
  KTH_STATION_ORDER,
  KTH_TRAIN_GUIDES,
  KTH_TRAIN_OFFICIAL_LINKS,
  pickNextDeparture,
  type KthStationId,
  type KthTrainLiveBoard,
  type KthTrainLiveDashboard,
  type KthTrainService,
} from "@/lib/kenttravelhub/train-live";

function countDelayed(services: KthTrainService[]): number {
  return services.filter((s) => s.delayed && !s.cancelled).length;
}

function countCancelled(services: KthTrainService[]): number {
  return services.filter((s) => s.cancelled).length;
}

export async function getTrainLiveDashboard(): Promise<KthTrainLiveDashboard> {
  const boardUpdatedAt = new Date().toISOString();

  const [stationResults, transfers] = await Promise.all([
    Promise.all(
      KTH_STATION_ORDER.map(async (id) => {
        const meta = KTH_STATIONS[id];
        const board = await fetchStationBoard(meta.crs);
        return { id, meta, board };
      }),
    ),
    fetchStationTransfers(),
  ]);

  const boards: KthTrainLiveBoard[] = stationResults.map(({ id, meta, board }) => ({
    id,
    name: meta.name,
    crs: meta.crs,
    officialBoardUrl: meta.officialBoardUrl,
    arrivals: board.arrivals.slice(0, 12),
    departures: board.departures.slice(0, 12),
    source: board.source,
    updatedAt: boardUpdatedAt,
    liveAvailable: board.liveAvailable,
  }));

  const nrccMessages = stationResults.flatMap(({ board }) => board.messages);

  const disruptions = await fetchSoutheasternDisruptions(nrccMessages);

  const allServices = boards.flatMap((b) => [...b.arrivals, ...b.departures]);
  const doverBoard = boards.find((b) => b.id === "dover-priory");
  const doverDepartures = doverBoard?.departures ?? [];

  const londonDepartures = doverDepartures
    .filter(isLondonDestination)
    .slice(0, 6);

  return {
    updatedAt: boardUpdatedAt,
    nextDeparture: pickNextDeparture(doverDepartures),
    londonDepartures,
    delayed: countDelayed(allServices),
    cancelled: countCancelled(allServices),
    disruptions,
    transfers: transfers.filter((t) =>
      ["cruise-terminal", "ferry-terminal"].includes(t.id),
    ),
    stations: boards,
    mainStationId: "dover-priory" as KthStationId,
    guides: KTH_TRAIN_GUIDES,
    officialLinks: KTH_TRAIN_OFFICIAL_LINKS,
  };
}
