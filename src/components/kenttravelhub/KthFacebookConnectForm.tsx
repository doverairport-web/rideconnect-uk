"use client";

import { connectFacebookPageToken } from "@/app/kenttravelhub/facebook-setup/actions";
import { extractFacebookAccessToken } from "@/lib/kenttravelhub/facebook-token-input";
import { useState } from "react";

const GRAPH_EXPLORER_URL =
  "https://developers.facebook.com/tools/explorer/?app_id=1058299076683572";

export function KthFacebookConnectForm() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = extractFacebookAccessToken(token) ?? token.trim();
    if (!value) return;

    setStatus("loading");
    setMessage("");

    const result = await connectFacebookPageToken(value);
    if (!result.ok) {
      setStatus("error");
      setMessage(result.error);
      return;
    }

    setStatus("ok");
    setMessage(result.message);
    setToken("");
    window.location.reload();
  }

  return (
    <section className="rounded-2xl border border-kth-navy/10 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-kth-navy">Záložní cesta — Graph API Explorer</h2>
      <p className="mt-2 text-sm text-kth-muted">
        Pokud OAuth nefunguje, použij Graph API Explorer — funguje vždy:
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-kth-muted">
        <li>
          Otevři{" "}
          <a
            href={GRAPH_EXPLORER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-kth-sea hover:text-kth-navy"
          >
            Graph API Explorer
          </a>{" "}
          (appka Kent Travel Hub nahoře)
        </li>
        <li>
          Permissions → přidej{" "}
          <code className="rounded bg-kth-sand px-1">pages_manage_posts</code> a{" "}
          <code className="rounded bg-kth-sand px-1">pages_read_engagement</code>
        </li>
        <li>
          Klikni <strong className="text-kth-navy">Generate Access Token</strong> a na druhé
          obrazovce zapni <strong className="text-kth-navy">Create and manage content</strong> u
          Kent Travel Hub
        </li>
        <li>
          Zkopíruj token z Exploreru (stačí <strong className="text-kth-navy">User Token</strong>{" "}
          — server ho sám převede na Page Token)
        </li>
        <li>Vlož token níže → Uložit</li>
      </ol>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <label className="block text-sm font-medium text-kth-navy" htmlFor="fb-page-token">
          Access Token (User nebo Page)
        </label>
        <textarea
          id="fb-page-token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={3}
          placeholder="EAAB..."
          className="w-full rounded-xl border border-kth-navy/15 px-3 py-2 text-sm text-kth-navy placeholder:text-kth-muted/60 focus:border-kth-sea focus:outline-none focus:ring-2 focus:ring-kth-sea/20"
        />
        <button
          type="submit"
          disabled={status === "loading" || !token.trim()}
          className="inline-flex rounded-xl bg-kth-navy px-5 py-3 text-sm font-semibold text-white hover:bg-kth-sea disabled:opacity-50"
        >
          {status === "loading" ? "Ukládám…" : "Uložit token a zapnout autopost"}
        </button>
      </form>

      {message ? (
        <p
          className={`mt-3 text-sm ${status === "ok" ? "text-emerald-700" : "text-amber-800"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
