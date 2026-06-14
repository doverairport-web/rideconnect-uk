import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { PersonalJob, PersonalJobInput } from "@/lib/personal-ledger/types";
import { JOB_TYPES } from "@/lib/personal-ledger/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE =
  process.env.PERSONAL_LEDGER_FILE?.trim() ||
  path.join(DATA_DIR, "personal-jobs.json");

function newId(): string {
  return `pj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function parseJobInput(body: unknown): PersonalJobInput | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  const type = String(raw.type ?? "").trim();
  if (!JOB_TYPES.includes(type as PersonalJobInput["type"])) return null;

  const date = String(raw.date ?? "").trim();
  const driver = String(raw.driver ?? "").trim();
  const price = Number(raw.price);

  if (!date || !driver || !Number.isFinite(price) || price < 0) return null;

  return {
    type: type as PersonalJobInput["type"],
    date,
    driver,
    customer: String(raw.customer ?? "").trim(),
    pickup: String(raw.pickup ?? "").trim(),
    destination: String(raw.destination ?? "").trim(),
    price: Math.round(price * 100) / 100,
    notes: String(raw.notes ?? "").trim(),
  };
}

async function ensureDataFile(): Promise<PersonalJob[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const text = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(text) as unknown;
    return Array.isArray(parsed) ? (parsed as PersonalJob[]) : [];
  } catch {
    await writeFile(DATA_FILE, "[]\n", "utf8");
    return [];
  }
}

async function saveJobs(jobs: PersonalJob[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, `${JSON.stringify(jobs, null, 2)}\n`, "utf8");
}

export async function listPersonalJobs(): Promise<PersonalJob[]> {
  const jobs = await ensureDataFile();
  return jobs.sort((a, b) => b.date.localeCompare(a.date));
}

export async function createPersonalJob(
  input: PersonalJobInput,
): Promise<PersonalJob> {
  const jobs = await ensureDataFile();
  const now = new Date().toISOString();
  const job: PersonalJob = {
    id: newId(),
    type: input.type,
    date: input.date,
    driver: input.driver,
    customer: input.customer ?? "",
    pickup: input.pickup ?? "",
    destination: input.destination ?? "",
    price: input.price,
    notes: input.notes ?? "",
    createdAt: now,
    updatedAt: now,
  };
  jobs.push(job);
  await saveJobs(jobs);
  return job;
}

export async function updatePersonalJob(
  id: string,
  input: PersonalJobInput,
): Promise<PersonalJob | null> {
  const jobs = await ensureDataFile();
  const index = jobs.findIndex((job) => job.id === id);
  if (index < 0) return null;

  const now = new Date().toISOString();
  const updated: PersonalJob = {
    ...jobs[index],
    type: input.type,
    date: input.date,
    driver: input.driver,
    customer: input.customer ?? "",
    pickup: input.pickup ?? "",
    destination: input.destination ?? "",
    price: input.price,
    notes: input.notes ?? "",
    updatedAt: now,
  };
  jobs[index] = updated;
  await saveJobs(jobs);
  return updated;
}

export async function deletePersonalJob(id: string): Promise<boolean> {
  const jobs = await ensureDataFile();
  const next = jobs.filter((job) => job.id !== id);
  if (next.length === jobs.length) return false;
  await saveJobs(next);
  return true;
}
