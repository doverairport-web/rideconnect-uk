const DOVERTAXI_PROJECT = "prj_vy4jrVPygsTLpnsifDvqTTkA2dc5";

async function vercelApi<T>(path: string, init?: RequestInit): Promise<T> {
  const token = process.env.VERCEL_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new Error("VERCEL_ACCESS_TOKEN is not configured");
  }

  const res = await fetch(`https://api.vercel.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    throw new Error(data.error?.message ?? `Vercel API HTTP ${res.status}`);
  }
  return data;
}

async function upsertVercelEnv(key: string, value: string, options?: { sensitive?: boolean }): Promise<void> {
  const sensitive =
    options?.sensitive ??
    (key.includes("SECRET") || key.includes("TOKEN") || key.includes("PASSWORD"));
  const target = sensitive ? ["production", "preview"] : ["production", "preview", "development"];
  const envs = await vercelApi<{ envs?: Array<{ id: string; key: string; target?: string[] }> }>(
    `/v9/projects/${DOVERTAXI_PROJECT}/env`,
  );

  const existing = envs.envs?.find(
    (e) => e.key === key && e.target?.includes("production"),
  );

  const body = {
    value,
    target,
  };

  if (existing) {
    await vercelApi(`/v9/projects/${DOVERTAXI_PROJECT}/env/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    return;
  }

  await vercelApi(`/v9/projects/${DOVERTAXI_PROJECT}/env`, {
    method: "POST",
    body: JSON.stringify({
      key,
      type: "encrypted",
      ...body,
    }),
  });
}

/** Persist page token to Vercel production env (survives Blob outages). */
export async function updateFacebookPageTokenEnv(pageToken: string): Promise<void> {
  await upsertVercelEnv("FACEBOOK_PAGE_ACCESS_TOKEN", pageToken);
}

/** Fix OAuth "Error validating client secret" by syncing Meta App Secret to Vercel. */
export async function updateFacebookAppSecretEnv(appSecret: string): Promise<void> {
  await upsertVercelEnv("FACEBOOK_APP_SECRET", appSecret.trim());
}

export function isVercelTokenEnvSyncConfigured(): boolean {
  return Boolean(process.env.VERCEL_ACCESS_TOKEN?.trim());
}

/** Trigger production redeploy so new env vars take effect. */
export async function triggerProductionRedeploy(): Promise<void> {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL?.trim();
  if (!hook) return;
  const res = await fetch(hook, { method: "POST", cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Deploy hook HTTP ${res.status}`);
  }
}
