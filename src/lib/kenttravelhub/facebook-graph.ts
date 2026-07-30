import { resolveFacebookPageAccessToken } from "@/lib/kenttravelhub/facebook-token-store";

const GRAPH_API = "https://graph.facebook.com/v21.0";

export type FacebookPostResult =
  | { ok: true; postId: string }
  | { ok: false; error: string };

export type FacebookTokenValidation =
  | { ok: true; type: string; scopes: string[] }
  | { ok: false; error: string };

function appAccessToken(): string | null {
  const appId = process.env.FACEBOOK_APP_ID?.trim();
  const appSecret = process.env.FACEBOOK_APP_SECRET?.trim();
  if (!appId || !appSecret) return null;
  return `${appId}|${appSecret}`;
}

const REQUIRED_POST_SCOPES = ["pages_manage_posts", "pages_read_engagement"] as const;

function hasPostingScopes(scopes: string[]): boolean {
  return (
    scopes.includes("pages_manage_posts") &&
    (scopes.includes("pages_read_engagement") || scopes.includes("pages_manage_engagement"))
  );
}

/** Check token can post to the Kent Travel Hub page. */
export async function validateFacebookPageToken(
  token?: string | null,
): Promise<FacebookTokenValidation> {
  const resolved = token?.trim() || (await resolveFacebookPageAccessToken());
  if (!resolved) {
    return { ok: false, error: "FACEBOOK_PAGE_ACCESS_TOKEN is not configured" };
  }

  const pageId = process.env.FACEBOOK_PAGE_ID?.trim() || "1270508132806470";
  const appToken = appAccessToken();

  if (appToken) {
    const res = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(resolved)}&access_token=${encodeURIComponent(appToken)}`,
      { cache: "no-store" },
    );
    const data = (await res.json()) as {
      data?: {
        is_valid?: boolean;
        type?: string;
        scopes?: string[];
        profile_id?: string;
        error?: { message?: string };
      };
      error?: { message?: string };
    };

    const info = data.data;
    if (!res.ok || !info?.is_valid) {
      return {
        ok: false,
        error: info?.error?.message ?? data.error?.message ?? "Token is not valid",
      };
    }

    const scopes = info.scopes ?? [];
    const type = info.type ?? "UNKNOWN";

    if (type === "PAGE" && info.profile_id && info.profile_id !== pageId) {
      return {
        ok: false,
        error: `Token is for page ${info.profile_id}, expected ${pageId}`,
      };
    }

    if (!hasPostingScopes(scopes)) {
      return {
        ok: false,
        error: `Token missing posting permissions (need ${REQUIRED_POST_SCOPES.join(", ")}; have: ${scopes.join(", ") || "none"})`,
      };
    }

    return { ok: true, type, scopes };
  }

  const pageRes = await fetch(
    `${GRAPH_API}/${pageId}?fields=id,name&access_token=${encodeURIComponent(resolved)}`,
    { cache: "no-store" },
  );
  const page = (await pageRes.json()) as { id?: string; error?: { message?: string } };
  if (!pageRes.ok || !page.id) {
    return {
      ok: false,
      error: page.error?.message ?? "Token cannot access Kent Travel Hub page",
    };
  }

  const accountsRes = await fetch(
    `${GRAPH_API}/me/accounts?fields=id,name,access_token&access_token=${encodeURIComponent(resolved)}`,
    { cache: "no-store" },
  );
  const accounts = (await accountsRes.json()) as {
    data?: Array<{ id?: string; access_token?: string }>;
    error?: { message?: string };
  };

  if (accounts.data?.some((p) => p.id === pageId && p.access_token)) {
    return { ok: true, type: "USER", scopes: ["pages_manage_posts", "pages_read_engagement"] };
  }

  // Page token that can read the page — allow posting attempt.
  if (page.id) {
    return { ok: true, type: "PAGE", scopes: ["pages_manage_posts", "pages_read_engagement"] };
  }

  return {
    ok: false,
    error:
      accounts.error?.message ??
      "Token can read the page but cannot post — regenerate with pages_manage_posts and pages_read_engagement",
  };
}

/** Publish a text post to the Kent Travel Hub Facebook Page. */
export async function postToFacebookPage(message: string): Promise<FacebookPostResult> {
  const token = await resolveFacebookPageAccessToken();
  if (!token) {
    return { ok: false, error: "FACEBOOK_PAGE_ACCESS_TOKEN is not configured" };
  }

  const validation = await validateFacebookPageToken(token);
  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }

  const body = new URLSearchParams({
    message,
    access_token: token,
  });

  // New Facebook Pages often reject /{numeric-id}/feed — /me/feed works with Page tokens.
  const res = await fetch(`${GRAPH_API}/me/feed`, {
    method: "POST",
    body,
    cache: "no-store",
  });

  const data = (await res.json()) as { id?: string; error?: { message?: string } };
  if (!res.ok) {
    return {
      ok: false,
      error: data.error?.message ?? `Facebook API HTTP ${res.status}`,
    };
  }

  if (!data.id) {
    return { ok: false, error: "Facebook API returned no post id" };
  }

  return { ok: true, postId: data.id };
}
