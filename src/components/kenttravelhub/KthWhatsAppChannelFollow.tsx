import { KthWhatsAppChannelIcon } from "@/components/kenttravelhub/KthWhatsAppChannelIcon";
import {
  KTH_WHATSAPP_CHANNEL_DESCRIPTION,
  KTH_WHATSAPP_CHANNEL_LABEL,
  KTH_WHATSAPP_CHANNEL_URL,
} from "@/lib/kenttravelhub/brand";

type Props = {
  /** compact — header; button — inline CTA; banner — section strip with description */
  variant?: "compact" | "button" | "banner";
  tone?: "light" | "dark";
  className?: string;
};

export function KthWhatsAppChannelFollow({
  variant = "button",
  tone = "light",
  className = "",
}: Props) {
  const isDark = tone === "dark";

  const linkClass =
    variant === "compact"
      ? `inline-flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-[10px] font-bold uppercase tracking-wide transition sm:px-3 sm:text-[11px] ${
          isDark
            ? "border-[#25D366]/50 bg-[#25D366]/15 text-white hover:bg-[#25D366]/25"
            : "border-[#25D366]/40 bg-[#25D366]/10 text-kth-navy hover:bg-[#25D366]/20"
        }`
      : `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
          isDark
            ? "border border-[#25D366]/50 bg-[#25D366]/15 text-white hover:bg-[#25D366]/25"
            : "border border-[#25D366]/40 bg-[#25D366]/10 text-kth-navy hover:bg-[#25D366]/20"
        }`;

  const link = (
    <a
      href={KTH_WHATSAPP_CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
      aria-label={`${KTH_WHATSAPP_CHANNEL_LABEL} — ${KTH_WHATSAPP_CHANNEL_DESCRIPTION}`}
    >
      <KthWhatsAppChannelIcon className="h-5 w-5 shrink-0" />
      <span className={variant === "compact" ? "hidden lg:inline" : undefined}>
        {KTH_WHATSAPP_CHANNEL_LABEL}
      </span>
      {variant === "compact" && (
        <span className="lg:hidden">WhatsApp</span>
      )}
    </a>
  );

  if (variant === "banner") {
    return (
      <section
        className={`border-b border-kth-navy/8 py-4 sm:py-5 ${
          isDark ? "bg-kth-navy/40" : "bg-[#25D366]/5"
        } ${className}`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p
            className={`max-w-2xl text-sm leading-relaxed ${
              isDark ? "text-white/80" : "text-kth-muted"
            }`}
          >
            {KTH_WHATSAPP_CHANNEL_DESCRIPTION}
          </p>
          {link}
        </div>
      </section>
    );
  }

  return <div className={className}>{link}</div>;
}
