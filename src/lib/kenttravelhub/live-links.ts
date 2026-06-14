/** Official live-data destinations — same pattern as Met Office for weather. */
export const KTH_LIVE_ARTICLE_SLUGS = {
  port: "dover-port-waiting-times",
  ferry: "dover-ferry-dfds-po-updates",
  m20: "m20-traffic-today",
  brock: "operation-brock-kent",
  cruise: "cruise-terminal",
  calaisDunkirk: "calais-vs-dunkirk-ferry-guide",
} as const;

export type KthLiveExternalLink = {
  href: string;
  label: string;
};

export const KTH_LIVE_EXTERNAL_LINKS = {
  port: {
    href: "https://www.portofdover.com/",
    label: "Port of Dover live",
  },
  ferry: {
    href: "https://www.dfds.com/en-gb/passenger-ferries/passenger-information/travel-updates",
    label: "DFDS travel updates",
  },
  m20: {
    href: "https://nationalhighways.co.uk/travel-updates/",
    label: "National Highways live",
  },
  brock: {
    href: "https://nationalhighways.co.uk/our-network/operation-brock/",
    label: "Operation Brock info",
  },
  weather: {
    href: "https://www.metoffice.gov.uk/weather/forecast/gcqybuw7b",
    label: "Met Office forecast",
  },
  cruise: {
    href: "https://www.portofdover.com/cruise/schedule-tickets/",
    label: "Port of Dover schedule",
  },
  ferryTimetable: {
    href: "https://www.dfds.com/en/passenger-ferries/passenger-information/timetables",
    label: "DFDS timetables",
  },
  trafficEngland: {
    href: "https://www.trafficengland.com/",
    label: "Traffic England cameras",
  },
  kentTraffic: {
    href: "https://nro.kenttraffic.info/",
    label: "Kent Traffic CCTV",
  },
} as const satisfies Record<string, KthLiveExternalLink>;

export type KthLiveDetailLinks = {
  port: KthLiveExternalLink;
  ferry: KthLiveExternalLink;
  m20: KthLiveExternalLink;
  brock: KthLiveExternalLink;
  weather: KthLiveExternalLink;
  cruise: KthLiveExternalLink;
};

export const KTH_LIVE_DETAIL_LINKS: KthLiveDetailLinks = {
  port: KTH_LIVE_EXTERNAL_LINKS.port,
  ferry: KTH_LIVE_EXTERNAL_LINKS.ferry,
  m20: KTH_LIVE_EXTERNAL_LINKS.m20,
  brock: KTH_LIVE_EXTERNAL_LINKS.brock,
  weather: KTH_LIVE_EXTERNAL_LINKS.weather,
  cruise: KTH_LIVE_EXTERNAL_LINKS.cruise,
};

/** @deprecated Use KTH_WEATHER_FORECAST_URL from KTH_LIVE_EXTERNAL_LINKS.weather.href */
export const KTH_WEATHER_FORECAST_URL = KTH_LIVE_EXTERNAL_LINKS.weather.href;
