"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  BookOpen,
  Image as ImageIcon,
  Users,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react";

interface AdminSidebarProps {
  userEmail: string;
  role: string;
}

export function AdminSidebar({ userEmail, role }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Travel Stories", href: "/admin/posts", icon: BookOpen },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "Admin Users", href: "/admin/users", icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-800 p-1.5 border border-slate-700/60 flex items-center justify-center group-hover:border-slovenia-blue transition-colors">
            <Image
              src="/brand/ljubljana-dragon.png"
              alt="Ljubljana Dragon"
              width={32}
              height={32}
              className="w-7 h-7 object-contain"
            />
          </div>
          <div>
            <div className="font-universa text-xl font-normal tracking-[0.08em] text-white flex items-center gap-1.5 uppercase">
              slovlog <span className="text-xs px-1.5 py-0.5 rounded bg-slovenia-blue/30 text-slovenia-blue-light font-mono font-normal lowercase tracking-normal">CMS</span>
            </div>
            <div className="text-[11px] text-slate-400">Slovenia Travel Journal</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Content & System
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-slovenia-blue text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-6">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Public Website
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <span className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-slovenia-green-leaf" />
              Visit slovlog.com
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="truncate max-w-[140px]">
            <p className="text-xs font-medium text-white truncate" title={userEmail}>
              {userEmail}
            </p>
            <span className={`inline-block text-[10px] uppercase font-mono px-1.5 py-0.2 rounded mt-0.5 ${
              role === "owner" ? "bg-amber-500/20 text-amber-300" : "bg-slate-800 text-slate-400"
            }`}>
              {role}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sign out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
