import { HOMEKENT_NAME, HOMEKENT_TAGLINE } from "@/lib/homekent/brand";

type HomeKentLogoProps = {
  variant?: "light" | "dark";
  showTagline?: boolean;
};

export function HomeKentLogo({
  variant = "dark",
  showTagline = true,
}: HomeKentLogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-homekent-navy";
  const taglineColor =
    variant === "light" ? "text-white/70" : "text-homekent-muted";

  return (
    <div className={`flex items-center gap-3 ${textColor}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-11 w-11 shrink-0"
        aria-hidden
      >
        <rect width="48" height="48" rx="10" fill="#1B2B4B" />
        <path
          d="M24 10 L36 20 V36 H12 V20 Z"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M18 36 V26 H30 V36"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.5"
        />
        <line x1="24" y1="14" x2="24" y2="22" stroke="#D4AF37" strokeWidth="2" />
        <rect x="22" y="22" width="4" height="6" rx="1" fill="#D4AF37" />
        <path
          d="M30 28 L34 24 L36 26"
          fill="none"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <p className="font-serif text-xl font-bold leading-tight tracking-tight">
          {HOMEKENT_NAME}
        </p>
        {showTagline ? (
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${taglineColor}`}
          >
            {HOMEKENT_TAGLINE}
          </p>
        ) : null}
      </div>
    </div>
  );
}
