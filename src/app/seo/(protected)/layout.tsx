import { redirect } from "next/navigation";
import { SeoSidebar } from "@/components/seo/SeoSidebar";
import { isSeoAuthenticated } from "@/lib/seo/auth";

export default async function SeoProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isSeoAuthenticated())) {
    redirect("/seo/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <SeoSidebar />
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
