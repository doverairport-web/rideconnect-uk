import { list, put } from "@vercel/blob";

const BLOB_PATH = "kenttravelhub/facebook-page-token.json";

export type StoredFacebookPageToken = {
  pageId: string;
  pageName: string;
  accessToken: string;
  scopes: string[];
  updatedAt: string;
};

export function isFacebookTokenStoreConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export async function loadStoredFacebookPageToken(): Promise<StoredFacebookPageToken | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return null;

  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    const blob = blobs.find((b) => b.pathname === BLOB_PATH) ?? blobs[0];
    if (!blob?.url) return null;

    const res = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as StoredFacebookPageToken;
    return data.accessToken?.trim() ? data : null;
  } catch {
    return null;
  }
}

export async function saveStoredFacebookPageToken(
  data: Omit<StoredFacebookPageToken, "updatedAt">,
): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  const payload: StoredFacebookPageToken = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await put(BLOB_PATH, JSON.stringify(payload), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

/** Env var takes precedence; Blob is the OAuth fallback store. */
export async function resolveFacebookPageAccessToken(): Promise<string | null> {
  const envToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  if (envToken) return envToken;

  const stored = await loadStoredFacebookPageToken();
  return stored?.accessToken?.trim() ?? null;
}
