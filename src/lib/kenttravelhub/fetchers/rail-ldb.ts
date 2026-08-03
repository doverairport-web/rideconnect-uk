import {
  enrichTrainFlags,
  nationalRailBoardUrl,
  type KthTrainDirection,
  type KthTrainService,
} from "@/lib/kenttravelhub/train-live";
import { fetchJson, fetchText } from "@/lib/kenttravelhub/fetchers/http";

const TOKEN_NS = "http://thalesgroup.com/RTTI/2013-11-28/Token/types";
const LDB_NS = "http://thalesgroup.com/RTTI/2017-10-01/ldb/";
const SOAP_ENDPOINT = "https://realtime.nationalrail.co.uk/OpenLDBWS/ldb11.asmx";

const RDM_API_BASE = "https://api1.raildata.org.uk";
const RDM_DEP_PRODUCT_PATHS = [
  "1010-live-departure-board-dep",
  "1010-live-departure-board-dep1_2",
  "1010-live-departure-board-dep1_1",
];
const RDM_ARR_PRODUCT_PATHS = [
  "1010-live-arrival-board-arr",
  "1010-live-arrival-board-arr1_1",
  "1010-live-arrival-board-arr1_2",
];

type RdmLocation = {
  locationName?: string;
  crs?: string;
};

type RdmService = {
  std?: string;
  etd?: string;
  sta?: string;
  eta?: string;
  platform?: string;
  operator?: string;
  operatorCode?: string;
  serviceID?: string;
  rsid?: string;
  isCancelled?: boolean;
  filterLocationCancelled?: boolean;
  delayReason?: string;
  cancelReason?: string;
  destination?: RdmLocation[];
  origin?: RdmLocation[];
};

type RdmBoard = {
  generatedAt?: string;
  locationName?: string;
  crs?: string;
  trainServices?: RdmService[];
  nrccMessages?: Array<{ Value?: string; value?: string } | string>;
  platformAvailable?: boolean;
  areServicesAvailable?: boolean;
};

type HuxleyService = {
  std?: string;
  etd?: string;
  sta?: string;
  eta?: string;
  platform?: string;
  operator?: string;
  operatorCode?: string;
  serviceID?: string;
  rsid?: string;
  isCancelled?: boolean;
  delayReason?: string;
  cancelReason?: string;
  destination?: Array<{ locationName?: string; crs?: string }>;
  origin?: Array<{ locationName?: string; crs?: string }>;
};

type HuxleyBoard = {
  generatedAt?: string;
  locationName?: string;
  crs?: string;
  trainServices?: { service?: HuxleyService | HuxleyService[] };
  nrccMessages?: { message?: string | string[] };
  platformAvailable?: boolean;
};

function resolveLdbToken(): string | null {
  for (const key of [
    process.env.NATIONAL_RAIL_LDB_TOKEN,
    process.env.NATIONAL_RAIL_RDM_API_KEY,
  ]) {
    const trimmed = key?.trim();
    if (trimmed) return trimmed;
  }
  return null;
}

/**
 * The Rail Data Marketplace issues a separate consumer key per data product.
 * Departures use the "Live Departure Board" key; arrivals use the "Live Arrival
 * Board" key. Fall back to the departure key so a single-product setup keeps
 * working.
 */
function resolveArrivalToken(): string | null {
  for (const key of [
    process.env.NATIONAL_RAIL_LDB_ARR_TOKEN,
    process.env.NATIONAL_RAIL_RDM_ARR_API_KEY,
  ]) {
    const trimmed = key?.trim();
    if (trimmed) return trimmed;
  }
  return resolveLdbToken();
}

function resolveHuxleyBase(): string {
  return (
    process.env.NATIONAL_RAIL_HUXLEY_URL?.trim() ||
    "https://huxley2.azurewebsites.net"
  ).replace(/\/$/, "");
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function locationLabel(
  points: Array<{ locationName?: string; crs?: string }> | undefined,
): { label: string; crs?: string } {
  const first = points?.[0];
  return {
    label: first?.locationName?.trim() || "—",
    crs: first?.crs?.trim(),
  };
}

function parseNrccMessages(
  messages: RdmBoard["nrccMessages"],
): string[] {
  return asArray(messages)
    .map((message) => {
      if (typeof message === "string") return message.trim();
      return (message.Value ?? message.value ?? "").trim();
    })
    .filter(Boolean);
}

function mapRdmService(
  service: RdmService,
  direction: KthTrainDirection,
  index: number,
  crs: string,
): KthTrainService {
  const route =
    direction === "departure"
      ? locationLabel(service.destination)
      : locationLabel(service.origin);
  const scheduled = direction === "departure" ? service.std ?? "" : service.sta ?? "";
  const rawExpected = direction === "departure" ? service.etd : service.eta;
  const expected =
    rawExpected && !/^on time$/i.test(rawExpected) ? rawExpected : undefined;
  const cancelled = Boolean(
    service.isCancelled ||
      service.filterLocationCancelled ||
      service.cancelReason ||
      /^cancelled$/i.test(rawExpected ?? ""),
  );
  const status = cancelled
    ? "Cancelled"
    : service.delayReason?.trim() ||
      (rawExpected && !/^\d{1,2}:\d{2}$/.test(rawExpected) ? rawExpected : "On time");

  const base: KthTrainService = {
    id: `${crs}-${direction}-${service.serviceID ?? service.rsid ?? index}`,
    direction,
    operator: service.operator?.trim() || "—",
    routeLabel: route.label,
    routeCrs: route.crs,
    scheduledTime: scheduled,
    expectedTime: expected,
    status,
    platform: service.platform?.trim() || undefined,
    delayed: false,
    cancelled,
  };
  return enrichTrainFlags(base);
}

function mapHuxleyService(
  service: HuxleyService,
  direction: KthTrainDirection,
  index: number,
  crs: string,
): KthTrainService {
  const route =
    direction === "departure"
      ? locationLabel(service.destination)
      : locationLabel(service.origin);
  const scheduled = direction === "departure" ? service.std ?? "" : service.sta ?? "";
  const rawExpected = direction === "departure" ? service.etd : service.eta;
  const expected =
    rawExpected && !/^on time$/i.test(rawExpected) ? rawExpected : undefined;
  const status = service.isCancelled
    ? "Cancelled"
    : service.delayReason?.trim() ||
      service.cancelReason?.trim() ||
      (rawExpected && !/^\d{1,2}:\d{2}$/.test(rawExpected) ? rawExpected : "On time");

  const base: KthTrainService = {
    id: `${crs}-${direction}-${service.serviceID ?? service.rsid ?? index}`,
    direction,
    operator: service.operator?.trim() || "—",
    routeLabel: route.label,
    routeCrs: route.crs,
    scheduledTime: scheduled,
    expectedTime: expected,
    status,
    platform: service.platform?.trim() || undefined,
    delayed: false,
    cancelled: Boolean(service.isCancelled),
  };
  return enrichTrainFlags(base);
}

function mapHuxleyBoard(
  board: HuxleyBoard,
  direction: KthTrainDirection,
  crs: string,
): KthTrainService[] {
  return asArray(board.trainServices?.service).map((service, index) =>
    mapHuxleyService(service, direction, index, crs),
  );
}

function rdmOperation(direction: KthTrainDirection): string {
  return direction === "departure"
    ? "GetDepBoardWithDetails"
    : "GetArrBoardWithDetails";
}

async function fetchRdmBoard(
  crs: string,
  direction: KthTrainDirection,
  rows = 15,
): Promise<{ services: KthTrainService[]; messages: string[]; source: string } | null> {
  const apiKey =
    direction === "departure" ? resolveLdbToken() : resolveArrivalToken();
  if (!apiKey) return null;

  const operation = rdmOperation(direction);
  const code = crs.toUpperCase();
  const productPaths =
    direction === "departure" ? RDM_DEP_PRODUCT_PATHS : RDM_ARR_PRODUCT_PATHS;

  for (const productPath of productPaths) {
    const url = `${RDM_API_BASE}/${productPath}/LDBWS/api/20220120/${operation}/${code}?numRows=${rows}&timeOffset=0&timeWindow=120`;

    const board = await fetchJson<RdmBoard>(url, {
      headers: {
        Accept: "application/json",
        "x-apikey": apiKey,
      },
      next: { revalidate: 45 },
    });

    if (!board?.crs && !board?.trainServices?.length) continue;

    return {
      services: asArray(board.trainServices).map((service, index) =>
        mapRdmService(service, direction, index, code),
      ),
      messages: parseNrccMessages(board.nrccMessages),
      source: "raildata.org.uk/ldbws",
    };
  }

  return null;
}

async function fetchHuxleyBoard(
  crs: string,
  direction: KthTrainDirection,
  rows = 15,
): Promise<{ services: KthTrainService[]; messages: string[]; source: string } | null> {
  const token = resolveLdbToken();
  if (!token) return null;

  const base = resolveHuxleyBase();
  const path = direction === "departure" ? "departures" : "arrivals";
  const url = `${base}/${path}/${crs.toLowerCase()}/${rows}?accessToken=${encodeURIComponent(token)}`;

  const board = await fetchJson<HuxleyBoard>(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 45 },
  });
  if (!board?.crs) return null;

  const messages = asArray(board.nrccMessages?.message)
    .map((m) => m?.trim())
    .filter(Boolean) as string[];

  return {
    services: mapHuxleyBoard(board, direction, crs),
    messages,
    source: "nationalrail.co.uk/huxley",
  };
}

function extractXmlValues(xml: string, tag: string): string[] {
  const re = new RegExp(
    `<(?:[\\w-]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[\\w-]+:)?${tag}>`,
    "gi",
  );
  const values: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml)) !== null) {
    values.push(match[1].trim());
  }
  return values;
}

function extractServiceBlocks(xml: string): string[] {
  return extractXmlValues(xml, "service");
}

function xmlTag(block: string, tag: string): string | undefined {
  const match = block.match(
    new RegExp(`<(?:[\\w-]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[\\w-]+:)?${tag}>`, "i"),
  );
  return match?.[1]?.trim();
}

function mapSoapService(
  block: string,
  direction: KthTrainDirection,
  index: number,
  crs: string,
): KthTrainService {
  const scheduled =
    direction === "departure"
      ? xmlTag(block, "std") ?? ""
      : xmlTag(block, "sta") ?? "";
  const rawExpected =
    direction === "departure" ? xmlTag(block, "etd") : xmlTag(block, "eta");
  const expected =
    rawExpected && !/^on time$/i.test(rawExpected) ? rawExpected : undefined;

  const routeBlock =
    direction === "departure"
      ? xmlTag(block, "destination")
      : xmlTag(block, "origin");
  const routeName = routeBlock
    ? xmlTag(routeBlock, "locationName") ?? "—"
    : "—";
  const routeCrs = routeBlock ? xmlTag(routeBlock, "crs") : undefined;

  const cancelReason = xmlTag(block, "cancelReason");
  const delayReason = xmlTag(block, "delayReason");
  const cancelled = Boolean(cancelReason) || /^cancelled$/i.test(rawExpected ?? "");
  const status = cancelled
    ? "Cancelled"
    : delayReason || (rawExpected && !/^\d{1,2}:\d{2}$/.test(rawExpected) ? rawExpected : "On time");

  const base: KthTrainService = {
    id: `${crs}-${direction}-${xmlTag(block, "serviceID") ?? index}`,
    direction,
    operator: xmlTag(block, "operator") ?? "—",
    routeLabel: routeName,
    routeCrs,
    scheduledTime: scheduled,
    expectedTime: expected,
    status,
    platform: xmlTag(block, "platform"),
    delayed: false,
    cancelled,
  };
  return enrichTrainFlags(base);
}

async function fetchSoapBoard(
  crs: string,
  direction: KthTrainDirection,
  rows = 15,
): Promise<{ services: KthTrainService[]; messages: string[]; source: string } | null> {
  const token = resolveLdbToken();
  if (!token) return null;

  const action =
    direction === "departure"
      ? `${LDB_NS}GetDepartureBoard`
      : `${LDB_NS}GetArrivalBoard`;
  const requestTag =
    direction === "departure"
      ? "GetDepartureBoardRequest"
      : "GetArrivalBoardRequest";

  const body = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ldb="${LDB_NS}" xmlns:tok="${TOKEN_NS}">
  <soap:Header>
    <tok:AccessToken>
      <tok:TokenValue>${token}</tok:TokenValue>
    </tok:AccessToken>
  </soap:Header>
  <soap:Body>
    <ldb:${requestTag}>
      <ldb:numRows>${rows}</ldb:numRows>
      <ldb:crs>${crs.toUpperCase()}</ldb:crs>
      <ldb:timeOffset>0</ldb:timeOffset>
      <ldb:timeWindow>120</ldb:timeWindow>
    </ldb:${requestTag}>
  </soap:Body>
</soap:Envelope>`;

  const xml = await fetchText(SOAP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: `"${action}"`,
    },
    body,
    next: { revalidate: 45 },
  });
  if (!xml || /Fault|Error|Unauthorized|Invalid/i.test(xml)) return null;

  const messages = extractXmlValues(xml, "Value");
  const services = extractServiceBlocks(xml).map((block, index) =>
    mapSoapService(block, direction, index, crs),
  );

  if (!services.length) return null;

  return {
    services,
    messages,
    source: "nationalrail.co.uk/openldbws",
  };
}

export type StationBoardResult = {
  arrivals: KthTrainService[];
  departures: KthTrainService[];
  messages: string[];
  source: string;
  liveAvailable: boolean;
};

export async function fetchStationBoard(
  crs: string,
  rows = 15,
): Promise<StationBoardResult> {
  const [depRdm, arrRdm] = await Promise.all([
    fetchRdmBoard(crs, "departure", rows),
    fetchRdmBoard(crs, "arrival", rows),
  ]);

  if (depRdm || arrRdm) {
    return {
      departures: depRdm?.services ?? [],
      arrivals: arrRdm?.services ?? [],
      messages: [...(depRdm?.messages ?? []), ...(arrRdm?.messages ?? [])],
      source: depRdm?.source ?? arrRdm?.source ?? "raildata.org.uk",
      liveAvailable: true,
    };
  }

  const [depHuxley, arrHuxley] = await Promise.all([
    fetchHuxleyBoard(crs, "departure", rows),
    fetchHuxleyBoard(crs, "arrival", rows),
  ]);

  if (depHuxley || arrHuxley) {
    return {
      departures: depHuxley?.services ?? [],
      arrivals: arrHuxley?.services ?? [],
      messages: [...(depHuxley?.messages ?? []), ...(arrHuxley?.messages ?? [])],
      source: depHuxley?.source ?? arrHuxley?.source ?? "nationalrail.co.uk",
      liveAvailable: true,
    };
  }

  const [depSoap, arrSoap] = await Promise.all([
    fetchSoapBoard(crs, "departure", rows),
    fetchSoapBoard(crs, "arrival", rows),
  ]);

  if (depSoap || arrSoap) {
    return {
      departures: depSoap?.services ?? [],
      arrivals: arrSoap?.services ?? [],
      messages: [...(depSoap?.messages ?? []), ...(arrSoap?.messages ?? [])],
      source: depSoap?.source ?? arrSoap?.source ?? "nationalrail.co.uk/openldbws",
      liveAvailable: true,
    };
  }

  return {
    departures: [],
    arrivals: [],
    messages: [],
    source: "nationalrail.co.uk",
    liveAvailable: false,
  };
}

export function officialStationLinks(crs: string) {
  return {
    departures: nationalRailBoardUrl(crs, "dep"),
    arrivals: nationalRailBoardUrl(crs, "arr"),
  };
}
