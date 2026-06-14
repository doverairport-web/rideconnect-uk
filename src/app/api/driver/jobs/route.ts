import { NextResponse } from "next/server";
import { getAuthenticatedDriver } from "@/lib/platform/driver-auth";
import { listJobs } from "@/lib/platform/store";

export async function GET() {
  const driver = await getAuthenticatedDriver();
  if (!driver) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const jobs = await listJobs();
  const available = jobs.filter((job) => job.status === "open");
  const mine = jobs.filter(
    (job) =>
      job.assignedDriverId === driver.id &&
      ["accepted", "in_progress"].includes(job.status),
  );
  const recent = jobs
    .filter(
      (job) =>
        job.assignedDriverId === driver.id && job.status === "completed",
    )
    .slice(0, 10);

  const completed = jobs.filter(
    (job) =>
      job.assignedDriverId === driver.id && job.status === "completed",
  );
  const gross = completed.reduce((sum, job) => sum + job.offeredFareGbp, 0);
  const fees = completed.reduce((sum, job) => sum + job.platformFeeGbp, 0);

  return NextResponse.json({
    ok: true,
    available,
    mine,
    recent,
    earnings: {
      completedJobs: completed.length,
      gross: Math.round(gross * 100) / 100,
      fees: Math.round(fees * 100) / 100,
      net: Math.round((gross - fees) * 100) / 100,
    },
    driver: {
      id: driver.id,
      name: driver.name,
      phone: driver.phone,
      vehicle: driver.vehicle,
    },
  });
}
