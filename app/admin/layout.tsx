import { getSessionUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // If visiting /admin/login or unauthenticated, let page render without sidebar
  if (!user || !user.email) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b111e] text-slate-900 dark:text-slate-100 flex flex-row transition-colors">
      <AdminSidebar userEmail={user.email} role={user.role || "admin"} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
