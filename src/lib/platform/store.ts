import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  JOB_STATUSES,
  PAYMENT_TYPES,
  SCHEDULE_MODES,
  type PlatformDriver,
  type PlatformJob,
  type PlatformJobInput,
  type PlatformStore,
} from "@/lib/platform/types";
import {
  MAX_OFFERED_FARE_GBP,
  MIN_OFFERED_FARE_GBP,
  OPERATOR_NAME,
  PLATFORM_FEE_RATE,
} from "@/lib/platform/constants";
import { calculateJobFees } from "@/lib/platform/fees";
import { generatePin, hashPin } from "@/lib/platform/pin";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE =
  process.env.PLATFORM_DATA_FILE?.trim() ||
  path.join(DATA_DIR, "platform.json");

function newId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function emptyStore(): PlatformStore {
  return { drivers: [], jobs: [], jobSequence: 0 };
}

async function readStore(): Promise<PlatformStore> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const text = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(text) as Partial<PlatformStore>;
    return {
      drivers: Array.isArray(parsed.drivers) ? parsed.drivers : [],
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
      jobSequence:
        typeof parsed.jobSequence === "number" ? parsed.jobSequence : 0,
    };
  } catch {
    const initial = emptyStore();
    await writeStore(initial);
    return initial;
  }
}

async function writeStore(store: PlatformStore): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

function nextReference(store: PlatformStore): string {
  const year = new Date().getFullYear();
  const seq = store.jobSequence + 1;
  return `RC-${year}-${String(seq).padStart(5, "0")}`;
}

export function parseJobInput(body: unknown): PlatformJobInput | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;

  const pickup = String(raw.pickup ?? "").trim();
  const destination = String(raw.destination ?? "").trim();
  const scheduleMode = String(raw.scheduleMode ?? "asap").trim();
  const paymentType = String(raw.paymentType ?? "cash").trim();
  const offeredFareGbp = Number(raw.offeredFareGbp);
  const passengers = Number(raw.passengers ?? 1);
  const luggage = Number(raw.luggage ?? 0);
  const notes = String(raw.notes ?? "").trim();

  if (!pickup) return null;
  if (!SCHEDULE_MODES.includes(scheduleMode as PlatformJobInput["scheduleMode"])) {
    return null;
  }
  if (!PAYMENT_TYPES.includes(paymentType as PlatformJobInput["paymentType"])) {
    return null;
  }
  if (
    !Number.isFinite(offeredFareGbp) ||
    offeredFareGbp < MIN_OFFERED_FARE_GBP ||
    offeredFareGbp > MAX_OFFERED_FARE_GBP
  ) {
    return null;
  }

  let scheduledAt: string | null = null;
  if (scheduleMode === "scheduled") {
    const value = String(raw.scheduledAt ?? "").trim();
    if (!value) return null;
    scheduledAt = value;
  }

  return {
    pickup,
    destination,
    scheduleMode: scheduleMode as PlatformJobInput["scheduleMode"],
    scheduledAt,
    offeredFareGbp: Math.round(offeredFareGbp * 100) / 100,
    paymentType: paymentType as PlatformJobInput["paymentType"],
    passengers: Number.isFinite(passengers) && passengers > 0 ? passengers : 1,
    luggage: Number.isFinite(luggage) && luggage >= 0 ? luggage : 0,
    notes,
  };
}

export function parseDriverInput(body: unknown): {
  name: string;
  phone: string;
  vehicle: string;
  pin?: string;
} | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  const name = String(raw.name ?? "").trim();
  const phone = String(raw.phone ?? "").trim();
  const vehicle = String(raw.vehicle ?? "").trim();
  const pin = raw.pin != null ? String(raw.pin).trim() : undefined;

  if (!name || !phone) return null;
  if (pin != null && (pin.length < 4 || pin.length > 8)) return null;

  return { name, phone, vehicle, pin };
}

export async function listJobs(): Promise<PlatformJob[]> {
  const store = await readStore();
  return store.jobs.sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  );
}

export async function listOpenJobs(): Promise<PlatformJob[]> {
  const jobs = await listJobs();
  return jobs.filter((job) => job.status === "open");
}

export async function getJobById(id: string): Promise<PlatformJob | null> {
  const store = await readStore();
  return store.jobs.find((job) => job.id === id) ?? null;
}

export async function createJob(input: PlatformJobInput): Promise<PlatformJob> {
  const store = await readStore();
  const timestamp = nowIso();
  const fees = calculateJobFees(input.offeredFareGbp, PLATFORM_FEE_RATE);
  store.jobSequence += 1;

  const job: PlatformJob = {
    id: newId("job"),
    reference: nextReference(store),
    status: "open",
    pickup: input.pickup,
    destination: input.destination,
    scheduleMode: input.scheduleMode,
    scheduledAt: input.scheduledAt,
    offeredFareGbp: fees.offeredFareGbp,
    platformFeeRate: fees.platformFeeRate,
    platformFeeGbp: fees.platformFeeGbp,
    driverPayoutGbp: fees.driverPayoutGbp,
    paymentType: input.paymentType,
    passengers: input.passengers,
    luggage: input.luggage,
    notes: input.notes,
    assignedDriverId: null,
    assignedDriverName: null,
    acceptedAt: null,
    startedAt: null,
    completedAt: null,
    cancelledAt: null,
    cancelReason: "",
    postedBy: OPERATOR_NAME,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.jobs.push(job);
  await writeStore(store);
  return job;
}

export async function cancelJob(
  id: string,
  reason = "",
): Promise<PlatformJob | null> {
  const store = await readStore();
  const index = store.jobs.findIndex((job) => job.id === id);
  if (index < 0) return null;

  const job = store.jobs[index];
  if (job.status === "completed" || job.status === "cancelled") return null;

  const updated: PlatformJob = {
    ...job,
    status: "cancelled",
    cancelledAt: nowIso(),
    cancelReason: reason.trim(),
    updatedAt: nowIso(),
  };
  store.jobs[index] = updated;
  await writeStore(store);
  return updated;
}

export async function acceptJob(
  jobId: string,
  driver: PlatformDriver,
): Promise<PlatformJob | null> {
  const store = await readStore();
  const index = store.jobs.findIndex((job) => job.id === jobId);
  if (index < 0) return null;

  const job = store.jobs[index];
  if (job.status !== "open") return null;

  const timestamp = nowIso();
  const updated: PlatformJob = {
    ...job,
    status: "accepted",
    assignedDriverId: driver.id,
    assignedDriverName: driver.name,
    acceptedAt: timestamp,
    updatedAt: timestamp,
  };
  store.jobs[index] = updated;
  await writeStore(store);
  return updated;
}

export async function startJob(
  jobId: string,
  driverId: string,
): Promise<PlatformJob | null> {
  const store = await readStore();
  const index = store.jobs.findIndex((job) => job.id === jobId);
  if (index < 0) return null;

  const job = store.jobs[index];
  if (
    job.status !== "accepted" ||
    job.assignedDriverId !== driverId
  ) {
    return null;
  }

  const updated: PlatformJob = {
    ...job,
    status: "in_progress",
    startedAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.jobs[index] = updated;
  await writeStore(store);
  return updated;
}

export async function completeJob(
  jobId: string,
  driverId: string,
): Promise<PlatformJob | null> {
  const store = await readStore();
  const index = store.jobs.findIndex((job) => job.id === jobId);
  if (index < 0) return null;

  const job = store.jobs[index];
  if (
    (job.status !== "accepted" && job.status !== "in_progress") ||
    job.assignedDriverId !== driverId
  ) {
    return null;
  }

  const timestamp = nowIso();
  const updated: PlatformJob = {
    ...job,
    status: "completed",
    startedAt: job.startedAt ?? timestamp,
    completedAt: timestamp,
    updatedAt: timestamp,
  };
  store.jobs[index] = updated;
  await writeStore(store);
  return updated;
}

export async function listDrivers(): Promise<PlatformDriver[]> {
  const store = await readStore();
  return store.drivers.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getDriverById(id: string): Promise<PlatformDriver | null> {
  const store = await readStore();
  return store.drivers.find((driver) => driver.id === id) ?? null;
}

export async function findDriverByPhone(
  phone: string,
): Promise<PlatformDriver | null> {
  const normalized = phone.replace(/\D/g, "");
  const drivers = await listDrivers();
  return (
    drivers.find((driver) => {
      const driverDigits = driver.phone.replace(/\D/g, "");
      return driverDigits === normalized;
    }) ?? null
  );
}

export async function createDriver(input: {
  name: string;
  phone: string;
  vehicle: string;
  pin?: string;
}): Promise<{ driver: PlatformDriver; pin: string }> {
  const store = await readStore();
  const pin = input.pin?.trim() || generatePin();
  const timestamp = nowIso();

  const driver: PlatformDriver = {
    id: newId("drv"),
    name: input.name.trim(),
    phone: input.phone.trim(),
    pinHash: hashPin(pin),
    vehicle: input.vehicle.trim(),
    active: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.drivers.push(driver);
  await writeStore(store);
  return { driver, pin };
}

export async function updateDriver(
  id: string,
  input: {
    name?: string;
    phone?: string;
    vehicle?: string;
    active?: boolean;
    pin?: string;
  },
): Promise<PlatformDriver | null> {
  const store = await readStore();
  const index = store.drivers.findIndex((driver) => driver.id === id);
  if (index < 0) return null;

  const current = store.drivers[index];
  const updated: PlatformDriver = {
    ...current,
    name: input.name?.trim() || current.name,
    phone: input.phone?.trim() || current.phone,
    vehicle: input.vehicle?.trim() ?? current.vehicle,
    active: input.active ?? current.active,
    pinHash: input.pin ? hashPin(input.pin) : current.pinHash,
    updatedAt: nowIso(),
  };

  store.drivers[index] = updated;
  await writeStore(store);
  return updated;
}

export async function getDriverJobs(driverId: string): Promise<PlatformJob[]> {
  const jobs = await listJobs();
  return jobs.filter(
    (job) =>
      job.assignedDriverId === driverId ||
      (job.status === "open"),
  );
}

export async function getPlatformStats() {
  const jobs = await listJobs();
  const drivers = await listDrivers();
  const monthPrefix = new Date().toISOString().slice(0, 7);

  const monthJobs = jobs.filter((job) => job.createdAt.startsWith(monthPrefix));
  const completed = monthJobs.filter((job) => job.status === "completed");
  const open = jobs.filter((job) => job.status === "open");
  const active = jobs.filter((job) =>
    ["accepted", "in_progress"].includes(job.status),
  );

  const gross = completed.reduce((sum, job) => sum + job.offeredFareGbp, 0);
  const fees = completed.reduce((sum, job) => sum + job.platformFeeGbp, 0);

  return {
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter((driver) => driver.active).length,
    openJobs: open.length,
    activeJobs: active.length,
    monthPosted: monthJobs.length,
    monthCompleted: completed.length,
    monthGross: Math.round(gross * 100) / 100,
    monthFees: Math.round(fees * 100) / 100,
    fillRate:
      monthJobs.length > 0
        ? Math.round((completed.length / monthJobs.length) * 100)
        : 0,
  };
}

export function isValidJobStatus(value: string): value is PlatformJob["status"] {
  return JOB_STATUSES.includes(value as PlatformJob["status"]);
}
