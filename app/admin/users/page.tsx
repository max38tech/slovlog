import { createAdminClient } from "@/lib/supabase/server";
import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = createAdminClient();

  const { data: dbUsers } = await (supabase.from("slog_admin_users") as any)
    .select("*")
    .order("created_at", { ascending: true });

  let users = dbUsers || [];

  // Guarantee Shawn Shiobara is in the users list
  const ownerEmail = (process.env.INITIAL_ADMIN_EMAIL || "shawn.shiobara@gmail.com").toLowerCase();
  const hasOwner = users.some((u: { email: string }) => u.email.toLowerCase() === ownerEmail);

  if (!hasOwner) {
    users = [
      {
        id: "owner-initial",
        email: ownerEmail,
        role: "owner" as const,
        created_at: new Date().toISOString(),
      },
      ...users,
    ];
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="font-universa text-3xl font-normal text-slate-900 dark:text-white tracking-[0.06em] uppercase flex items-center gap-3">
          <Users className="w-8 h-8 text-slovenia-blue dark:text-blue-400" />
          Admin Users Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage who can log into the /admin dashboard via Google OAuth to create and edit travel stories.
        </p>
      </div>

      <AdminUserTable users={users} />
    </div>
  );
}
