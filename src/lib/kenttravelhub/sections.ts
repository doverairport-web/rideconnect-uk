import type { LiveSeverity, LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import { KTH_DOVER_HOTELS, KTH_DOVER_RESTAURANTS } from "@/lib/kenttravelhub/content";

import { KTH_HOME_SECTION_HEADINGS } from "@/lib/kenttravelhub/home-dashboard";

export const KTH_SITE_SECTIONS = [
  {
    number: 1,
    id: "cruise",
    path: "/cruise",
    label: "Cruise",
    homeHeading: KTH_HOME_SECTION_HEADINGS.cruise,
    shortLabel: "Cruise",
    emoji: "🚢",
    description:
      "Today's cruise ships in Dover — arrivals, departures, terminal and passenger pickup advice.",
    metaTitle: "Dover Cruise Arrivals Today | Ships in Port | Kent Travel Hub",
    metaDescription:
      "Live Dover cruise ship schedule — arrivals and departures today, CT1 & CT2 terminal times, taxi pickup tips and the full Port of Dover cruise calendar.",
    accent: "border-blue-500",
    panelBg: "bg-blue-600",
    homeDashboard: true,
  },
  {
    number: 2,
    id: "ferries",
    path: "/ferries",
    label: "Ferries",
    homeHeading: KTH_HOME_SECTION_HEADINGS.ferries,
    shortLabel: "Ferries",
    emoji: "⛴",
    description:
      "DFDS and P&O status, Dover–Calais and Dunkirk updates, arrivals and check-in advice.",
    metaTitle: "Dover Ferry Updates Live | Calais & Dunkirk | Kent Travel Hub",
    metaDescription:
      "Live Dover ferry delays, DFDS and P&O status, cross-Channel arrivals from France, check-in times and port waiting times at the Eastern Docks.",
    accent: "border-kth-sea",
    panelBg: "bg-kth-sea",
    homeDashboard: true,
  },
  {
    number: 3,
    id: "airports",
    path: "/airports",
    label: "Airports",
    homeHeading: "Airport Live Centre",
    shortLabel: "Airports",
    emoji: "✈",
    description:
      "Live Heathrow, Gatwick, Stansted and Luton boards — arrivals, departures, delays and Dover travel times.",
    metaTitle: "Airport Live Centre | Dover to Heathrow, Gatwick & London | Kent Travel Hub",
    metaDescription:
      "Live flight boards for Heathrow, Gatwick, Stansted and Luton — arrivals, departures, delays, airport weather and Dover travel times with M20 and Operation Brock status.",
    accent: "border-violet-500",
    panelBg: "bg-violet-600",
    homeDashboard: true,
  },
  {
    number: 4,
    id: "trains",
    path: "/trains",
    label: "Trains",
    homeHeading: "Train Live Centre",
    shortLabel: "Trains",
    emoji: "🚆",
    description:
      "Live Dover Priory departures and arrivals — Southeastern delays, London connections and taxi times to the cruise and ferry terminals.",
    metaTitle: "Train Live Centre | Dover Priory & Kent Rail | Kent Travel Hub",
    metaDescription:
      "Live train boards for Dover Priory, Folkestone, Ashford and Canterbury — departures, arrivals, delays, Southeastern alerts and taxi times to CT1, CT2 and the ferry port.",
    accent: "border-sky-500",
    panelBg: "bg-sky-600",
    homeDashboard: true,
  },
  {
    number: 5,
    id: "buses",
    path: "/buses",
    label: "Buses",
    homeHeading: "Bus Live Centre",
    shortLabel: "Buses",
    emoji: "🚌",
    description:
      "Live Stagecoach departures for Dover town centre, Priory station, ferry and cruise docks — plus routes to Canterbury and Folkestone.",
    metaTitle: "Bus Live Centre | Dover & Kent Buses | Kent Travel Hub",
    metaDescription:
      "Live bus boards for Dover Pencester Road, Priory station, Eastern Docks and Western Docks — Stagecoach routes to Canterbury, Folkestone, Deal and the White Cliffs.",
    accent: "border-lime-500",
    panelBg: "bg-lime-600",
    homeDashboard: true,
  },
  {
    number: 6,
    id: "live",
    path: "/live",
    label: "Live Travel",
    homeHeading: KTH_HOME_SECTION_HEADINGS.live,
    shortLabel: "Live",
    emoji: "🚦",
    description:
      "Dover port waiting times, M20 traffic, Operation Brock, weather and severe alerts.",
    metaTitle: "Dover Live Travel | M20, Port Traffic & Webcams | Kent Travel Hub",
    metaDescription:
      "Live M20 traffic to Dover, Operation Brock status, port queues, Dover weather, severe alerts and Kent road cameras — updated throughout the day.",
    accent: "border-amber-500",
    panelBg: "bg-amber-600",
    homeDashboard: true,
  },
  {
    number: 7,
    id: "visit",
    path: "/visit",
    label: "Visit Kent",
    homeHeading: KTH_HOME_SECTION_HEADINGS.visit,
    shortLabel: "Visit",
    emoji: "🏰",
    description:
      "White Cliffs, Dover Castle, South Foreland Lighthouse and day trips near the port.",
    metaTitle: "Visit Kent from Dover | White Cliffs, Castle & Lighthouse",
    metaDescription:
      "Things to do near Dover before or after cruise or ferry travel — White Cliffs, Dover Castle, South Foreland Lighthouse, Canterbury and the Kent coast.",
    accent: "border-emerald-500",
    panelBg: "bg-emerald-600",
    homeDashboard: true,
  },
  {
    number: 8,
    id: "stay",
    path: "/stay",
    label: "Hotels & Eat",
    homeHeading: KTH_HOME_SECTION_HEADINGS.stay,
    shortLabel: "Stay",
    emoji: "🏨",
    description:
      "Official cruise-passenger hotels near CT1 and CT2 — distances, taxi times, parking and direct booking links.",
    metaTitle: "Cruise Hotels near Dover CT1 & CT2 | Kent Travel Hub",
    metaDescription:
      "Eight Dover hotels cruise passengers actually use — official photos, distances from CT1 and CT2, taxi times, parking and links to book direct before embarkation.",
    accent: "border-rose-500",
    panelBg: "bg-rose-600",
    homeDashboard: true,
  },
] as const;

export type KthSiteSection = (typeof KTH_SITE_SECTIONS)[number];
export type KthSiteSectionId = KthSiteSection["id"];

export const KTH_DASHBOARD_SECTIONS = KTH_SITE_SECTIONS.filter(
  (section) => section.homeDashboard,
);

/** Homepage card order — daily checks only (no tourist sections). */
export const KTH_HOME_SECTION_ORDER: readonly KthSiteSectionId[] = [
  "cruise",
  "ferries",
  "live",
  "visit",
];

export function kthHomeSections(): KthSiteSection[] {
  const byId = Object.fromEntries(
    KTH_SITE_SECTIONS.map((section) => [section.id, section]),
  ) as Record<KthSiteSectionId, KthSiteSection>;
  return KTH_HOME_SECTION_ORDER.map((id) => byId[id]);
}

export type SectionLivePreview = {
  headline: string;
  detail: string;
  severity: LiveSeverity | "neutral";
};

function severityLabel(
  severity: LiveSeverity,
  ok: string,
  warn: string,
  alert: string,
): string {
  if (severity === "alert") return alert;
  if (severity === "warn") return warn;
  return ok;
}

export function buildSiteSectionLive(
  sectionId: KthSiteSectionId,
  data: LiveTravelSnapshot | null,
): SectionLivePreview {
  if (!data) {
    return { headline: "Loading…", detail: "Fetching live data", severity: "neutral" };
  }

  if (sectionId === "cruise") {
    const ships = data.cruiseArrivals;
    if (ships.length === 0) {
      return {
        headline: "No ships listed today",
        detail: "Check Port of Dover schedule for updates",
        severity: "neutral",
      };
    }
    const first = ships[0];
    return {
      headline: `${first.name} · ${first.time}`,
      detail: `${ships.length} ship${ships.length === 1 ? "" : "s"} in port today`,
      severity: ships.length >= 2 ? "warn" : "ok",
    };
  }

  if (sectionId === "ferries") {
    const next = data.ferryArrivals[0];
    if (next) {
      return {
        headline: `${next.operator} arrives ${next.arrives}`,
        detail: `${next.route} · ${next.status.replace("-", " ")}`,
        severity: data.ferryDelays.severity,
      };
    }
    return {
      headline: data.ferryDelays.severity === "ok" ? "Services running" : "Check delays",
      detail: data.ferryDelays.detail.slice(0, 72),
      severity: data.ferryDelays.severity,
    };
  }

  if (sectionId === "airports") {
    const mins = data.m20JourneyMinutes;
    if (mins) {
      const delay =
        data.m20DelayMinutes && data.m20DelayMinutes > 0
          ? ` (+${data.m20DelayMinutes} min on road)`
          : "";
      return {
        headline: `M20 to Dover: ${mins} min${delay}`,
        detail: "Live drive time — affects airport transfer times",
        severity: data.m20Traffic.severity,
      };
    }
    return {
      headline: "Gatwick, Heathrow, Stansted, Luton",
      detail: "Transfer guides and typical journey times from Dover",
      severity: "neutral",
    };
  }

  if (sectionId === "trains") {
    return {
      headline: "Dover Priory live board",
      detail: "Southeastern to London St Pancras & Victoria — taxi to port",
      severity: "neutral",
    };
  }

  if (sectionId === "buses") {
    return {
      headline: "Dover town centre buses",
      detail: "Stagecoach 15, 63, 66 — Priory, ferry & cruise docks",
      severity: "neutral",
    };
  }

  if (sectionId === "live") {
    const port = data.doverPortTraffic;
    const m20 = data.m20JourneyMinutes;
    const brock = data.operationBrock.active;
    const parts: string[] = [];
    if (m20) parts.push(`M20 ${m20} min`);
    parts.push(
      severityLabel(port.severity, "Port moving", "Port busy", "Port heavy"),
    );
    if (brock) parts.push("Brock active");
    return {
      headline: parts.join(" · "),
      detail: port.detail.slice(0, 72),
      severity: brock || port.severity === "alert" ? "warn" : port.severity,
    };
  }

  if (sectionId === "visit") {
    return {
      headline: "Dover Castle · White Cliffs · Canterbury",
      detail: "Castles, coastline and cathedral towns across Kent",
      severity: "neutral",
    };
  }

  if (sectionId === "stay") {
    const areas = [...new Set(KTH_DOVER_RESTAURANTS.map((r) => r.subtitle.split("·")[0].trim()))];
    return {
      headline: `${KTH_DOVER_HOTELS.length} hotels · ${KTH_DOVER_RESTAURANTS.length} restaurants`,
      detail: `Dover, Deal & coast — ${areas.slice(0, 3).join(", ")}`,
      severity: "neutral",
    };
  }

  return {
    headline: "Kent travel",
    detail: "Open section for guides and links",
    severity: "neutral",
  };
}
