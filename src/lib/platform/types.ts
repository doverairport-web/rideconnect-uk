export const JOB_STATUSES = [
  "open",
  "accepted",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const PAYMENT_TYPES = ["cash", "account", "card"] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number];

export const SCHEDULE_MODES = ["asap", "scheduled"] as const;
export type ScheduleMode = (typeof SCHEDULE_MODES)[number];

export type PlatformDriver = {
  id: string;
  name: string;
  phone: string;
  pinHash: string;
  vehicle?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PlatformJob = {
  id: string;
  reference: string;
  status: JobStatus;
  pickup: string;
  destination: string;
  scheduleMode: ScheduleMode;
  scheduledAt: string | null;
  offeredFareGbp: number;
  platformFeeRate: number;
  platformFeeGbp: number;
  driverPayoutGbp: number;
  paymentType: PaymentType;
  passengers: number;
  luggage: number;
  notes: string;
  assignedDriverId: string | null;
  assignedDriverName: string | null;
  acceptedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type PlatformJobInput = {
  pickup: string;
  destination: string;
  scheduleMode: ScheduleMode;
  scheduledAt: string | null;
  offeredFareGbp: number;
  paymentType: PaymentType;
  passengers: number;
  luggage: number;
  notes: string;
};

export type PlatformStore = {
  drivers: PlatformDriver[];
  jobs: PlatformJob[];
  jobSequence: number;
};

export type PlatformJobPublic = Omit<PlatformJob, never>;

export type DriverPublic = Pick<
  PlatformDriver,
  "id" | "name" | "phone" | "vehicle" | "active"
>;
