import type { ReactNode } from "react";
import {
  customerAppHref,
  customerAppStoreUrl,
  customerGooglePlayUrl,
  driverWebLoginUrl,
  hasCustomerAppDownloadLinks,
  hasCustomerAppSection,
  passengerWebUrl,
} from "@/lib/apps";

type Variant = "dark" | "light";

function badgeClass(variant: Variant): string {
  return variant === "dark"
    ? "border-white/20 bg-black text-white hover:border-brand-green hover:bg-neutral-900"
    : "border-navy/15 bg-navy text-white hover:border-brand-green hover:bg-navy/90";
}

function AppleIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 shrink-0 fill-current">
      <path d="M16.365 1.43c0 1.14-.417 2.063-1.248 2.77-.96.89-2.088 1.335-3.384 1.26-.04-1.09.39-2.043 1.29-2.86.9-.817 2.01-1.25 3.342-1.17zm1.38 3.74c-1.57-.09-2.9.56-3.99 1.95-1.01 1.28-1.51 2.78-1.5 4.5.01 1.72.52 3.22 1.53 4.5 1.01 1.28 2.2 1.93 3.57 1.93.73 0 1.54-.17 2.43-.51.89-.34 1.54-.51 1.95-.51.38 0 .98.16 1.8.49.82.33 1.52.49 2.1.49 1.28 0 2.41-.6 3.39-1.8 1.06-1.3 1.59-2.76 1.59-4.38-.01-1.51-.36-2.8-1.05-3.87-.88-1.36-2.06-2.04-3.54-2.04-.74 0-1.62.15-2.64.45-1.02.3-1.56.45-1.62.45-.35 0-.96-.14-1.83-.42-.87-.28-1.6-.42-2.19-.42z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 shrink-0 fill-current">
      <path d="M3.6 2.4A1.2 1.2 0 0 0 2 3.6v16.8a1.2 1.2 0 0 0 1.8 1.04l14.4-8.4a1.2 1.2 0 0 0 0-2.08L3.6 2.4z" />
    </svg>
  );
}

function StoreBadge({
  href,
  icon,
  label,
  store,
  variant,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  store: string;
  variant: Variant;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-w-[9.5rem] items-center gap-3 rounded-xl border px-4 py-2.5 transition ${badgeClass(variant)}`}
    >
      {icon}
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wide opacity-80">
          {label}
        </span>
        <span className="block text-sm font-semibold">{store}</span>
      </span>
    </a>
  );
}

/** App Store / Google Play badges, or web app link before store listing. */
export function CustomerAppDownload({
  className = "",
  variant = "dark",
  title = "For customers",
  subtitle,
}: {
  className?: string;
  variant?: Variant;
  title?: string;
  subtitle?: string;
}) {
  if (!hasCustomerAppSection()) return null;

  const resolvedSubtitle =
    subtitle ??
    (hasCustomerAppDownloadLinks()
      ? "Book and track rides in the RideConnect app"
      : "Book airport and cruise transfers in the RideConnect app");

  const webButtonClass =
    variant === "dark"
      ? "border-white/20 bg-brand-green text-white hover:bg-brand-green-dark"
      : "border-brand-green bg-brand-green text-white hover:bg-brand-green-dark";

  return (
    <div className={className}>
      {title ? (
        <p className="mb-1 text-sm font-semibold text-inherit">{title}</p>
      ) : null}
      {resolvedSubtitle ? (
        <p className="mb-3 text-sm text-inherit opacity-75">{resolvedSubtitle}</p>
      ) : null}
      {hasCustomerAppDownloadLinks() ? (
        <div className="flex flex-wrap items-center gap-3">
          {customerAppStoreUrl ? (
            <StoreBadge
              href={customerAppStoreUrl}
              icon={<AppleIcon />}
              label="Download on the"
              store="App Store"
              variant={variant}
            />
          ) : null}
          {customerGooglePlayUrl ? (
            <StoreBadge
              href={customerGooglePlayUrl}
              icon={<PlayIcon />}
              label="Get it on"
              store="Google Play"
              variant={variant}
            />
          ) : null}
        </div>
      ) : (
        <a
          href={customerAppHref()}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex rounded-xl border px-5 py-3 text-sm font-semibold transition ${webButtonClass}`}
        >
          Open RideConnect app
        </a>
      )}
      {!hasCustomerAppDownloadLinks() && passengerWebUrl ? (
        <p className="mt-2 text-xs text-inherit opacity-60">
          Works in Safari — App Store coming soon
        </p>
      ) : null}
    </div>
  );
}

/** Web login for drivers on the RideConnect dispatch network. */
export function DriverWebLogin({
  className = "",
  variant = "dark",
  title = "For drivers",
  subtitle = "Sign in on your phone to accept jobs from dispatch.",
}: {
  className?: string;
  variant?: Variant;
  title?: string;
  subtitle?: string;
}) {
  const buttonClass =
    variant === "dark"
      ? "border-white/25 bg-brand-green text-white hover:bg-brand-green-dark"
      : "border-brand-green bg-brand-green text-white hover:bg-brand-green-dark";

  return (
    <div className={className}>
      {title ? (
        <p className="mb-1 text-sm font-semibold text-inherit">{title}</p>
      ) : null}
      {subtitle ? (
        <p className="mb-3 text-sm text-inherit opacity-75">{subtitle}</p>
      ) : null}
      <a
        href={driverWebLoginUrl}
        className={`inline-flex rounded-xl border px-5 py-3 text-sm font-semibold transition ${buttonClass}`}
      >
        Driver login
      </a>
    </div>
  );
}

/** @deprecated Use CustomerAppDownload */
export function AppStoreButtons(props: {
  className?: string;
  variant?: Variant;
  title?: string;
}) {
  return (
    <CustomerAppDownload
      className={props.className}
      variant={props.variant}
      title={props.title ?? "For customers"}
      subtitle="Book and track rides in the RideConnect app"
    />
  );
}
