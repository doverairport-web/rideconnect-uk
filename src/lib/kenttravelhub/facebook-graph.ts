const GRAPH_API = "https://graph.facebook.com/v21.0";

export type FacebookPostResult =
  | { ok: true; postId: string }
  | { ok: false; error: string };

/** Publish a text post to the Kent Travel Hub Facebook Page. */
export async function postToFacebookPage(message: string): Promise<FacebookPostResult> {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim() || "61591477063233";
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  if (!token) {
    return { ok: false, error: "FACEBOOK_PAGE_ACCESS_TOKEN is not configured" };
  }

  const body = new URLSearchParams({
    message,
    access_token: token,
  });

  const res = await fetch(`${GRAPH_API}/${pageId}/feed`, {
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
