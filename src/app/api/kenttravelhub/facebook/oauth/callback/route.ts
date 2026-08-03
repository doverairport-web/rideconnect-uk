import { completeFacebookOAuth } from "@/lib/kenttravelhub/facebook-oauth";
import { validateFacebookPageToken } from "@/lib/kenttravelhub/facebook-graph";
import { saveStoredFacebookPageToken } from "@/lib/kenttravelhub/facebook-token-store";
import { KTH_FACEBOOK_SETUP_URL } from "@/lib/kenttravelhub/facebook-manual";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function htmlPage(title: string, body: string, status = 200): NextResponse {
  const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 2rem auto; padding: 0 1rem; color: #0b1f3a; }
    h1 { font-size: 1.5rem; }
    p, li { line-height: 1.5; color: #334155; }
    .ok { color: #166534; }
    .err { color: #b91c1c; }
    a { color: #0b4f6c; }
    code { background: #f1f5f9; padding: 0.1rem 0.35rem; border-radius: 4px; }
  </style>
</head>
<body>${body}</body>
</html>`;
  return new NextResponse(page, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const oauthError = request.nextUrl.searchParams.get("error_description");

  if (oauthError) {
    return htmlPage(
      "Facebook connection failed",
      `<h1 class="err">Connection cancelled</h1><p>${oauthError}</p><p><a href="${KTH_FACEBOOK_SETUP_URL}">Try again</a></p>`,
      400,
    );
  }

  if (!code) {
    return htmlPage(
      "Facebook connection failed",
      `<h1 class="err">Missing authorisation code</h1><p><a href="${KTH_FACEBOOK_SETUP_URL}">Start again</a></p>`,
      400,
    );
  }

  try {
    const stored = await completeFacebookOAuth(code);
    await saveStoredFacebookPageToken(stored);

    const validation = await validateFacebookPageToken(stored.accessToken);
    if (!validation.ok) {
      throw new Error(validation.error);
    }

    return htmlPage(
      "Facebook autopost connected",
      `<h1 class="ok">Kent Travel Hub autopost is connected</h1>
       <p>Page <strong>${stored.pageName}</strong> (${stored.pageId}) can now post automatically.</p>
       <ul>
         <li>4× daily live travel summary</li>
         <li>Urgent alerts every 30 minutes when Brock, M20, port or ferry issues fire</li>
       </ul>
       <p>Permissions: <code>${stored.scopes.join(", ")}</code></p>
       <p><a href="${KTH_FACEBOOK_SETUP_URL}">Setup page</a> · <a href="https://kenttravelhub.co.uk/facebook-post">Post helper</a></p>`,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "OAuth failed";
    return htmlPage(
      "Facebook connection failed",
      `<h1 class="err">Could not connect</h1>
       <p>${message}</p>
       <p>When Meta asks which Pages to connect, turn <strong>ON</strong> “Create and manage content” for Kent Travel Hub.</p>
       <p><a href="${KTH_FACEBOOK_SETUP_URL}">Try again</a></p>`,
      503,
    );
  }
}
