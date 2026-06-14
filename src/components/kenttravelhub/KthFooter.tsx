import { KTH_NAME, KTH_POWERED_BY, KTH_SITE_URL } from "@/lib/kenttravelhub/brand";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import { KthCookieSettingsLink } from "@/components/kenttravelhub/KthCookieConsent";
import { KthEmailCapture } from "@/components/kenttravelhub/KthEmailCapture";
import { hasKthAnalytics } from "@/lib/kenttravelhub/analytics";
import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

export async function KthFooter() {
  const home = await kthPath();
  const book = await kthBookUrl({ campaign: "footer-book", content: "footer" });
  const year = new Date().getFullYear();
  const sectionLinks = await Promise.all(
    KTH_SITE_SECTIONS.map(async (section) => ({
      href: await kthPath(section.path),
      label: `${section.number}. ${section.label}`,
    })),
  );

  return (
    <footer className="border-t border-kth-navy/10 bg-kth-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <KthEmailCapture source="footer" compact variant="dark" />
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide">
              Kent Travel Hub
            </p>
            <p className="mt-2 text-sm text-white/70">
              {KTH_NAME} — live travel information, guides and tips across Kent.
              Taxi bookings via {KTH_POWERED_BY}.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-kth-gold">
              Explore
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>
                <Link href={home} className="hover:text-white">
                  Live windows
                </Link>
              </li>
              {sectionLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={await kthPath("/cruise-terminal")} className="hover:text-white">
                  Cruise terminal guide
                </Link>
              </li>
              <li>
                <Link href={await kthPath("/news")} className="hover:text-white">
                  Travel guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-kth-gold">
              Transport partner
            </p>
            <p className="mt-3 text-sm text-white/80">{KTH_POWERED_BY}</p>
            <Link
              href={book}
              className="mt-3 inline-flex rounded-md bg-kth-gold px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-kth-navy transition hover:bg-kth-gold-dark"
            >
              Book Taxi
            </Link>
          </div>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {year} {KTH_NAME}.{" "}
          <a href={KTH_SITE_URL} className="hover:text-white/70">
            {KTH_SITE_URL.replace(/^https?:\/\//, "")}
          </a>
          {hasKthAnalytics() && (
            <>
              {" · "}
              <KthCookieSettingsLink className="hover:text-white/70" />
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
