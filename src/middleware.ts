import { isHomeKentHost } from "@/lib/homekent/host";
import { isKentTravelHubHost } from "@/lib/kenttravelhub/host";
import {
  isDoverToGatwickHost,
  isOrionTaxisHost,
  isRideConnectUkHost,
  wwwHostForSite,
} from "@/lib/rideconnect/host";
import type { RideConnectSiteId } from "@/lib/rideconnect/sites";
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

const NETWORK_PASSTHROUGH = ["/book", "/driver", "/platform", "/private"];

function rideConnectSiteConfig(
  id: RideConnectSiteId,
  isHost: (host: string | null) => boolean,
  basePath: string,
): SiteConfig {
  return {
    id,
    isHost,
    wwwHost: wwwHostForSite(id),
    basePath,
    publicPaths: new Set(["/"]),
    publicPrefixes: [],
    passthroughPrefixes: [...NETWORK_PASSTHROUGH, "/contact", "/privacy", "/transfers"],
  };
}

const SITES: SiteConfig[] = [
  {
    id: "homekent",
    isHost: isHomeKentHost,
    wwwHost: "www.homekent.co.uk",
    basePath: "/homekent",
    publicPaths: new Set(["/", "/contact", "/privacy"]),
    publicPrefixes: ["/services"],
    passthroughPrefixes: NETWORK_PASSTHROUGH,
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
      "/trains",
      "/buses",
      "/live",
      "/visit",
      "/stay",
      "/cruise-terminal",
      "/facebook-post",
      "/facebook-setup",
    ],
    passthroughPrefixes: NETWORK_PASSTHROUGH,
  },
  rideConnectSiteConfig("rideconnect", isRideConnectUkHost, "/rideconnect"),
  rideConnectSiteConfig("oriontaxis", isOrionTaxisHost, "/oriontaxis"),
  rideConnectSiteConfig("dovertogatwick", isDoverToGatwickHost, "/dovertogatwick"),
];

function attachRequestHeaders(response: NextResponse, request: NextRequest, siteId?: string): NextResponse {
  response.headers.set("x-pathname", request.nextUrl.pathname);
  if (siteId) {
    response.headers.set("x-site", siteId);
  }
  return response;
}

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
    return attachRequestHeaders(response, request, site.id);
  }

  const passthrough = site.passthroughPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!pathname.startsWith(site.basePath) && !passthrough) {
    const url = request.nextUrl.clone();
    url.pathname = site.basePath;
    const response = NextResponse.rewrite(url);
    return attachRequestHeaders(response, request, site.id);
  }

  const response = NextResponse.next();
  return attachRequestHeaders(response, request, passthrough ? site.id : undefined);
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const hostname = host?.toLowerCase().split(":")[0] ?? "";

  if (hostname === "www.dovertaxi.co.uk") {
    const url = request.nextUrl.clone();
    url.hostname = "dovertaxi.co.uk";
    return NextResponse.redirect(url, 308);
  }

  for (const site of SITES) {
    if (site.isHost(host)) {
      return handleSite(request, site);
    }
  }

  const response = NextResponse.next();
  if (hostname === "dovertaxi.co.uk" || hostname === "dovertaxi.local") {
    return attachRequestHeaders(response, request, "dovertaxi");
  }
  return attachRequestHeaders(response, request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\..*).*)"],
};
