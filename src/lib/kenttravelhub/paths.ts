import { KTH_SITE_URL } from "@/lib/kenttravelhub/brand";
import { isKentTravelHubHost } from "@/lib/kenttravelhub/host";
import { kthUtmQuery, type KthUtm } from "@/lib/kenttravelhub/utm";
import { headers } from "next/headers";

export { isKentTravelHubHost };

export async function kthBasePath(): Promise<string> {
  const headerList = await headers();
  if (
    headerList.get("x-site") === "kenttravelhub" ||
    isKentTravelHubHost(headerList.get("host"))
  ) {
    return "";
  }
  return process.env.NEXT_PUBLIC_KTH_BASE_PATH?.trim() || "/kenttravelhub";
}

export async function kthPath(path = ""): Promise<string> {
  const base = await kthBasePath();
  if (!path || path === "/") return base || "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** RideConnect booking — Kent Travel Hub /book, never dovertaxi.co.uk from KTH pages. */
export async function kthBookUrl(utm?: KthUtm): Promise<string> {
  const headerList = await headers();
  const onSite =
    headerList.get("x-site") === "kenttravelhub" ||
    isKentTravelHubHost(headerList.get("host"));
  const query = utm ? `?${kthUtmQuery(utm)}` : "";
  const bookPath = `/book${query}`;
  if (onSite) return bookPath;
  const base = await kthBasePath();
  if (base) return `${base}${bookPath}`;
  return `${KTH_SITE_URL.replace(/\/$/, "")}${bookPath}`;
}
