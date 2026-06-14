import { isHomeKentHost } from "@/lib/homekent/host";
import { isKentTravelHubHost } from "@/lib/kenttravelhub/host";
import { NextRequest, NextResponse } from "next/server";

type SiteConfig = {
  id: string;
  isHost: (host: string | null) => boolean;
  wwwHost?: string;
  basePath: string;
  publicPaths: Set<string>;
  publicPrefixes: string[];
  passthroughPrefixes: string[];
};

function isPublicPath(pathname: string, site: SiteConfig): boolean {
  if (site.publicPaths.has(pathname)) return true;
  return site.publicPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

const SITES: SiteConfig[] = [
  {
    id: "homekent",
    isHost: isHomeKentHost,
    wwwHost: "www.homekent.co.uk",
    basePath: "/homekent",
    publicPaths: new Set(["/", "/contact", "/privacy"]),
    publicPrefixes: [],
    passthroughPrefixes: [
      "/book",
      "/driver",
      "/platform",
      "/private",
    ],
  },
  {
    id: "kenttravelhub",
    isHost: isKentTravelHubHost,
    wwwHost: "www.kenttravelhub.co.uk",
    basePath: "/kenttravelhub",
    publicPaths: new Set(["/", "/contact", "/privacy"]),
    publicPrefixes: [
      "/news",
      "/taxi",
      "/cruise",
      "/ferries",
      "/airports",
      "/live",
      "/visit",
      "/stay",
      "/cruise-terminal",
    ],
    passthroughPrefixes: [
      "/book",
      "/driver",
      "/platform",
      "/private",
    ],
  },
];

function handleSite(request: NextRequest, site: SiteConfig): NextResponse {
  const host = request.headers.get("host");
  const hostname = host?.toLowerCase().split(":")[0] ?? "";

  if (site.wwwHost && hostname === site.wwwHost) {
    const url = request.nextUrl.clone();
    url.hostname = site.wwwHost.replace(/^www\./, "");
    return NextResponse.redirect(url, 308);
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (pathname === site.basePath || pathname.startsWith(`${site.basePath}/`)) {
    const cleanPath = pathname.replace(new RegExp(`^${site.basePath}`), "") || "/";
    const url = request.nextUrl.clone();
    url.pathname = cleanPath;
    return NextResponse.redirect(url, 308);
  }

  if (isPublicPath(pathname, site)) {
    const url = request.nextUrl.clone();
    url.pathname = `${site.basePath}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set("x-site", site.id);
    return response;
  }

  const passthrough = site.passthroughPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (
    !pathname.startsWith(site.basePath) &&
    !passthrough
  ) {
    const url = request.nextUrl.clone();
    url.pathname = site.basePath;
    const response = NextResponse.rewrite(url);
    response.headers.set("x-site", site.id);
    return response;
  }

  return NextResponse.next();
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  for (const site of SITES) {
    if (site.isHost(host)) {
      return handleSite(request, site);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\..*).*)"],
};
