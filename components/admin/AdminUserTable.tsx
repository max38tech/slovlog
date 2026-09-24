"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addAdminUserAction, deleteAdminUserAction } from "@/lib/actions/users";
import { canDeleteAdmin } from "@/lib/utils/admin-protection";
import { UserPlus, Shield, ShieldCheck, Trash2, Loader2, Mail } from "lucide-react";

interface AdminUserItem {
  id: string;
  email: string;
  role: "owner" | "admin";
  created_at: string;
}

export function AdminUserTable({ users }: { users: AdminUserItem[] }) {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const formData = new FormData();
    formData.append("email", emailInput.trim());

    startTransition(async () => {
      const res = await addAdminUserAction(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(`Added ${emailInput.trim()} as administrator!`);
        setEmailInput("");
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string, email: string) => {
    const check = canDeleteAdmin(email);
    if (!check.allowed) {
      toast.error(check.reason);
      return;
    }

    if (!confirm(`Are you sure you want to remove ${email} from administrators?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteAdminUserAction(id, email);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(`Removed ${email} from administrators.`);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Admin Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="font-universa text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
          <UserPlus className="w-5 h-5 text-slovenia-blue" />
          Authorize New Administrator
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Add a collaborator&apos;s Google email address. Once added, they can sign in via Google OAuth at <span className="font-mono text-slate-700">/admin</span>.
        </p>

        <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. friend@gmail.com"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slovenia-blue/20 focus:border-slovenia-blue"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slovenia-blue hover:bg-slovenia-blue-dark text-white font-medium text-sm transition-all disabled:opacity-50 shrink-0"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            Grant Admin Access
          </button>
        </form>
      </div>

      {/* Admins Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-universa text-lg font-bold text-slate-900">
            Active Administrators ({users.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Google Account</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Added On</th>
                <th className="py-3.5 px-6 text-right">Protection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const isOwner = user.role === "owner" || !canDeleteAdmin(user.email).allowed;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                          {user.email.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.email}</p>
                          <p className="text-xs text-slate-400">Google OAuth Identity</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          isOwner
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-blue-50 text-slovenia-blue border border-blue-200"
                        }`}
                      >
                        {isOwner ? (
                          <ShieldCheck className="w-3 h-3 text-amber-600" />
                        ) : (
                          <Shield className="w-3 h-3 text-slovenia-blue" />
                        )}
                        {isOwner ? "Owner (Protected)" : "Administrator"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {user.created_at ? user.created_at.split("T")[0] : "Initial setup"}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {isOwner ? (
                        <span
                          className="text-[11px] font-medium text-slate-400 italic"
                          title="The site owner super-user cannot be deleted or revoked"
                        >
                          Permanent Owner
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id, user.email)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 transition-colors"
                          title="Revoke admin access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Revoke Access
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
