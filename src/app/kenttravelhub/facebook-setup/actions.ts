"use server";

import { resolveFacebookConnectToken } from "@/lib/kenttravelhub/facebook-oauth";
import { persistFacebookPageToken } from "@/lib/kenttravelhub/facebook-token-persist";
import { revalidatePath } from "next/cache";

export type ConnectFacebookResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function connectFacebookPageToken(token: string): Promise<ConnectFacebookResult> {
  try {
    const resolved = await resolveFacebookConnectToken(token);
    await persistFacebookPageToken({
      pageId: resolved.pageId,
      pageName: resolved.pageName,
      accessToken: resolved.accessToken,
      scopes: resolved.scopes,
    });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Token se nepodařilo uložit",
    };
  }

  revalidatePath("/facebook-setup");
  revalidatePath("/facebook-post");
  return {
    ok: true,
    message: "Facebook autopost je aktivní. Cron bude postovat automaticky.",
  };
}
