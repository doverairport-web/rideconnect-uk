import { KTH_SITE_URL } from "@/lib/kenttravelhub/brand";
import type { StoredFacebookPageToken } from "@/lib/kenttravelhub/facebook-token-store";

const GRAPH_API = "https://graph.facebook.com/v21.0";

const DEFAULT_PAGE_ID = "1270508132806470";
const DEFAULT_PAGE_NAME = "Kent Travel Hub";

const OAUTH_SCOPES = [
  "pages_manage_posts",
  "pages_read_engagement",
  "pages_show_list",
] as const;

type GraphError = { message?: string; type?: string; code?: number };

function requireAppCredentials(): { appId: string; appSecret: string } {
  const appId = process.env.FACEBOOK_APP_ID?.trim();
  const appSecret = process.env.FACEBOOK_APP_SECRET?.trim();
  if (!appId || !appSecret) {
    throw new Error("FACEBOOK_APP_ID and FACEBOOK_APP_SECRET must be configured");
  }
  return { appId, appSecret };
}

export function facebookOAuthRedirectUri(): string {
  return `${KTH_SITE_URL}/api/kenttravelhub/facebook/oauth/callback`;
}

export function buildFacebookOAuthUrl(state?: string): string {
  const { appId } = requireAppCredentials();
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: facebookOAuthRedirectUri(),
    scope: OAUTH_SCOPES.join(","),
    response_type: "code",
  });
  if (state?.trim()) params.set("state", state.trim());
  return `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;
}

async function fetchGraph<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  const data = (await res.json()) as T & { error?: GraphError };
  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? `Graph API HTTP ${res.status}`);
  }
  return data;
}

async function exchangeCodeForUserToken(code: string): Promise<string> {
  const { appId, appSecret } = requireAppCredentials();
  const params = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: facebookOAuthRedirectUri(),
    code,
  });
  const data = await fetchGraph<{ access_token?: string }>(
    `${GRAPH_API}/oauth/access_token?${params.toString()}`,
  );
  if (!data.access_token) {
    throw new Error("Meta did not return an access token");
  }
  return data.access_token;
}

async function exchangeForLongLivedUserToken(shortToken: string): Promise<string> {
  const { appId, appSecret } = requireAppCredentials();
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortToken,
  });
  const data = await fetchGraph<{ access_token?: string }>(
    `${GRAPH_API}/oauth/access_token?${params.toString()}`,
  );
  return data.access_token ?? shortToken;
}

async function resolvePageToken(userToken: string): Promise<{
  pageId: string;
  pageName: string;
  accessToken: string;
}> {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim() || DEFAULT_PAGE_ID;
  const pageName = DEFAULT_PAGE_NAME;

  const params = new URLSearchParams({
    fields: "id,name,access_token",
    access_token: userToken,
  });
  const data = await fetchGraph<{
    data?: Array<{ id?: string; name?: string; access_token?: string }>;
  }>(`${GRAPH_API}/me/accounts?${params.toString()}`);

  const pages = data.data ?? [];
  const page =
    pages.find((p) => p.id === pageId) ??
    pages.find((p) => p.name?.toLowerCase() === pageName.toLowerCase());

  if (!page?.access_token) {
    const names = pages.map((p) => p.name).filter(Boolean).join(", ") || "(none)";
    throw new Error(
      `Kent Travel Hub page not returned by Meta. Pages on token: ${names}. ` +
        `Enable "Create and manage content" for Kent Travel Hub when authorising the app.`,
    );
  }

  return {
    pageId: page.id ?? pageId,
    pageName: page.name ?? pageName,
    accessToken: page.access_token,
  };
}

async function debugTokenScopes(pageToken: string): Promise<string[]> {
  const { appId, appSecret } = requireAppCredentials();
  const params = new URLSearchParams({
    input_token: pageToken,
    access_token: `${appId}|${appSecret}`,
  });
  const data = await fetchGraph<{ data?: { scopes?: string[] } }>(
    `https://graph.facebook.com/debug_token?${params.toString()}`,
  );
  return data.data?.scopes ?? [];
}

/** Complete OAuth code exchange and return a page token ready for autopost. */
export async function completeFacebookOAuth(code: string): Promise<StoredFacebookPageToken> {
  const shortUserToken = await exchangeCodeForUserToken(code);
  const longUserToken = await exchangeForLongLivedUserToken(shortUserToken);
  const page = await resolvePageToken(longUserToken);
  const scopes = await debugTokenScopes(page.accessToken);

  const hasPostScope = scopes.includes("pages_manage_posts");
  const hasReadScope =
    scopes.includes("pages_read_engagement") || scopes.includes("pages_manage_engagement");

  if (!hasPostScope || !hasReadScope) {
    throw new Error(
      `Page token missing permissions (have: ${scopes.join(", ") || "none"}). ` +
        `Re-authorise and turn ON "Create and manage content" for Kent Travel Hub.`,
    );
  }

  return {
    pageId: page.pageId,
    pageName: page.pageName,
    accessToken: page.accessToken,
    scopes,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Resolve a pasted Explorer user/page token into a long-lived page token.
 * User tokens are exchanged via /me/accounts; page tokens are kept as-is.
 */
export async function resolveFacebookConnectToken(
  rawToken: string,
): Promise<Omit<StoredFacebookPageToken, "updatedAt">> {
  const trimmed = rawToken.trim();
  if (!trimmed) {
    throw new Error("Token je prázdný");
  }

  try {
    const page = await resolvePageToken(trimmed);
    let scopes: string[] = [];
    try {
      scopes = await debugTokenScopes(page.accessToken);
    } catch {
      scopes = ["pages_manage_posts", "pages_read_engagement"];
    }
    return {
      pageId: page.pageId,
      pageName: page.pageName,
      accessToken: page.accessToken,
      scopes,
    };
  } catch {
    // Already a page token — validate by reading the page.
    const pageId = process.env.FACEBOOK_PAGE_ID?.trim() || DEFAULT_PAGE_ID;
    const pageRes = await fetch(
      `${GRAPH_API}/${pageId}?fields=id,name&access_token=${encodeURIComponent(trimmed)}`,
      { cache: "no-store" },
    );
    const page = (await pageRes.json()) as {
      id?: string;
      name?: string;
      error?: GraphError;
    };
    if (!pageRes.ok || !page.id) {
      throw new Error(page.error?.message ?? "Token cannot access Kent Travel Hub page");
    }

    let scopes: string[] = ["pages_manage_posts", "pages_read_engagement"];
    try {
      scopes = await debugTokenScopes(trimmed);
    } catch {
      /* keep defaults when app secret missing */
    }

    return {
      pageId: page.id,
      pageName: page.name ?? DEFAULT_PAGE_NAME,
      accessToken: trimmed,
      scopes,
    };
  }
}
