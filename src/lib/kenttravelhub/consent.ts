export const KTH_CONSENT_STORAGE_KEY = "kth_cookie_consent";
export const KTH_CONSENT_VERSION = 1;

export type KthConsentRecord = {
  version: number;
  analytics: boolean;
  updatedAt: string;
};

export function isValidKthConsentRecord(value: unknown): value is KthConsentRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as KthConsentRecord;
  return (
    record.version === KTH_CONSENT_VERSION &&
    typeof record.analytics === "boolean" &&
    typeof record.updatedAt === "string"
  );
}
