import { describe, expect, it } from "vitest";
import {
  detectTravelAlerts,
  pickTopTravelAlert,
} from "@/lib/kenttravelhub/facebook-alert-events";
import {
  isUrgentFacebookAlert,
  pickPostableTravelAlert,
  shouldPostTravelAlert,
} from "@/lib/kenttravelhub/facebook-alert-state";
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

  it("detects warn-level port and ferry notices without treating them as urgent", () => {
    const alerts = detectTravelAlerts(
      baseSnapshot({
        doverPortTraffic: {
          label: "Port",
          detail: "Severe weather advice",
          severity: "warn",
        },
        ferryDelays: {
          label: "Ferries",
          detail: "Travel advice",
          severity: "warn",
        },
        cruiseCalendar: {
          today: [
            {
              name: "Spirit of Discovery",
              line: "Saga",
              arrives: "07:00",
              departs: "17:00",
              terminal: "CT2",
              date: "2026-07-13",
              dateLabel: "Mon 13 Jul",
            },
          ],
          tomorrow: [],
          thisWeek: [],
          thisMonth: [],
          scheduleDate: "2026-07-13",
        },
      }),
    );

    expect(alerts.some((a) => a.id === "port-traffic" && a.severity === "warn")).toBe(
      true,
    );
    expect(alerts.some((a) => a.id === "ferry-delays" && a.severity === "warn")).toBe(
      true,
    );
    expect(alerts.every((a) => a.severity === "warn")).toBe(true);
    expect(pickPostableTravelAlert(alerts, { alerts: {} })).toBeNull();
  });

  it("does not auto-alert on cruise ships alone", () => {
    const alerts = detectTravelAlerts(
      baseSnapshot({
        cruiseCalendar: {
          today: [
            {
              name: "Seabourn Ovation",
              line: "Seabourn",
              arrives: "05:30",
              departs: "16:00",
              terminal: "CT1",
              date: "2026-07-11",
              dateLabel: "Sat 11 Jul",
            },
          ],
          tomorrow: [],
          thisWeek: [],
          thisMonth: [],
          scheduleDate: "2026-07-11",
        },
      }),
    );

    expect(alerts.some((a) => a.id === "cruise-today")).toBe(false);
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
          postedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
        },
      },
    };
    expect(shouldPostTravelAlert(alert, state)).toBe(true);
  });

  it("blocks repeat posts within per-alert 4 hour cooldown", () => {
    const alert = {
      id: "ferry-delays",
      severity: "alert" as const,
      title: "Ferries",
      detail: "Delay",
      fingerprint: "same",
    };
    const state = {
      alerts: {
        "ferry-delays": {
          fingerprint: "same",
          severity: "alert" as const,
          postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
      },
    };
    expect(shouldPostTravelAlert(alert, state)).toBe(false);
  });

  it("skips warn-level alerts for Facebook autopost", () => {
    const warn = {
      id: "port-traffic",
      severity: "warn" as const,
      title: "Port",
      detail: "Busy",
      fingerprint: "a",
    };
    expect(isUrgentFacebookAlert(warn)).toBe(false);
    expect(pickPostableTravelAlert([warn], { alerts: {} })).toBeNull();
  });
});
