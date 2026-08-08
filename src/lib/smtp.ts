/** 123 Reg Professional Email (Generation 2) — smtpout.secureserver.net */
export const OFFICIAL_EMAIL = "info@rideconnectuk.com";

export const DEFAULT_SMTP_HOST = "smtpout.secureserver.net";
export const DEFAULT_SMTP_PORT = 465;

export function dispatchEmail(): string {
  return process.env.DISPATCH_EMAIL?.trim() || OFFICIAL_EMAIL;
}

export function emailFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || `RideConnect UK <${OFFICIAL_EMAIL}>`;
}

/** Extract bare address from `Name <user@domain>` or plain `user@domain`. */
export function parseEmailAddress(value: string): string {
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] || value).trim();
}

/**
 * SMTP envelope From must use the authenticated mailbox domain (e.g. 123 Reg).
 * Uses preferredFrom only when its domain matches the SMTP user.
 */
export function smtpFromAddress(
  smtpUser: string,
  displayName: string,
  preferredFrom?: string,
): string {
  const preferred = preferredFrom?.trim();
  if (preferred) {
    const preferredEmail = parseEmailAddress(preferred);
    const userDomain = smtpUser.split("@")[1]?.toLowerCase();
    const fromDomain = preferredEmail.split("@")[1]?.toLowerCase();
    if (userDomain && fromDomain && userDomain === fromDomain) {
      return preferred;
    }
  }
  return `${displayName} <${smtpUser}>`;
}

type TransportConfig = {
  port: number;
  secure: boolean;
  requireTLS?: boolean;
};

export function smtpTransportConfigs(): TransportConfig[] {
  const port = Number(process.env.SMTP_PORT || DEFAULT_SMTP_PORT);
  if (port === 587) {
    return [{ port: 587, secure: false, requireTLS: true }];
  }
  return [
    { port: 465, secure: true },
    { port: 587, secure: false, requireTLS: true },
  ];
}

export function smtpTransportOptions(
  user: string,
  pass: string,
  config: TransportConfig,
  hostOverride?: string,
) {
  const host =
    hostOverride?.trim() ||
    process.env.SMTP_HOST?.trim() ||
    DEFAULT_SMTP_HOST;
  return {
    host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    auth: { user, pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  };
}
