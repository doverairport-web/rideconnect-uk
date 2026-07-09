import type { TravelAlert } from "@/lib/kenttravelhub/facebook-alert-events";

function severityEmoji(severity: TravelAlert["severity"]): string {
  return severity === "alert" ? "🔴" : "🟠";
}

/** Short urgent Facebook post for a single travel alert. */
export function formatFacebookAlertPost(alert: TravelAlert): string {
  const lines = [
    `${severityEmoji(alert.severity)} ${alert.title}`,
    "",
    alert.detail,
    "",
    "👉 Live updates: https://kenttravelhub.co.uk/live",
    "🚆 Trains: https://kenttravelhub.co.uk/trains",
    "🚌 Buses: https://kenttravelhub.co.uk/buses",
    "",
    "#Dover #Kent #M20 #OperationBrock #TravelAlert",
  ];
  return lines.join("\n");
}
