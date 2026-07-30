import { KTH_SITE_URL } from "@/lib/kenttravelhub/brand";
import { resolveFacebookPageAccessToken } from "@/lib/kenttravelhub/facebook-token-store";

export const KTH_FACEBOOK_SETUP_URL = `${KTH_SITE_URL}/facebook-setup`;
export const KTH_FACEBOOK_PAGE_URL =
  "https://www.facebook.com/profile.php?id=61591477063233";

/** Autopost runs when explicitly enabled and a page token is set (env or Blob). */
export async function isFacebookAutopostEnabled(): Promise<boolean> {
  if (process.env.FACEBOOK_AUTOPOST_ENABLED?.trim() !== "true") return false;
  return Boolean(await resolveFacebookPageAccessToken());
}

/** Sync check for env-only flag (used where async is awkward). */
export function isFacebookAutopostEnvEnabled(): boolean {
  return process.env.FACEBOOK_AUTOPOST_ENABLED?.trim() === "true";
}
