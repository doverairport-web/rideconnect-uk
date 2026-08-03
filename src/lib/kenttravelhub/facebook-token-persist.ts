import type { StoredFacebookPageToken } from "@/lib/kenttravelhub/facebook-token-store";
import { saveStoredFacebookPageToken } from "@/lib/kenttravelhub/facebook-token-store";
import {
  isVercelTokenEnvSyncConfigured,
  triggerProductionRedeploy,
  updateFacebookPageTokenEnv,
} from "@/lib/kenttravelhub/facebook-vercel-env";

/** Save Facebook page token to Blob and/or Vercel env. */
export async function persistFacebookPageToken(
  data: Omit<StoredFacebookPageToken, "updatedAt">,
): Promise<{ blob: boolean; env: boolean; blobError: string | null; envError: string | null }> {
  let blob = false;
  let env = false;
  let blobError: string | null = null;
  let envError: string | null = null;

  try {
    await saveStoredFacebookPageToken(data);
    blob = true;
  } catch (err) {
    blobError = err instanceof Error ? err.message : "Blob save failed";
  }

  if (isVercelTokenEnvSyncConfigured()) {
    try {
      await updateFacebookPageTokenEnv(data.accessToken);
      env = true;
    } catch (err) {
      envError = err instanceof Error ? err.message : "Vercel env save failed";
    }
  } else {
    envError = "VERCEL_ACCESS_TOKEN není nastavený";
  }

  if (!blob && !env) {
    throw new Error(
      `Token se nepodařilo uložit. Blob: ${blobError ?? "neznámá chyba"}. Env: ${envError ?? "neznámá chyba"}.`,
    );
  }

  if (env) {
    try {
      await triggerProductionRedeploy();
    } catch {
      /* env saved; redeploy optional */
    }
  }

  return { blob, env, blobError, envError };
}
