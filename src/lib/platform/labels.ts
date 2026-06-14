import type { JobStatus, PaymentType } from "@/lib/platform/types";

export const STATUS_LABELS: Record<JobStatus, string> = {
  open: "Open",
  accepted: "Accepted",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PAYMENT_LABELS: Record<PaymentType, string> = {
  cash: "Cash",
  account: "Account",
  card: "Card (prepaid)",
};

export function statusTone(status: JobStatus): string {
  switch (status) {
    case "open":
      return "bg-amber-100 text-amber-900";
    case "accepted":
      return "bg-brand-blue/10 text-brand-blue";
    case "in_progress":
      return "bg-navy/10 text-navy";
    case "completed":
      return "bg-brand-green/15 text-brand-green-dark";
    case "cancelled":
      return "bg-navy/10 text-muted";
    default:
      return "bg-navy/10 text-muted";
  }
}
