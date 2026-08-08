"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/seo/dashboard", label: "Dashboard" },
  { href: "/seo/competitors", label: "Competitors" },
  { href: "/seo/search-console", label: "Search Console" },
];

export function SeoSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/seo/auth", { method: "DELETE" });
    router.replace("/seo/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col border-b border-white/10 bg-[#071526] p-4 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4a017]">
          RideConnect
        </p>
        <p className="mt-1 text-lg font-bold text-white">SEO OS</p>
      </div>

      <nav className="flex flex-wrap gap-2 md:flex-col md:gap-1">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "rounded-lg bg-[#d4a017]/15 px-3 py-2 text-sm font-semibold text-[#d4a017]"
                  : "rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-6 rounded-lg border border-white/15 px-3 py-2 text-left text-sm text-white/70 hover:bg-white/5 md:mt-auto"
      >
        Odhlásit
      </button>
    </aside>
  );
}
