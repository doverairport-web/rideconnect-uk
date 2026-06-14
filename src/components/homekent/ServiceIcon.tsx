type ServiceIconProps = {
  name: string;
  className?: string;
};

export function ServiceIcon({ name, className = "h-8 w-8" }: ServiceIconProps) {
  const stroke = "currentColor";
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "broom":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...common} d="M8 26h16M12 22l-2 4M20 22l2 4" />
          <path {...common} d="M10 22c2-8 4-12 6-14s4-2 6 0 4 6 6 14" />
          <rect x="14" y="6" width="4" height="6" rx="1" fill={stroke} stroke="none" />
        </svg>
      );
    case "spray":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...common} d="M12 8h8v16a4 4 0 01-4 4h0a4 4 0 01-4-4V8z" />
          <path {...common} d="M14 4h4v4h-4zM20 6l3-2M22 10l4-1M20 14l3 2" />
        </svg>
      );
    case "key":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <circle {...common} cx="11" cy="15" r="5" />
          <path {...common} d="M15 15h10M21 15v3M25 15v2" />
        </svg>
      );
    case "palm":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...common} d="M16 28V14M16 14c-4-6-10-4-8 2s6 4 8 0" />
          <path {...common} d="M16 14c4-6 10-4 8 2s-6 4-8 0" />
          <path {...common} d="M10 26h12M8 22h16" />
        </svg>
      );
    case "clipboard":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <rect {...common} x="8" y="6" width="16" height="22" rx="2" />
          <path {...common} d="M13 6h6a2 2 0 012 2v2h-10V8a2 2 0 012-2z" />
          <path {...common} d="M12 16l3 3 6-7" />
        </svg>
      );
    case "hand-key":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...common} d="M10 18c0-4 2-8 6-8s6 4 6 8v8H10v-8z" />
          <circle {...common} cx="22" cy="12" r="3" />
          <path {...common} d="M24 12h5M27 12v2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <circle {...common} cx="16" cy="16" r="8" />
        </svg>
      );
  }
}
