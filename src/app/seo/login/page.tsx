import { redirect } from "next/navigation";
import { SeoLoginForm } from "@/components/seo/SeoLoginForm";
import { isSeoAuthenticated, isSeoConfigured } from "@/lib/seo/auth";

export default async function SeoLoginPage() {
  if (await isSeoAuthenticated()) {
    redirect("/seo/dashboard");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <SeoLoginForm configured={isSeoConfigured()} />
    </div>
  );
}
