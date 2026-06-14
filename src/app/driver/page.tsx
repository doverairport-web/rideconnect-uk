import { redirect } from "next/navigation";

const DRIVER_URL =
  process.env.NEXT_PUBLIC_DRIVER_URL?.trim() ||
  "https://rideconnect-dispatch.vercel.app/login";

export default function DriverPage() {
  redirect(DRIVER_URL);
}
