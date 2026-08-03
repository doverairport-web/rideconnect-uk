/**
 * Copy BLOB_READ_WRITE_TOKEN from rideconnect-dispatch → dovertaxi (production).
 * Usage: node scripts/set-dovertaxi-blob-token.mjs
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const DISPATCH_PROJECT = "prj_hkyCp9x2iFhJ9eJPVtQqCT5hOmBm";
const DOVERTAXI_PROJECT = "prj_vy4jrVPygsTLpnsifDvqTTkA2dc5";
const KEY = "BLOB_READ_WRITE_TOKEN";

function vercelAuthToken() {
  const paths = [
    join(homedir(), "Library", "Application Support", "com.vercel.cli", "auth.json"),
    join(homedir(), ".local", "share", "com.vercel.cli", "auth.json"),
  ];
  for (const p of paths) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8"));
      if (typeof raw.token === "string" && raw.token) return raw.token;
      const entry = Object.values(raw.tokens ?? {})[0];
      if (entry && typeof entry === "object" && "token" in entry && entry.token) {
        return entry.token;
      }
    } catch {
      /* try next */
    }
  }
  if (process.env.VERCEL_TOKEN?.trim()) return process.env.VERCEL_TOKEN.trim();
  throw new Error("Vercel auth token not found");
}

async function listEnv(projectId) {
  const token = vercelAuthToken();
  const res = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}/env?decrypt=true`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) throw new Error(`env list failed for ${projectId}: ${res.status}`);
  const list = await res.json();
  return list.envs ?? list;
}

async function upsertEnv(projectId, key, value) {
  const token = vercelAuthToken();
  const envs = await listEnv(projectId);
  const existing = envs.find((e) => e.key === key && e.target?.includes("production"));

  if (existing?.value === value) {
    console.log(`[ok] ${key} already set on project ${projectId}`);
    return "unchanged";
  }

  if (existing) {
    const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env/${existing.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value, target: ["production", "preview", "development"] }),
    });
    if (!res.ok) throw new Error(`env patch failed: ${res.status} ${await res.text()}`);
    console.log(`[updated] ${key} on project ${projectId}`);
    return "updated";
  }

  const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key,
      value,
      type: "encrypted",
      target: ["production", "preview", "development"],
    }),
  });
  if (!res.ok) throw new Error(`env create failed: ${res.status} ${await res.text()}`);
  console.log(`[created] ${key} on project ${projectId}`);
  return "created";
}

async function main() {
  const dispatchEnvs = await listEnv(DISPATCH_PROJECT);
  const blob = dispatchEnvs.find((e) => e.key === KEY)?.value?.trim();
  if (!blob) throw new Error(`${KEY} not found on dispatch project`);

  const result = await upsertEnv(DOVERTAXI_PROJECT, KEY, blob);
  const dovertaxiEnvs = await listEnv(DOVERTAXI_PROJECT);
  const set = dovertaxiEnvs.some((e) => e.key === KEY && e.value?.trim());
  console.log(JSON.stringify({ result, dovertaxiHasBlob: set }));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
