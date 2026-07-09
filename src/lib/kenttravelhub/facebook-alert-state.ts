import { list, put } from "@vercel/blob";
import type { TravelAlert, TravelAlertSeverity } from "@/lib/kenttravelhub/facebook-alert-events";

const BLOB_PATH = "kenttravelhub/facebook-alert-state.json";
const COOLDOWN_MS = 4 * 60 * 60 * 1000;

type PostedAlert = {
  fingerprint: string;
  severity: TravelAlertSeverity;
  postedAt: string;
  postId?: string;
};

export type FacebookAlertState = {
  alerts: Record<string, PostedAlert>;
};

export function isFacebookAlertStateConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

async function readState(): Promise<FacebookAlertState> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return { alerts: {} };

  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    const blob = blobs.find((b) => b.pathname === BLOB_PATH) ?? blobs[0];
    if (!blob?.url) return { alerts: {} };

    const res = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return { alerts: {} };
    return (await res.json()) as FacebookAlertState;
  } catch {
    return { alerts: {} };
  }
}

async function writeState(state: FacebookAlertState): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return;
  await put(BLOB_PATH, JSON.stringify(state), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

const SEVERITY_RANK: Record<TravelAlertSeverity, number> = {
  warn: 1,
  alert: 2,
};

/** Whether this alert should trigger a new Facebook post now. */
export function shouldPostTravelAlert(
  alert: TravelAlert,
  state: FacebookAlertState,
  now = Date.now(),
): boolean {
  const prev = state.alerts[alert.id];
  if (!prev) return true;
  if (prev.fingerprint !== alert.fingerprint) return true;
  if (SEVERITY_RANK[alert.severity] > SEVERITY_RANK[prev.severity]) return true;
  const age = now - new Date(prev.postedAt).getTime();
  return age >= COOLDOWN_MS;
}

export async function loadFacebookAlertState(): Promise<FacebookAlertState> {
  return readState();
}

export async function recordPostedTravelAlert(
  alert: TravelAlert,
  postId?: string,
): Promise<void> {
  const state = await readState();
  state.alerts[alert.id] = {
    fingerprint: alert.fingerprint,
    severity: alert.severity,
    postedAt: new Date().toISOString(),
    postId,
  };
  await writeState(state);
}
