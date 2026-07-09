import { describe, expect, it } from "vitest";
import {
  detectTravelAlerts,
  pickTopTravelAlert,
} from "@/lib/kenttravelhub/facebook-alert-events";
import { shouldPostTravelAlert } from "@/lib/kenttravelhub/facebook-alert-state";
import type { LiveTravelSnapshot } from "@/lib/kenttravelhub/content";

function baseSnapshot(overrides: Partial<LiveTravelSnapshot> = {}): LiveTravelSnapshot {
  return {
    updatedAt: "2026-07-09T12:00:00.000Z",
    sources: {
      cruise: "test",
      m20: "test",
      ferry: "test",
      port: "test",
      brock: "test",
      weather: "test",
      ferryArrivals: "test",
    },
    doverPortTraffic: { label: "Port", detail: "Normal", severity: "ok" },
    ferryDelays: { label: "Ferries", detail: "On time", severity: "ok" },
    m20Traffic: { label: "M20", detail: "Flowing", severity: "ok" },
    operationBrock: {
      label: "Brock",
      active: false,
      detail: "Not active",
      severity: "ok",
    },
    cruiseArrivals: [],
    cruiseCalendar: {
      today: [],
      tomorrow: [],
      thisWeek: [],
      thisMonth: [],
      scheduleDate: "2026-07-09",
    },
    ferryArrivals: [],
    weather: { tempC: 20, label: "Clear" },
    ...overrides,
  };
}

describe("detectTravelAlerts", () => {
  it("detects Brock and M20 delay alerts", () => {
    const alerts = detectTravelAlerts(
      baseSnapshot({
        operationBrock: {
          label: "Brock",
          active: true,
          detail: "Active on M20",
          severity: "alert",
        },
        m20JourneyMinutes: 50,
        m20DelayMinutes: 20,
        m20Traffic: { label: "M20", detail: "Slow", severity: "alert" },
      }),
    );

    expect(alerts.some((a) => a.id === "brock-active")).toBe(true);
    expect(alerts.some((a) => a.id === "m20-traffic")).toBe(true);
    expect(pickTopTravelAlert(alerts)?.severity).toBe("alert");
  });

  it("returns empty when everything is normal", () => {
    expect(detectTravelAlerts(baseSnapshot())).toEqual([]);
  });
});

describe("shouldPostTravelAlert", () => {
  it("posts again when severity escalates within cooldown", () => {
    const alert = {
      id: "m20-traffic",
      severity: "alert" as const,
      title: "M20",
      detail: "Heavy",
      fingerprint: "same",
    };
    const state = {
      alerts: {
        "m20-traffic": {
          fingerprint: "same",
          severity: "warn" as const,
          postedAt: new Date().toISOString(),
        },
      },
    };
    expect(shouldPostTravelAlert(alert, state)).toBe(true);
  });
});
