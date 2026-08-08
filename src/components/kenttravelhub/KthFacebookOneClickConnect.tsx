import Link from "next/link";

const OAUTH_START = "/api/kenttravelhub/facebook/oauth/start";
const META_PERMISSIONS_URL =
  "https://developers.facebook.com/apps/1058299076683572/use_cases/customize/" +
  "?use_case=pages&use_case_enum=PAGES_API&selected_tab=permissions";
const META_REVOKE_URL = "https://www.facebook.com/settings?tab=business_tools";

export function KthFacebookOneClickConnect() {
  return (
    <section className="rounded-2xl border-2 border-kth-gold/50 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-kth-navy">Připojit jedním kliknutím</h2>
      <p className="mt-2 text-sm leading-relaxed text-kth-muted">
        Nejjednodušší cesta — funguje na telefonu i počítači. Graph API Explorer teď nepotřebuješ.
      </p>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Pokud vidíš „vidí: (none)“</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>
            <a href={META_REVOKE_URL} target="_blank" rel="noopener noreferrer" className="underline">
              Odpoj Kent Travel Hub app
            </a>{" "}
            (Business integrations → Remove)
          </li>
          <li>
            <a href={META_PERMISSIONS_URL} target="_blank" rel="noopener noreferrer" className="underline">
              Přidej permissions
            </a>{" "}
            v Meta appce (Add u pages_manage_posts, pages_read_engagement, pages_show_list)
          </li>
          <li>Znovu klikni modré tlačítko níže a zapni Create and manage content</li>
        </ol>
      </div>

      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-kth-muted">
        <li>Klikni na modré tlačítko níže</li>
        <li>Přihlas se jako admin stránky Kent Travel Hub</li>
        <li>
          Zapni <strong className="text-kth-navy">Create and manage content</strong> u{" "}
          <strong className="text-kth-navy">Kent Travel Hub</strong>
        </li>
        <li>Hotovo — vrátí tě sem a autopost poběží sám</li>
      </ol>

      <a
        href={OAUTH_START}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#1877F2] px-5 py-4 text-base font-semibold text-white hover:bg-[#166FE5] sm:w-auto"
      >
        Připojit Kent Travel Hub na Facebooku
      </a>

      <p className="mt-4 text-xs text-kth-muted">
        Musíš být admin stránky Kent Travel Hub. Pokud tlačítko nefunguje, zkus{" "}
        <Link href="/facebook-post" className="font-semibold text-kth-sea hover:text-kth-navy">
          ruční post
        </Link>
        .
      </p>
    </section>
  );
}
