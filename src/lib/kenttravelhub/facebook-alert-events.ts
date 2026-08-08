import type { LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import type { KthTrainLiveDashboard } from "@/lib/kenttravelhub/train-live";

export type TravelAlertSeverity = "warn" | "alert";

export type TravelAlert = {
  /** Stable key for deduplication, e.g. "brock-active". */
  id: string;
  severity: TravelAlertSeverity;
  title: string;
  detail: string;
  /** Changes when the underlying situation changes (not just time). */
  fingerprint: string;
};

const M20_DELAY_ALERT_MIN = 15;
const M20_JOURNEY_ALERT_MIN = 45;

function pushAlert(
  alerts: TravelAlert[],
  alert: TravelAlert | null,
): void {
  if (alert) alerts.push(alert);
}

/** Significant Dover travel events worth an urgent Facebook post. */
export function detectTravelAlerts(
  data: LiveTravelSnapshot,
  train: KthTrainLiveDashboard | null = null,
): TravelAlert[] {
  const alerts: TravelAlert[] = [];

  if (data.operationBrock.active) {
    pushAlert(alerts, {
      id: "brock-active",
      severity: "alert",
      title: "Operation Brock ACTIVE",
      detail: data.operationBrock.detail,
      fingerprint: `active:${data.operationBrock.detail}`,
    });
  }

  const m20Heavy =
    data.m20Traffic.severity === "alert" ||
    (data.m20DelayMinutes ?? 0) >= M20_DELAY_ALERT_MIN ||
    (data.m20JourneyMinutes ?? 0) >= M20_JOURNEY_ALERT_MIN;

  if (m20Heavy) {
    const journey = data.m20JourneyMinutes
      ? `${data.m20JourneyMinutes} min J11A → Dover`
      : data.m20Traffic.detail;
    const delay =
      data.m20DelayMinutes && data.m20DelayMinutes > 0
        ? ` (+${data.m20DelayMinutes} min delay)`
        : "";
    pushAlert(alerts, {
      id: "m20-traffic",
      severity: data.m20Traffic.severity === "alert" ? "alert" : "warn",
      title: "M20 traffic alert",
      detail: `${journey}${delay}`,
      fingerprint: `${data.m20Traffic.severity}:${data.m20JourneyMinutes ?? 0}:${data.m20DelayMinutes ?? 0}`,
    });
  }

  if (data.doverPortTraffic.severity !== "ok") {
    pushAlert(alerts, {
      id: "port-traffic",
      severity: data.doverPortTraffic.severity === "alert" ? "alert" : "warn",
      title:
        data.doverPortTraffic.severity === "alert"
          ? "Dover Port heavy traffic"
          : "Dover Port busy",
      detail: data.doverPortTraffic.detail,
      fingerprint: `${data.doverPortTraffic.severity}:${data.doverPortTraffic.detail}`,
    });
  }

  if (data.ferryDelays.severity !== "ok") {
    pushAlert(alerts, {
      id: "ferry-delays",
      severity: data.ferryDelays.severity === "alert" ? "alert" : "warn",
      title: "Ferry delays possible",
      detail: data.ferryDelays.detail,
      fingerprint: `${data.ferryDelays.severity}:${data.ferryDelays.detail}`,
    });
  }

  for (const disruption of train?.disruptions ?? []) {
    if (disruption.severity === "ok") continue;
    pushAlert(alerts, {
      id: `train-${disruption.id}`,
      severity: disruption.severity === "alert" ? "alert" : "warn",
      title: disruption.title,
      detail: disruption.detail,
      fingerprint: `${disruption.severity}:${disruption.title}:${disruption.detail.slice(0, 120)}`,
    });
  }

  const shipsToday = data.cruiseCalendar.today.length;
  if (shipsToday >= 2) {
    const names = data.cruiseCalendar.today
      .map((s) => `${s.name} ${s.arrives}`)
      .join(" · ");
    pushAlert(alerts, {
      id: "cruise-busy",
      severity: "warn",
      title: `${shipsToday} cruise ships in Dover today`,
      detail: names,
      fingerprint: names,
    });
  }

  return alerts.sort((a, b) => {
    const rank = { alert: 0, warn: 1 };
    return rank[a.severity] - rank[b.severity];
  });
}

/** Pick the single most urgent alert to post (one post per cron run). */
export function pickTopTravelAlert(alerts: TravelAlert[]): TravelAlert | null {
  return alerts.find((a) => a.severity === "alert") ?? alerts[0] ?? null;
}
