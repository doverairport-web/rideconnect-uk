import { redirect } from "next/navigation";
import { DriverApp } from "@/components/platform/DriverApp";

const DRIVER_URL =
  process.env.NEXT_PUBLIC_DRIVER_URL?.trim() || "/driver";

export default function DriverPage() {
  if (DRIVER_URL.startsWith("http")) {
    redirect(DRIVER_URL);
  }

  return <DriverApp />;
}
