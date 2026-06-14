export const JOB_TYPES = ["sklon_jizdy", "saga_transport", "account_job"] as const;

export type JobType = (typeof JOB_TYPES)[number];

export type PersonalJob = {
  id: string;
  type: JobType;
  date: string;
  driver: string;
  customer: string;
  pickup: string;
  destination: string;
  price: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type PersonalJobInput = {
  type: JobType;
  date: string;
  driver: string;
  customer?: string;
  pickup?: string;
  destination?: string;
  price: number;
  notes?: string;
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  sklon_jizdy: "Sklon jízdy",
  saga_transport: "SAGA Transport",
  account_job: "Account job",
};
