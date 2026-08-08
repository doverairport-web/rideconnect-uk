import {
  KTH_HERO_EYEBROW,
  KTH_HERO_HEADLINE,
  KTH_HERO_SUBHEADLINE,
  KTH_WHATSAPP_CHANNEL_DESCRIPTION,
} from "@/lib/kenttravelhub/brand";
import { KthHomeCtaBar } from "@/components/kenttravelhub/KthHomeCtaBar";
import { KthWhatsAppChannelFollow } from "@/components/kenttravelhub/KthWhatsAppChannelFollow";

export function KthHomeHero() {
  return (
    <header className="border-b border-kth-navy/10 bg-kth-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-kth-gold">
            {KTH_HERO_EYEBROW}
          </p>
        </div>

        <h1 className="mt-3 max-w-2xl text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
          {KTH_HERO_HEADLINE}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
          {KTH_HERO_SUBHEADLINE}
        </p>

        <div className="mt-5 max-w-2xl">
          <KthHomeCtaBar />
        </div>

        <div className="mt-4 max-w-2xl rounded-lg border border-[#25D366]/30 bg-[#25D366]/10 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm leading-relaxed text-white/85">
            {KTH_WHATSAPP_CHANNEL_DESCRIPTION}
          </p>
          <div className="mt-3 shrink-0 sm:mt-0">
            <KthWhatsAppChannelFollow variant="button" tone="dark" />
          </div>
        </div>
      </div>
    </header>
  );
}
