import { HomeKentLogo } from "@/components/homekent/HomeKentLogo";
import {
  HOMEKENT_AREAS,
  HOMEKENT_EMAIL,
  HOMEKENT_PHONE,
  homekentTelHref,
} from "@/lib/homekent/brand";
import { hkPath } from "@/lib/homekent/paths";
import Link from "next/link";
import type { ReactNode } from "react";

function SocialIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-homekent-gold hover:text-homekent-gold"
    >
      {children}
    </a>
  );
}

export async function HomeKentHeader() {
  const home = await hkPath();
  const navLinks = [
    { href: home, label: "Home" },
    { href: `${home}#services`, label: "Services" },
    { href: `${home}#pricing`, label: "Pricing" },
    { href: `${home}#about`, label: "About Us" },
    { href: await hkPath("/contact"), label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-homekent-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-white/80">
            <span className="flex items-center gap-1.5">
              <MapPinIcon />
              {HOMEKENT_AREAS}
            </span>
            <a
              href={`mailto:${HOMEKENT_EMAIL}`}
              className="flex items-center gap-1.5 hover:text-homekent-gold"
            >
              <MailIcon />
              {HOMEKENT_EMAIL}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <SocialIcon label="Facebook">
              <FacebookIcon />
            </SocialIcon>
            <SocialIcon label="Instagram">
              <InstagramIcon />
            </SocialIcon>
            <a
              href="#quote"
              className="hidden rounded bg-homekent-gold px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-homekent-navy transition hover:bg-homekent-gold-light sm:inline-block"
            >
              Get a Free Quote
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-homekent-navy/10 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href={home} className="shrink-0">
            <HomeKentLogo />
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-wider text-homekent-navy/80 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition hover:text-homekent-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-4 sm:flex">
              <a href={`tel:${homekentTelHref()}`} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-homekent-gold/15 text-homekent-gold">
                  <PhoneIcon />
                </span>
                <span>
                  <span className="block text-sm font-bold text-homekent-navy">
                    {HOMEKENT_PHONE}
                  </span>
                  <span className="text-[11px] text-homekent-muted">Call us anytime</span>
                </span>
              </a>
              <a
                href={`mailto:${HOMEKENT_EMAIL}`}
                className="hidden items-center gap-3 lg:flex"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-homekent-gold/15 text-homekent-gold">
                  <MailIcon />
                </span>
                <span>
                  <span className="block text-sm font-bold text-homekent-navy">
                    {HOMEKENT_EMAIL}
                  </span>
                  <span className="text-[11px] text-homekent-muted">Email us anytime</span>
                </span>
              </a>
            </div>
            <a
              href="#quote"
              className="rounded bg-homekent-gold px-4 py-2 text-xs font-bold uppercase tracking-wide text-homekent-navy transition hover:bg-homekent-gold-light lg:hidden"
            >
              Quote
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path
        fill="currentColor"
        d="M8 1a4 4 0 00-4 4c0 3 4 7 4 7s4-4 4-7a4 4 0 00-4-4zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path
        fill="currentColor"
        d="M2 4h12v8H2V4zm0-1a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H2zm1.5 1L8 8.5 12.5 4H3.5z"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <path
        fill="currentColor"
        d="M6.5 2h2l1.2 3.5-1.5 1a12 12 0 005.3 5.3l1-1.5L17.5 11v2a1 1 0 01-1 1C9.2 14 6 10.8 5 3.5A1 1 0 016.5 2z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path
        fill="currentColor"
        d="M9.5 3h2V0h-2c-2.8 0-4.5 1.7-4.5 4.5V8H3v3h2v9h3V11h2.5l.5-3H8V5c0-.8.7-2 1.5-2z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path
        fill="currentColor"
        d="M8 1.5c2 0 2.2 0 3 .1.8 0 1.2.2 1.5.3.4.2.7.4 1 .7.3.3.5.6.7 1 .1.3.3.7.3 1.5.1.8.1 1 .1 3s0 2.2-.1 3c0 .8-.2 1.2-.3 1.5-.2.4-.4.7-.7 1-.3.3-.6.5-1 .7-.3.1-.7.3-1.5.3-.8.1-1 .1-3 .1s-2.2 0-3-.1c-.8 0-1.2-.2-1.5-.3-.4-.2-.7-.4-1-.7-.3-.3-.5-.6-.7-1-.1-.3-.3-.7-.3-1.5-.1-.8-.1-1-.1-3s0-2.2.1-3c0-.8.2-1.2.3-1.5.2-.4.4-.7.7-1 .3-.3.6-.5 1-.7.3-.1.7-.3 1.5-.3.8-.1 1-.1 3-.1zM8 0C5.9 0 5.7 0 4.9.1 4.1.1 3.6.3 3.1.5c-.6.2-1 .5-1.4.9-.4.4-.7.8-.9 1.4-.2.5-.4 1-.5 1.8C.1 5.7 0 5.9 0 8s0 2.3.1 3.1c.1.8.3 1.3.5 1.8.2.6.5 1 .9 1.4.4.4.8.7 1.4.9.5.2 1 .4 1.8.5.8.1 1 .1 3.1.1s2.3 0 3.1-.1c.8-.1 1.3-.3 1.8-.5.6-.2 1-.5 1.4-.9.4-.4.7-.8.9-1.4.2-.5.4-1 .5-1.8.1-.8.1-1 .1-3.1s0-2.3-.1-3.1c-.1-.8-.3-1.3-.5-1.8-.2-.6-.5-1-.9-1.4-.4-.4-.8-.7-1.4-.9-.5-.2-1-.4-1.8-.5C10.3 0 10.1 0 8 0zm0 3.9a4.1 4.1 0 100 8.2 4.1 4.1 0 000-8.2zm0 6.8a2.7 2.7 0 110-5.4 2.7 2.7 0 010 5.4zm4.3-7a1 1 0 100-2 1 1 0 000 2z"
      />
    </svg>
  );
}
