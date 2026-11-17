"use client";

import { KthWhatsAppChannelFollow } from "@/components/kenttravelhub/KthWhatsAppChannelFollow";
import Link from "next/link";
import { useEffect, useState } from "react";

export type KthNavLink = {
  href: string;
  label: string;
  external?: boolean;
};

type Props = {
  links: KthNavLink[];
  bookHref: string;
  appHref?: string;
};

export function KthMobileNav({ links, bookHref, appHref }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-kth-navy/10 text-kth-navy"
        aria-expanded={open}
        aria-controls="kth-mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <span className="sr-only">{open ? "Close" : "Menu"}</span>
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-kth-navy/30 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav
            id="kth-mobile-menu"
            className="fixed inset-x-0 top-[57px] z-50 max-h-[calc(100dvh-57px)] overflow-y-auto border-b border-kth-navy/10 bg-white shadow-lg"
          >
            <ul className="divide-y divide-kth-navy/8 px-4 py-2">
              {links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-sm font-semibold uppercase tracking-wide text-kth-navy hover:text-kth-sea"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-sm font-semibold uppercase tracking-wide text-kth-navy hover:text-kth-sea"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="border-t border-kth-navy/8 px-4 py-4 space-y-3">
              {appHref ? (
                <a
                  href={appHref}
                  onClick={() => setOpen(false)}
                  className="block rounded-md border-2 border-kth-gold bg-white py-3 text-center text-sm font-extrabold uppercase tracking-wide text-kth-navy transition hover:bg-kth-gold"
                >
                  Open Dover app
                </a>
              ) : null}
              <Link
                href={bookHref}
                onClick={() => setOpen(false)}
                className="block rounded-md bg-kth-gold py-3 text-center text-sm font-extrabold uppercase tracking-wide text-kth-navy transition hover:bg-kth-gold-dark"
              >
                Book Taxi
              </Link>
              <div onClick={() => setOpen(false)}>
                <KthWhatsAppChannelFollow variant="button" className="w-full [&>a]:w-full" />
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
