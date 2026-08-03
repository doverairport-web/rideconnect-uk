import { HomeKentLogo } from "@/components/homekent/HomeKentLogo";
import {
  HOMEKENT_ADDRESS,
  HOMEKENT_AREAS,
  HOMEKENT_EMAIL,
  HOMEKENT_NAME,
  HOMEKENT_PHONE,
  homekentTelHref,
} from "@/lib/homekent/brand";
import { HOMEKENT_SERVICES } from "@/lib/homekent/content";
import { hkPath } from "@/lib/homekent/paths";
import Link from "next/link";
import type { ReactNode } from "react";

export async function HomeKentFooter() {
  const home = await hkPath();
  const contact = await hkPath("/contact");
  const privacy = await hkPath("/privacy");

  const quickLinks = [
    { href: home, label: "Home" },
    { href: `${home}#services`, label: "Services" },
    { href: `${home}#pricing`, label: "Pricing" },
    { href: `${home}#about`, label: "About Us" },
    { href: contact, label: "Contact" },
    { href: privacy, label: "Privacy Policy" },
  ];

  return (
    <footer className="bg-homekent-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <HomeKentLogo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Premium home cleaning across Kent — fine homes, coastal holiday
              lets and Airbnb changeovers. Local, trusted and fully insured.
            </p>
            <div className="mt-5 flex gap-3">
              <SocialLink label="Facebook">f</SocialLink>
              <SocialLink label="Instagram">ig</SocialLink>
              <SocialLink label="LinkedIn">in</SocialLink>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-homekent-gold">
              Quick Links
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-homekent-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-homekent-gold">
              Our Services
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {HOMEKENT_SERVICES.map((service) => (
                <li key={service.id}>
                  <a href={`${home}#services`} className="hover:text-homekent-gold">
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-homekent-gold">
              Contact Us
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li>
                <a
                  href={`tel:${homekentTelHref()}`}
                  className="hover:text-homekent-gold"
                >
                  {HOMEKENT_PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${HOMEKENT_EMAIL}`}
                  className="hover:text-homekent-gold"
                >
                  {HOMEKENT_EMAIL}
                </a>
              </li>
              <li>
                {HOMEKENT_AREAS}
                <br />
                {HOMEKENT_ADDRESS}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-white/10">
          <iframe
            title="HomeKent service area map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100000!2d1.3!3d51.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47dece5c4c8b8b8b%3A0x0!2sDover%2C%20UK!5e0!3m2!1sen!2suk!4v1"
            className="h-48 w-full border-0 grayscale-[30%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/50 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {HOMEKENT_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href={privacy} className="hover:text-white/80">
              Privacy Policy
            </Link>
            <span>|</span>
            <a href="#" className="hover:text-white/80">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs font-bold text-white/80 transition hover:border-homekent-gold hover:text-homekent-gold"
    >
      {children}
    </a>
  );
}
