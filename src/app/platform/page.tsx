import { redirect } from "next/navigation";

const DISPATCH_URL =
  process.env.NEXT_PUBLIC_DISPATCH_URL?.trim() ||
  "https://rideconnect-dispatch.vercel.app/dashboard";

export default function PlatformPage() {
  redirect(DISPATCH_URL);
}
