import type { LiveTravelSnapshot } from "@/lib/kenttravelhub/content";
import { buildTodayInDoverHeadline } from "@/lib/kenttravelhub/home-dashboard";
import type { KthTrainLiveDashboard } from "@/lib/kenttravelhub/train-live";

function severityEmoji(severity: string): string {
  if (severity === "alert") return "🔴";
  if (severity === "warn") return "🟠";
  return "🟢";
}

function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/London",
  });
}

function formatFerryArrivals(data: LiveTravelSnapshot): string {
  const arrivals = data.ferryArrivals.slice(0, 4);
  if (!arrivals.length) return "No ferries from France listed right now";
  return arrivals
    .map((f) => `${f.operator} ${f.route} ${f.arrives} (${f.status.replace("-", " ")})`)
    .join(" · ");
}

function formatCruiseToday(data: LiveTravelSnapshot): string {
  const ships = data.cruiseCalendar.today;
  if (!ships.length) return "No cruise ships in port today";
  return ships
    .map((s) => `${s.name} ${s.time}${s.terminal ? ` (${s.terminal})` : ""}`)
    .join(" · ");
}

function formatTrainLine(train: KthTrainLiveDashboard | null): string {
  if (!train?.nextDeparture) return "Check Dover Priory board online";
  const d = train.nextDeparture;
  const time = d.expectedTime && d.expectedTime !== d.scheduledTime ? d.expectedTime : d.scheduledTime;
  const status = d.cancelled
    ? "cancelled"
    : d.delayed
      ? d.status.toLowerCase().includes("delay")
        ? d.status
        : "delayed"
      : "on time";
  return `Next: ${time} to ${d.routeLabel} (${status})`;
}

/** Short Facebook post from live Dover travel data — no mock content. */
export function formatFacebookLivePost(
  data: LiveTravelSnapshot,
  train: KthTrainLiveDashboard | null = null,
): string {
  const headline = buildTodayInDoverHeadline(data);
  const brockLine = data.operationBrock.active
    ? `🔴 Operation Brock ACTIVE — ${data.operationBrock.detail}`
    : "🟢 Operation Brock not active";

  const m20Line = data.m20JourneyMinutes
    ? `${severityEmoji(data.m20Traffic.severity)} M20: ${data.m20JourneyMinutes} min J11A → Dover${data.m20DelayMinutes ? ` (+${data.m20DelayMinutes} min delay)` : ""}`
    : `${severityEmoji(data.m20Traffic.severity)} M20: ${data.m20Traffic.detail}`;

  const lines = [
    `🚦 Dover travel update — ${formatDateLabel(data.updatedAt)}`,
    "",
    headline,
    "",
    brockLine,
    m20Line,
    `${severityEmoji(data.ferryDelays.severity)} Ferries: ${formatFerryArrivals(data)}`,
    `🚢 Cruise: ${formatCruiseToday(data)}`,
    `🚆 Trains: ${formatTrainLine(train)}`,
    `🌤️ Weather: ${data.weather.tempC}°C, ${data.weather.label}`,
    "",
    "👉 Live board: https://kenttravelhub.co.uk/live",
    "🚆 Trains: https://kenttravelhub.co.uk/trains",
    "🚌 Buses: https://kenttravelhub.co.uk/buses",
    "",
    "#Dover #Kent #M20 #OperationBrock #Ferries #Cruise",
  ];

  return lines.join("\n");
}
