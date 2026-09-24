import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import {
  BookOpen,
  FileCheck,
  FileClock,
  Image as ImageIcon,
  Plus,
  ArrowRight,
  MapPin,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [{ data: posts }, { data: media }] = await Promise.all([
    (supabase.from("posts") as any)
      .select("id, title, slug, location, trip_date, published, featured, created_at")
      .order("trip_date", { ascending: false }),
    (supabase.from("media") as any).select("id"),
  ]);

  const allPosts = posts || [];
  const totalPosts = allPosts.length;
  const publishedPosts = allPosts.filter((p: { published: boolean }) => p.published).length;
  const draftPosts = totalPosts - publishedPosts;
  const totalMedia = (media || []).length;
  const recentPosts = allPosts.slice(0, 5);

  const stats = [
    {
      label: "Total Stories",
      value: totalPosts,
      icon: BookOpen,
      color: "text-slovenia-blue bg-slovenia-blue/10",
    },
    {
      label: "Published",
      value: publishedPosts,
      icon: FileCheck,
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Drafts",
      value: draftPosts,
      icon: FileClock,
      color: "text-amber-700 bg-amber-50",
    },
    {
      label: "Media Assets",
      value: totalMedia,
      icon: ImageIcon,
      color: "text-slovenia-green-leaf bg-slovenia-green/10",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-universa text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your Slovenia travel log, photography archives, and blog settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slovenia-blue hover:bg-slovenia-blue-dark text-white font-medium text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Write New Story
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow transition-shadow flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="font-universa text-3xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Stories & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Posts Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-universa text-lg font-bold text-slate-900">
              Recent Travel Stories
            </h2>
            <Link
              href="/admin/posts"
              className="text-xs font-medium text-slovenia-blue hover:underline inline-flex items-center gap-1"
            >
              View all ({totalPosts})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No travel stories written yet. Click &quot;Write New Story&quot; to begin!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentPosts.map((post: any) => (
                <div
                  key={post.id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-medium text-slate-900 hover:text-slovenia-blue text-sm truncate block"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slovenia-green-leaf" />
                        {post.location || "Slovenia"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {post.trip_date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                        post.published
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-xs text-slate-600 hover:text-slovenia-blue font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips & Short cuts */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slovenia-blue-dark to-slovenia-blue text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-10">
              <BookOpen className="w-36 h-36" />
            </div>
            <h3 className="font-universa text-lg font-bold">Documenting Slovenia</h3>
            <p className="text-xs text-blue-100 mt-2 leading-relaxed">
              Every story you publish is instantly live on <strong>slovlog.com</strong> with rich imagery, location filters, and reading progress.
            </p>
            <div className="mt-5 pt-4 border-t border-blue-400/30 flex flex-col gap-2">
              <Link
                href="/admin/media"
                className="text-xs text-blue-100 hover:text-white flex items-center justify-between py-1 font-medium"
              >
                <span>Upload Travel Photography</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin/users"
                className="text-xs text-blue-100 hover:text-white flex items-center justify-between py-1 font-medium"
              >
                <span>Manage Collaborator Admins</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
