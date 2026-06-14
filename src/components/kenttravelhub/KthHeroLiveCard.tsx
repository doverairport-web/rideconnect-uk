import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  titleHref?: string;
  titleExternal?: boolean;
  footerHref: string;
  footerLabel: string;
  footerExternal?: boolean;
  secondaryFooterHref?: string;
  secondaryFooterLabel?: string;
  className?: string;
  children: ReactNode;
};

export function KthHeroLiveCard({
  title,
  subtitle,
  titleHref,
  titleExternal = false,
  footerHref,
  footerLabel,
  footerExternal = false,
  secondaryFooterHref,
  secondaryFooterLabel,
  className = "",
  children,
}: Props) {
  const titleEl = titleHref ? (
    <a
      href={titleHref}
      className="transition hover:text-kth-gold"
      {...(titleExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {title}
    </a>
  ) : (
    title
  );

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-xl border border-kth-gold/25 bg-[#081a30] shadow-xl ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-kth-gold/20 bg-kth-gold/10 px-3 py-2 sm:px-3.5">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[10px] font-extrabold uppercase tracking-[0.14em] text-kth-gold">
            {titleEl}
          </h2>
          {subtitle && (
            <p className="truncate text-[10px] leading-snug text-white/55">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 text-white sm:p-3.5">
        <div className="flex-1">{children}</div>

        <div className="mt-2.5 space-y-1 border-t border-white/10 pt-2.5">
          <a
            href={footerHref}
            className="block text-[11px] font-semibold text-white/80 transition hover:text-white"
            {...(footerExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {footerLabel}
          </a>
          {secondaryFooterHref && secondaryFooterLabel && (
            <a
              href={secondaryFooterHref}
              className="block text-[11px] font-medium text-white/55 transition hover:text-white/80"
            >
              {secondaryFooterLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
