import type { LiveSeverity, LiveStatus } from "@/lib/kenttravelhub/content";
import type { PortNewsResult } from "@/lib/kenttravelhub/fetchers/port-news";

export type FerryFeedResult = {
  ferry: LiveStatus;
  port: LiveStatus;
  source: string;
};

function severityFromSignals(signals: {
  m20Severity: LiveSeverity;
  brockActive: boolean;
  hasPortNews: boolean;
}): LiveSeverity {
  if (signals.brockActive || signals.m20Severity === "alert") return "alert";
  if (signals.m20Severity === "warn" || signals.hasPortNews) return "warn";
  return "ok";
}

function truncate(text: string, max = 200): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export function buildFerryAndPortStatus(input: {
  m20Severity: LiveSeverity;
  brockActive: boolean;
  cruiseCount: number;
  portNews?: PortNewsResult | null;
  m20Incidents?: string[];
  date?: Date;
}): FerryFeedResult {
  const hasPortNews = Boolean(input.portNews?.headline);
  const severity = severityFromSignals({
    m20Severity: input.m20Severity,
    brockActive: input.brockActive,
    hasPortNews,
  });

  const cruiseBusy = input.cruiseCount >= 2;

  if (input.portNews?.headline && input.portNews.detail) {
    const newsSeverity: LiveSeverity =
      /delay|queue|disrupt|busy|peak|congest/i.test(input.portNews.headline)
        ? "warn"
        : severity;

    return {
      ferry: {
        label: "Ferry Delays",
        detail: truncate(
          `${input.portNews.headline} — ${input.portNews.detail}`,
        ),
        severity: newsSeverity,
      },
      port: {
        label: "Dover Port Traffic",
        detail: truncate(
          cruiseBusy
            ? `${input.cruiseCount} cruise ship${input.cruiseCount > 1 ? "s" : ""} today — ${input.portNews.detail}`
            : input.portNews.detail,
        ),
        severity: cruiseBusy && newsSeverity === "ok" ? "warn" : newsSeverity,
      },
      source: input.portNews.source,
    };
  }

  if (input.m20Incidents?.length) {
    const incident = input.m20Incidents[0];
    return {
      ferry: {
        label: "Ferry Delays",
        detail: truncate(
          `M20/A20 disruption near Dover may affect ferry check-in — ${incident}`,
        ),
        severity: "warn",
      },
      port: {
        label: "Dover Port Traffic",
        detail: truncate(
          cruiseBusy
            ? `Port area busy with ${input.cruiseCount} cruise calls — allow extra time via A20`
            : `Approach roads affected — ${incident}`,
        ),
        severity: cruiseBusy ? "warn" : "warn",
      },
      source: "nationalhighways.co.uk/api",
    };
  }

  const ferryDetail =
    severity === "alert"
      ? "High demand expected — DFDS & P&O may run delays; arrive early and check operator apps"
      : severity === "warn"
        ? "Some delays possible on cross-Channel sailings — verify with your operator before travelling"
        : "Cross-Channel sailings generally on time — check DFDS & P&O apps on travel day";

  const portDetail =
    severity === "alert" || cruiseBusy
      ? `Port area busy${cruiseBusy ? ` — ${input.cruiseCount} cruise ship${input.cruiseCount > 1 ? "s" : ""} today` : ""}; allow extra check-in time`
      : severity === "warn"
        ? "Moderate port traffic — allow extra time at check-in during peak sailings"
        : "Port moving normally — typical short wait at check-in";

  return {
    ferry: {
      label: "Ferry Delays",
      detail: ferryDetail,
      severity,
    },
    port: {
      label: "Dover Port Traffic",
      detail: portDetail,
      severity: cruiseBusy && severity === "ok" ? "warn" : severity,
    },
    source:
      input.m20Severity === "ok" && !input.brockActive && !hasPortNews
        ? "live-signals"
        : "derived-from-traffic",
  };
}
