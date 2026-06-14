export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "card", label: "Card" },
  { value: "payment_link", label: "Payment Link" },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];

export function paymentMethodLabel(value: string): string {
  return PAYMENT_METHODS.find((item) => item.value === value)?.label ?? value;
}

export function formatDuration(minutes: number): { hours: number; mins: number; label: string } {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return { hours: 0, mins, label: `${mins} min` };
  }
  return {
    hours,
    mins,
    label: `${hours} hr${hours === 1 ? "" : "s"}, ${mins} min`,
  };
}

export function formatLuggageSummary(small: number, large: number): string {
  const parts: string[] = [];
  if (small > 0) parts.push(`${small} cabin`);
  if (large > 0) parts.push(`${large} large`);
  return parts.join(", ");
}
