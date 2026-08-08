import { redirect } from "next/navigation";
import { isSeoAuthenticated } from "@/lib/seo/auth";

export default async function SeoIndexPage() {
  if (await isSeoAuthenticated()) {
    redirect("/seo/dashboard");
  }
  redirect("/seo/login");
}
