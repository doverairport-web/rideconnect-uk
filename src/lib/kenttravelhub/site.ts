import { KTH_SITE_URL } from "@/lib/kenttravelhub/brand";
import { kthBasePath } from "@/lib/kenttravelhub/paths";

export async function kthCanonicalPath(path = ""): Promise<string> {
  const base = await kthBasePath();
  if (!path || path === "/") return base || "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export async function kthCanonicalUrl(path = ""): Promise<string> {
  const canonicalPath = await kthCanonicalPath(path);
  return new URL(canonicalPath, KTH_SITE_URL).toString();
}
