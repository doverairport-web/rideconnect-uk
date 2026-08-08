import { isHomeKentHost } from "@/lib/homekent/host";
import { headers } from "next/headers";

export { isHomeKentHost };

export async function hkBasePath(): Promise<string> {
  const headerList = await headers();
  if (
    headerList.get("x-site") === "homekent" ||
    isHomeKentHost(headerList.get("host"))
  ) {
    return "";
  }
  return process.env.NEXT_PUBLIC_HOMEKENT_BASE_PATH?.trim() || "/homekent";
}

export async function hkPath(path = ""): Promise<string> {
  const base = await hkBasePath();
  if (!path || path === "/") return base || "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
