/** Dover District Council Hackney Carriage fares — effective 05.03.2026 */

export type TariffId = 1 | 2 | 3;

export const YARD_TO_METERS = 0.9144;

export type Tariff = {
  id: TariffId;
  label: string;
  initialCharge: number;
  initialYards: number;
  initialSeconds: number;
  incrementCharge: number;
  incrementYards: number;
  incrementSeconds: number;
};

export const TARIFFS: Record<TariffId, Tariff> = {
  1: {
    id: 1,
    label: "Day (06:00–24:00)",
    initialCharge: 3.8,
    initialYards: 280,
    initialSeconds: 60,
    incrementCharge: 0.2,
    incrementYards: 155,
    incrementSeconds: 25,
  },
  2: {
    id: 2,
    label: "Night / bank holiday (00:00–06:00)",
    initialCharge: 5.7,
    initialYards: 280,
    initialSeconds: 60,
    incrementCharge: 0.3,
    incrementYards: 155,
    incrementSeconds: 25,
  },
  3: {
    id: 3,
    label: "Christmas / New Year",
    initialCharge: 7.6,
    initialYards: 280,
    initialSeconds: 60,
    incrementCharge: 0.4,
    incrementYards: 155,
    incrementSeconds: 25,
  },
};

export type MeterExtras = {
  passengers?: number;
  luggageArticles?: number;
  isMpv?: boolean;
  pickupAt?: Date;
};

export type MeterBreakdown = {
  tariff: Tariff;
  baseFare: number;
  distanceUnits: number;
  timeUnits: number;
  runningUnits: number;
  runningFare: number;
  sundayExtra: number;
  passengerExtra: number;
  luggageExtra: number;
  mpvMultiplier: number;
  subtotal: number;
  total: number;
  distanceMeters: number;
  durationSeconds: number;
};

/** Values to enter in Cabcher → Pricing → Distance slabs (Tariff 1). Time/waiting still needs Cabcher support. */
export const CABCHER_DISTANCE_SLABS_TARIFF_1 = {
  initialDistanceMeters: Math.round(280 * YARD_TO_METERS),
  initialChargeGbp: 3.8,
  repeatEveryMeters: Math.round(155 * YARD_TO_METERS),
  repeatChargeGbp: 0.2,
  waitingNote:
    "Request Cabcher support: £0.20 per 25 seconds when speed is low / vehicle waiting (Dover dual-rate meter).",
};

const UK_BANK_HOLIDAYS_2026 = new Set([
  "2026-01-01",
  "2026-04-03",
  "2026-04-06",
  "2026-05-04",
  "2026-05-25",
  "2026-08-31",
  "2026-12-25",
  "2026-12-26",
  "2026-12-28",
]);

function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isTariff3Period(date: Date): boolean {
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();

  if (month === 11 && day === 24 && hour >= 18) return true;
  if (month === 11 && day >= 25 && day <= 26) return true;
  if (month === 11 && day === 27 && hour < 6) return true;

  if (month === 11 && day === 31 && hour >= 18) return true;
  if (month === 0 && day === 1) return true;
  if (month === 0 && day === 2 && hour < 6) return true;

  return false;
}

export function selectTariff(pickupAt: Date): Tariff {
  if (isTariff3Period(pickupAt)) return TARIFFS[3];

  const hour = pickupAt.getHours();
  if (hour < 6) return TARIFFS[2];

  if (UK_BANK_HOLIDAYS_2026.has(dateKey(pickupAt))) return TARIFFS[2];

  return TARIFFS[1];
}

function ceilDiv(value: number, step: number): number {
  if (value <= 0 || step <= 0) return 0;
  return Math.ceil(value / step);
}

/**
 * Dual-rate Hackney logic: after the initial period, charge increments when
 * either distance OR time thresholds are reached (whichever comes first).
 * For estimates we use max(distanceUnits, timeUnits) — standard council quote method.
 */
export function calculateMeterFare(
  distanceMeters: number,
  durationSeconds: number,
  extras: MeterExtras = {},
): MeterBreakdown {
  const pickupAt = extras.pickupAt ?? new Date();
  const tariff = selectTariff(pickupAt);

  const distanceYards = distanceMeters / YARD_TO_METERS;

  const distanceAfterInitial = Math.max(0, distanceYards - tariff.initialYards);
  const timeAfterInitial = Math.max(0, durationSeconds - tariff.initialSeconds);

  const distanceUnits = ceilDiv(distanceAfterInitial, tariff.incrementYards);
  const timeUnits = ceilDiv(timeAfterInitial, tariff.incrementSeconds);
  const runningUnits = Math.max(distanceUnits, timeUnits);

  const runningFare = runningUnits * tariff.incrementCharge;
  const baseFare = tariff.initialCharge;

  const sundayExtra = pickupAt.getDay() === 0 ? 1 : 0;

  const passengers = Math.max(1, extras.passengers ?? 1);
  const passengerExtra = Math.max(0, passengers - 1) * 0.6;

  const luggageArticles = Math.max(0, extras.luggageArticles ?? 0);
  const luggageExtra = luggageArticles * 0.6;

  const subtotal =
    baseFare + runningFare + sundayExtra + passengerExtra + luggageExtra;

  const mpvMultiplier = extras.isMpv ? 1.5 : 1;
  const total = roundToMeterStep(subtotal * mpvMultiplier);

  return {
    tariff,
    baseFare,
    distanceUnits,
    timeUnits,
    runningUnits,
    runningFare,
    sundayExtra,
    passengerExtra,
    luggageExtra,
    mpvMultiplier,
    subtotal: roundToMeterStep(subtotal),
    total,
    distanceMeters,
    durationSeconds,
  };
}

/** Meter ticks in £0.20 steps on Tariff 1 — round up slightly for dispatch quotes. */
export function roundToMeterStep(amount: number, step = 0.2): number {
  const steps = Math.round(amount / step);
  return Math.round(steps * step * 100) / 100;
}

export function parseLuggageArticles(luggage?: string): number {
  if (!luggage) return 0;
  const match = luggage.match(/\d+/);
  if (!match) return 1;
  return Math.max(0, Number(match[0]));
}

export function parsePickupDateTime(date: string, time: string): Date | null {
  if (!date || !time) return null;
  const parsed = new Date(`${date}T${time}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatMeterFare(amount: number): string {
  return `£${amount.toFixed(2)}`;
}
