import type { LiveSeverity, LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import { KTH_DOVER_HOTELS, KTH_DOVER_RESTAURANTS } from "@/lib/kenttravelhub/content";

export const KTH_SITE_SECTIONS = [
  {
    number: 1,
    id: "cruise",
    path: "/cruise",
    label: "Cruise",
    shortLabel: "Cruise",
    emoji: "🚢",
    description: "Live cruise arrivals, ship schedules and terminal guides.",
    metaTitle: "Dover Cruise Arrivals Today | Ships in Port | Kent Travel Hub",
    metaDescription:
      "Live Dover cruise ship schedule — arrivals and departures today, this week and month. CT1 & CT2 terminal times from Port of Dover data.",
    accent: "border-blue-500",
    panelBg: "bg-blue-600",
    homeDashboard: true,
  },
  {
    number: 2,
    id: "ferries",
    path: "/ferries",
    label: "Ferries",
    shortLabel: "Ferries",
    emoji: "⛴",
    description: "Dover–Calais & Dunkirk updates, DFDS, P&O and port waiting times.",
    metaTitle: "Dover Ferry Updates Live | Calais & Dunkirk | Kent Travel Hub",
    metaDescription:
      "Live Dover ferry delays, DFDS and P&O status, cross-Channel arrivals from France and port waiting times at the Eastern Docks.",
    accent: "border-kth-sea",
    panelBg: "bg-kth-sea",
    homeDashboard: true,
  },
  {
    number: 3,
    id: "airports",
    path: "/airports",
    label: "Airports",
    shortLabel: "Airports",
    emoji: "✈",
    description: "Gatwick, Heathrow, Stansted and Luton transfer guides from Dover.",
    metaTitle: "Dover to Heathrow & Gatwick | Airport Transfers | Kent Travel Hub",
    metaDescription:
      "Airport transfer guides from Dover port and cruise terminal — Heathrow, Gatwick, Stansted and Luton journey times, fares and routes.",
    accent: "border-violet-500",
    panelBg: "bg-violet-600",
    homeDashboard: true,
  },
  {
    number: 4,
    id: "live",
    path: "/live",
    label: "Live Travel",
    shortLabel: "Live",
    emoji: "🚦",
    description: "M20 traffic, Operation Brock, Dover port status and live cameras.",
    metaTitle: "Dover Live Travel | M20, Port Traffic & Webcams | Kent Travel Hub",
    metaDescription:
      "Live M20 traffic to Dover, Operation Brock status, port queues, Dover weather and Kent road cameras — updated throughout the day.",
    accent: "border-amber-500",
    panelBg: "bg-amber-600",
    homeDashboard: true,
  },
  {
    number: 5,
    id: "visit",
    path: "/visit",
    label: "Visit Kent",
    shortLabel: "Visit",
    emoji: "🏰",
    description: "White Cliffs, Dover Castle, Canterbury and the Kent coast.",
    metaTitle: "Visit Kent from Dover | White Cliffs, Castle & Canterbury",
    metaDescription:
      "Day trips from Dover port and cruise terminal — White Cliffs, Dover Castle, Canterbury Cathedral, Deal and Folkestone with official links and planning guides.",
    accent: "border-emerald-500",
    panelBg: "bg-emerald-600",
    homeDashboard: false,
  },
  {
    number: 6,
    id: "stay",
    path: "/stay",
    label: "Hotels & Eat",
    shortLabel: "Stay",
    emoji: "🏨",
    description: "Hotels, B&Bs and restaurants near Dover port and across Kent.",
    metaTitle: "Hotels & Restaurants near Dover Port | Stay in Kent",
    metaDescription:
      "Hotels, B&Bs and restaurants within 5 miles of Dover port and cruise terminal — direct booking links for Dover, Deal and Canterbury.",
    accent: "border-rose-500",
    panelBg: "bg-rose-600",
    homeDashboard: false,
  },
] as const;

export const KTH_DASHBOARD_SECTIONS = KTH_SITE_SECTIONS.filter(
  (section) => section.homeDashboard,
);

export type KthSiteSection = (typeof KTH_SITE_SECTIONS)[number];
export type KthSiteSectionId = KthSiteSection["id"];

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
