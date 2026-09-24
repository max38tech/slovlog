import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyAdminUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If visiting /admin/login, don't wrap with admin dashboard sidebar
  // (though route groups could also be used, keeping layout clean)
  if (!user || !user.email) {
    // If not authenticated, let middleware handle redirect to /admin/login
    return <>{children}</>;
  }

  const check = await verifyAdminUser(user.email);
  if (!check.authorized) {
    redirect(`/admin/login?error=unauthorized&email=${encodeURIComponent(user.email)}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row">
      <AdminSidebar userEmail={user.email} role={check.role || "admin"} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
