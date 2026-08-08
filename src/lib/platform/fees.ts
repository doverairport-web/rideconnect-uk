import { PLATFORM_FEE_RATE } from "@/lib/platform/constants";

export function calculateJobFees(offeredFareGbp: number, feeRate = PLATFORM_FEE_RATE) {
  const offered = Math.round(offeredFareGbp * 100) / 100;
  const platformFeeGbp = Math.round(offered * (feeRate / 100) * 100) / 100;
  const driverPayoutGbp = Math.round((offered - platformFeeGbp) * 100) / 100;

  return {
    offeredFareGbp: offered,
    platformFeeRate: feeRate,
    platformFeeGbp,
    driverPayoutGbp,
  };
}

export function formatGbp(amount: number): string {
  return `£${amount.toFixed(2)}`;
}
