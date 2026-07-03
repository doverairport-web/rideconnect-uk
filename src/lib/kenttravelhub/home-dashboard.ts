import type { AirportCode } from "@/lib/pricing";
import type { LiveSeverity, LiveTravelSnapshot } from "@/lib/kenttravelhub/content";

/** One daily question per homepage section — answer first, details second. */
export const KTH_DAILY_QUESTIONS = {
  cruise:
    "What cruise ships are in Dover today, what time do they arrive and depart, and where should passengers be picked up?",
  ferries:
    "Are DFDS or P&O delayed today, what are the next sailings, and what is the check-in advice?",
  live:
    "Is Dover Port busy right now, is the M20 delayed, and is Operation Brock active?",
  weather:
    "Is the weather affecting ferries, port queues, cruise passengers or driving conditions today?",
  visit:
    "What can I do near Dover with the time I have before my ship or ferry?",
} as const;

export const KTH_HOME_SECTION_HEADINGS = {
  cruise: "Cruise ships today",
  ferries: "Ferry status",
  live: "Live travel",
  weather: "Weather today",
  visit: "Time near Dover",
  airports: "Airport Live Centre",
  stay: "Hotels & food",
} as const;

export const KTH_TODAY_BOX_IDS = [
  "cruise-ships",
  "ferry-delay",
  "port-queue",
  "m20",
  "brock",
  "weather",
  "best-time-leave",
  "taxi-pickup",
] as const;

export type KthTodayBoxId = (typeof KTH_TODAY_BOX_IDS)[number];

export type KthTodayBox = {
  id: KthTodayBoxId;
  label: string;
  value: string;
  detail: string;
  severity: LiveSeverity | "neutral";
  sectionAnchor: string;
};

export const KTH_TAXI_PICKUP_ADVICE = {
  cruise:
    "CT1 (Admiralty Pier): signed taxi rank at terminal forecourt. CT2 (Western Docks): approach-road pickup — confirm terminal on your booking. Pre-book on double-ship days.",
  ferry:
    "Eastern Docks (Calais): follow signs to car check-in — pickup at passenger building. Western Docks (Dunkirk): separate entrance — do not follow Eastern Docks sat-nav.",
  general:
    "Share cruise line, ferry operator and terminal (CT1/CT2/Eastern/Western) when you book. Ranks queue 30–60 min on busy turnaround mornings.",
};

export const KTH_BEST_TIME_TO_LEAVE = {
  cruiseQuiet:
    "Leave cruise terminal 15–20 min before your target time when one ship is in port.",
  cruiseBusy:
    "Allow 30–45 min from terminal to A20 on double-ship days — immigration and taxi queues peak 09:00–11:30.",
  ferryNormal:
    "Arrive 60–90 min before sailing for vehicle check-in. Foot passengers: 45–60 min.",
  ferryBrock:
    "Add 30–60 min when Operation Brock is active — M20 contraflow affects A20 approach.",
  weatherBad:
    "Add 15–30 min in rain, fog or high wind — port approach roads slow before queues even form.",
};

export const KTH_CRUISE_PICKUP_BY_TERMINAL = [
  {
    terminal: "CT1 · Cruise Terminal 1",
    pickup:
      "Admiralty Pier forecourt taxi rank, or pre-booked pickup lane — share your cruise line.",
  },
  {
    terminal: "CT2 · Cruise Terminal 2",
    pickup:
      "Western Docks cruise approach — signed taxi/coach area. Not the ferry check-in halls.",
  },
] as const;

export const KTH_FERRY_CHECK_IN_TODAY = [
  {
    id: "dfds-po",
    title: "DFDS & P&O today",
    detail:
      "Check operator apps on travel day — delays are posted before the port queue builds.",
  },
  {
    id: "checkin",
    title: "Check-in window",
    detail: "Cars: 60–90 min before departure. Foot passengers: 45–60 min. Longer if Brock is active.",
  },
  {
    id: "calais",
    title: "Dover → Calais",
    detail: "Eastern Docks — most frequent sailings. Separate lanes for cars and foot passengers.",
  },
  {
    id: "dunkirk",
    title: "Dover → Dunkirk",
    detail: "Western Docks — confirm on ticket. Different road approach from Calais sailings.",
  },
] as const;

export type KthVisitTimeSlot = {
  id: string;
  window: string;
  headline: string;
  places: string[];
  taxiMinutes: string;
  note: string;
};

export const KTH_VISIT_BY_TIME: KthVisitTimeSlot[] = [
  {
    id: "2h",
    window: "2 hours",
    headline: "Quick stop before you sail",
    places: [
      "Dover seafront & Prince of Wales pier",
      "Dover Museum (town centre)",
      "View from Dover Castle outer walls (ticket not required for lower walks)",
    ],
    taxiMinutes: "5–10 min from port",
    note: "Stay within 2 miles of the docks — do not attempt Canterbury in 2 hours.",
  },
  {
    id: "4h",
    window: "4 hours",
    headline: "Half-day between ferry and cruise",
    places: [
      "Dover Castle (main keep & views)",
      "White Cliffs visitor centre walk",
      "South Foreland Lighthouse (short visit)",
    ],
    taxiMinutes: "10–15 min each way from CT1/CT2",
    note: "Book a return taxi time — ranks get busy when a ship turns around.",
  },
  {
    id: "fullday",
    window: "Full day",
    headline: "Overnight or long layover",
    places: [
      "Canterbury Cathedral & city centre",
      "Deal pier and seafront",
      "Folkestone Creative Coast",
      "White Cliffs full coastal path",
    ],
    taxiMinutes: "20–45 min depending on destination",
    note: "Ideal after disembarkation or the day before an afternoon sailing.",
  },
];

export const KTH_NEAR_PORT_PLACES = [
  { name: "Dover Marina curve", distance: "0.5 mi", time: "5 min taxi" },
  { name: "Dover Priory station", distance: "1 mi", time: "5 min taxi" },
  { name: "Dover Castle", distance: "1 mi", time: "8 min taxi" },
  { name: "White Cliffs visitor centre", distance: "2 mi", time: "10 min taxi" },
  { name: "Western Docks viewpoint", distance: "1 mi", time: "5 min taxi" },
] as const;

export const KTH_EASY_TAXI_TRIPS = [
  {
    route: "Port → Dover town centre",
    duration: "5–8 min",
    use: "Supplies, pharmacy, SIM card, cash",
  },
  {
    route: "Cruise terminal → Dover Priory",
    duration: "8–10 min",
    use: "London train if you have time — check return taxi",
  },
  {
    route: "Port → Deal seafront",
    duration: "15–20 min",
    use: "Lunch with 3–4 hours to spare",
  },
  {
    route: "Port → Canterbury",
    duration: "35–45 min",
    use: "Full-day layover only — book return time",
  },
] as const;

export const KTH_SENIOR_FRIENDLY_TRIPS = [
  {
    place: "Dover seafront & esplanade",
    walking: "Flat · benches along the route",
    taxi: "Drop at Marine Parade — 5 min from port",
  },
  {
    place: "Dover Museum",
    walking: "Level access · short visit",
    taxi: "Town centre drop-off",
  },
  {
    place: "White Cliffs visitor centre",
    walking: "Short paved paths · cliff edge optional",
    taxi: "Car park drop-off — avoid full cliff walk if mobility limited",
  },
  {
    place: "Deal pier café",
    walking: "Flat pier · seating at the end",
    taxi: "20 min from Dover — allow 3+ hours total",
  },
] as const;

export type KthAirportJourneyGuide = {
  code: AirportCode;
  label: string;
  journeyTime: string;
  cruiseNote: string;
};

export const KTH_AIRPORT_JOURNEY_GUIDES: KthAirportJourneyGuide[] = [
  {
    code: "heathrow",
    label: "Heathrow",
    journeyTime: "2 hr – 2 hr 45 min",
    cruiseNote: "Post-cruise: allow 45–90 min ashore before leaving CT1/CT2.",
  },
  {
    code: "gatwick",
    label: "Gatwick",
    journeyTime: "1 hr 30 min – 2 hr",
    cruiseNote: "Most common post-cruise airport — pre-book to skip rank queues.",
  },
  {
    code: "stansted",
    label: "Stansted",
    journeyTime: "2 hr – 2 hr 45 min",
    cruiseNote: "M25 buffer essential — check M20 status on this page first.",
  },
  {
    code: "city",
    label: "London City",
    journeyTime: "1 hr 45 min – 2 hr 15 min",
    cruiseNote: "Closest London airport — good for same-day European connections.",
  },
];

function severeWeather(label: string): boolean {
  return /rain|snow|fog|storm|thunder|sleet|hail|wind/i.test(label);
}

function portWaitSummary(data: LiveTravelSnapshot): {
  value: string;
  detail: string;
  severity: LiveSeverity;
} {
  const detail = data.doverPortTraffic.detail;
  const waitMatch = detail.match(/(\d+)\s*[–-]\s*(\d+)\s*min|(\d+)\s*min/i);
  const mins = waitMatch ? (waitMatch[3] ?? waitMatch[1]) : null;
  return {
    value: mins ? `${mins} min` : data.doverPortTraffic.severity === "ok" ? "Normal" : "Busy",
    detail: detail.slice(0, 72),
    severity: data.doverPortTraffic.severity,
  };
}

function m20Summary(data: LiveTravelSnapshot): {
  value: string;
  detail: string;
  severity: LiveSeverity;
} {
  if (data.m20JourneyMinutes) {
    const delay =
      data.m20DelayMinutes && data.m20DelayMinutes > 0
        ? ` (+${data.m20DelayMinutes} min)`
        : "";
    return {
      value: `${data.m20JourneyMinutes} min${delay}`,
      detail: "J11A → Dover",
      severity: data.m20Traffic.severity,
    };
  }
  return {
    value: data.m20Traffic.severity === "ok" ? "Clear" : "Delays",
    detail: data.m20Traffic.detail.slice(0, 60),
    severity: data.m20Traffic.severity,
  };
}

function cruiseShipsSummary(data: LiveTravelSnapshot): {
  value: string;
  detail: string;
  severity: LiveSeverity | "neutral";
} {
  const ships = data.cruiseCalendar.today;
  if (ships.length === 0) {
    return { value: "None listed", detail: "No ships scheduled today", severity: "neutral" };
  }
  const first = ships[0];
  return {
    value: `${ships.length} ship${ships.length === 1 ? "" : "s"}`,
    detail: `${first.name} arrives ${first.arrives}`,
    severity: ships.length >= 2 ? "warn" : "ok",
  };
}

function ferryDelaySummary(data: LiveTravelSnapshot): {
  value: string;
  detail: string;
  severity: LiveSeverity;
} {
  const ok = data.ferryDelays.severity === "ok";
  const next = data.ferryArrivals[0];
  return {
    value: ok ? "No delays flagged" : "Check operators",
    detail: ok && next
      ? `Next arrival ${next.operator} ${next.arrives} from ${next.route}`
      : data.ferryDelays.detail.slice(0, 72),
    severity: data.ferryDelays.severity,
  };
}

function bestTimeToLeaveSummary(data: LiveTravelSnapshot): {
  value: string;
  detail: string;
  severity: LiveSeverity | "neutral";
} {
  const ships = data.cruiseCalendar.today.length;
  const brock = data.operationBrock.active;
  const badWeather = severeWeather(data.weather.label);
  const portBusy = data.doverPortTraffic.severity !== "ok";

  if (brock) {
    return {
      value: "Leave earlier",
      detail: KTH_BEST_TIME_TO_LEAVE.ferryBrock,
      severity: "warn",
    };
  }
  if (ships >= 2) {
    return {
      value: "Allow 30–45 min",
      detail: KTH_BEST_TIME_TO_LEAVE.cruiseBusy,
      severity: "warn",
    };
  }
  if (badWeather || portBusy) {
    return {
      value: "Add 15–30 min",
      detail: badWeather
        ? KTH_BEST_TIME_TO_LEAVE.weatherBad
        : "Port queues building — leave earlier than planned.",
      severity: "warn",
    };
  }
  return {
    value: "Standard buffer",
    detail: KTH_BEST_TIME_TO_LEAVE.cruiseQuiet,
    severity: "ok",
  };
}

function weatherImpactSummary(data: LiveTravelSnapshot): {
  value: string;
  detail: string;
  severity: LiveSeverity | "neutral";
} {
  const bad = severeWeather(data.weather.label);
  const impacts: string[] = [];
  if (bad) impacts.push("Driving slower on A20/M20");
  if (/rain|fog/i.test(data.weather.label)) impacts.push("Foot passengers wait outside");
  if (/wind/i.test(data.weather.label)) impacts.push("Ferry boarding may slow");

  return {
    value: bad ? "May affect travel" : "Low impact",
    detail: bad
      ? impacts.join(" · ") || `${data.weather.label} — allow extra time`
      : `${data.weather.tempC}°C ${data.weather.label} — normal conditions`,
    severity: bad ? "warn" : "ok",
  };
}

/** One-line summary for the “Today in Dover” banner. */
export function buildTodayInDoverHeadline(data: LiveTravelSnapshot | null): string {
  if (!data) return "Loading today's Dover travel picture…";

  const parts: string[] = [];
  const ships = data.cruiseCalendar.today.length;
  parts.push(ships ? `${ships} cruise ship${ships === 1 ? "" : "s"}` : "No cruise ships");
  parts.push(
    data.ferryDelays.severity === "ok" ? "Ferries OK" : "Ferry delays possible",
  );
  parts.push(
    data.doverPortTraffic.severity === "ok"
      ? "Port normal"
      : data.doverPortTraffic.severity === "warn"
        ? "Port busy"
        : "Port heavy",
  );
  if (data.m20JourneyMinutes) {
    parts.push(`M20 ${data.m20JourneyMinutes} min`);
  }
  parts.push(data.operationBrock.active ? "Brock ON" : "Brock off");
  parts.push(`${data.weather.tempC}°C ${data.weather.label}`);

  return parts.join(" · ");
}

export function buildTodayInDoverBoxes(
  data: LiveTravelSnapshot | null,
): KthTodayBox[] {
  if (!data) {
    return KTH_TODAY_BOX_IDS.map((id) => ({
      id,
      label: id.replace(/-/g, " "),
      value: "—",
      detail: "Updating…",
      severity: "neutral" as const,
      sectionAnchor: "#home-live",
    }));
  }

  const port = portWaitSummary(data);
  const m20 = m20Summary(data);
  const cruise = cruiseShipsSummary(data);
  const ferry = ferryDelaySummary(data);
  const weather = weatherImpactSummary(data);
  const leave = bestTimeToLeaveSummary(data);

  return [
    {
      id: "cruise-ships",
      label: "Cruise ships today",
      value: cruise.value,
      detail: cruise.detail,
      severity: cruise.severity,
      sectionAnchor: "#home-cruise",
    },
    {
      id: "ferry-delay",
      label: "Ferry delay warning",
      value: ferry.value,
      detail: ferry.detail,
      severity: ferry.severity,
      sectionAnchor: "#home-ferries",
    },
    {
      id: "port-queue",
      label: "Port queue status",
      value: port.value,
      detail: port.detail,
      severity: port.severity,
      sectionAnchor: "#home-live",
    },
    {
      id: "m20",
      label: "M20 status",
      value: m20.value,
      detail: m20.detail,
      severity: m20.severity,
      sectionAnchor: "#home-live",
    },
    {
      id: "brock",
      label: "Operation Brock",
      value: data.operationBrock.active ? "Active" : "Not active",
      detail: data.operationBrock.detail.slice(0, 72),
      severity: data.operationBrock.active ? "warn" : "ok",
      sectionAnchor: "#home-live",
    },
    {
      id: "weather",
      label: "Weather warning",
      value: weather.value,
      detail: weather.detail,
      severity: weather.severity,
      sectionAnchor: "#home-weather",
    },
    {
      id: "best-time-leave",
      label: "Best time to leave",
      value: leave.value,
      detail: leave.detail,
      severity: leave.severity,
      sectionAnchor: "#home-cruise",
    },
    {
      id: "taxi-pickup",
      label: "Taxi pickup advice",
      value: cruise.value.startsWith("None") ? "Ferry ranks" : "CT1 / CT2 ranks",
      detail: KTH_TAXI_PICKUP_ADVICE.general,
      severity: "neutral",
      sectionAnchor: "#home-cruise",
    },
  ];
}

export function buildWeatherTravelImpacts(data: LiveTravelSnapshot | null): {
  ferries: string;
  portQueues: string;
  cruisePassengers: string;
  driving: string;
  severity: LiveSeverity | "neutral";
} {
  if (!data) {
    return {
      ferries: "Loading…",
      portQueues: "Loading…",
      cruisePassengers: "Loading…",
      driving: "Loading…",
      severity: "neutral",
    };
  }

  const bad = severeWeather(data.weather.label);
  const label = data.weather.label.toLowerCase();

  return {
    ferries:
      /wind|storm/i.test(label)
        ? "Crossing may be slower — check DFDS/P&O apps before driving to port"
        : bad
          ? "No major wind alert — still check operator updates on travel day"
          : "No weather-related disruption expected on sailings",
    portQueues:
      /rain|fog/i.test(label)
        ? "Foot passengers queue outside — rain adds discomfort, not always delay"
        : bad
          ? "Allow extra time at check-in — staff move slower in poor conditions"
          : "Normal outdoor queue conditions at Eastern/Western Docks",
    cruisePassengers:
      /rain|wind/i.test(label)
        ? "Taxi ranks exposed at CT1/CT2 — pre-book to wait under cover in the terminal"
        : bad
          ? "Disembarkation may run slower — immigration queues extend in bad weather"
          : "Standard disembarkation timing — allow usual 30–90 min after arrival",
    driving:
      /fog|rain|snow/i.test(label)
        ? `A20/M20 visibility reduced — ${data.m20JourneyMinutes ? `allow +15 min on ${data.m20JourneyMinutes} min M20 time` : "add 15–30 min to journey"}`
        : bad
          ? "Check M20 status below — weather and traffic compound delays"
          : "No weather-related driving advisory for Dover approaches",
    severity: bad ? "warn" : "ok",
  };
}
