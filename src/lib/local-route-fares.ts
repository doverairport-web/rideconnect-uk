const CRUISE_KEYWORDS = [
  "cruise terminal",
  "cruise ship",
  "cruise port",
  "dover cruise",
  "western docks",
  "eastern docks",
  "port of dover",
];

const CRUISE_TERMINAL_PATTERNS = [
  /\bct\s*1\b/i,
  /\bct\s*2\b/i,
  /\bterminal\s*1\b/i,
  /\bterminal\s*2\b/i,
];

export type LocalRouteFareMatch = {
  id: string;
  label: string;
  price: number;
};

type LocalRouteFareRule = {
  id: string;
  label: string;
  price: number;
  matches: (pickup: string, destination: string) => boolean;
};

function normalizeAddress(text: string): string {
  return text.trim().toLowerCase();
}

function isHeathrowContext(text: string): boolean {
  return /\b(heathrow|lhr|tw6|hounslow)\b/i.test(text);
}

function addressMentionsCruise(text: string): boolean {
  const lower = text.toLowerCase();
  if (CRUISE_KEYWORDS.some((keyword) => lower.includes(keyword))) return true;
  return CRUISE_TERMINAL_PATTERNS.some((pattern) => pattern.test(lower));
}

function matchesDoverPriory(text: string): boolean {
  const value = normalizeAddress(text);
  return (
    /\bdover\s+priory\b/.test(value) ||
    /\bpriory\s+station\b/.test(value) ||
    (/\bpriory\b/.test(value) && /\b(dover|ct17)\b/.test(value))
  );
}

function matchesDoverCruiseTerminal2(text: string): boolean {
  const value = normalizeAddress(text);
  if (isHeathrowContext(value)) return false;
  return (
    /\bct\s*2\b/.test(value) ||
    /\bterminal\s*2\b/.test(value) ||
    /\bcruise\s+terminal\s+(two|2)\b/.test(value) ||
    /\bnew\s+marina\s+curve\b/.test(value)
  );
}

function matchesTravelodge(text: string): boolean {
  return /\btravelodge\b/i.test(text);
}

function matchesDoverCruiseTerminal(text: string): boolean {
  if (isHeathrowContext(text)) return false;
  return addressMentionsCruise(text);
}

const LOCAL_ROUTE_FARES: LocalRouteFareRule[] = [
  {
    id: "priory-ct2",
    label: "Dover Priory ↔ Cruise Terminal 2",
    price: 12,
    matches: (pickup, destination) =>
      (matchesDoverPriory(pickup) && matchesDoverCruiseTerminal2(destination)) ||
      (matchesDoverPriory(destination) && matchesDoverCruiseTerminal2(pickup)),
  },
  {
    id: "travelodge-terminal",
    label: "Travelodge ↔ Cruise Terminal",
    price: 12,
    matches: (pickup, destination) =>
      (matchesTravelodge(pickup) && matchesDoverCruiseTerminal(destination)) ||
      (matchesTravelodge(destination) && matchesDoverCruiseTerminal(pickup)),
  },
];

/** Fixed £12 local routes — single pickup and single destination only. */
export function lookupLocalRouteFare(
  pickup: string,
  destination: string,
): LocalRouteFareMatch | null {
  const from = pickup.trim();
  const to = destination.trim();
  if (!from || !to) return null;

  for (const rule of LOCAL_ROUTE_FARES) {
    if (rule.matches(from, to)) {
      return { id: rule.id, label: rule.label, price: rule.price };
    }
  }
  return null;
}
