import { HOMEKENT_SITE_URL } from "@/lib/homekent/brand";
import { hkBasePath } from "@/lib/homekent/paths";

export async function homekentCanonicalPath(path = ""): Promise<string> {
  const base = await hkBasePath();
  if (!path || path === "/") return base || "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export async function homekentCanonicalUrl(path = ""): Promise<string> {
  const canonicalPath = await homekentCanonicalPath(path);
  return new URL(canonicalPath, HOMEKENT_SITE_URL).toString();
}
