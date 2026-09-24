import Link from "next/link";
import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/server";
import { Plus, MapPin, Calendar, Edit, ExternalLink } from "lucide-react";
import { PostTableActions } from "@/components/admin/PostTableActions";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const supabase = createAdminClient();

  const { data: posts, error } = await (supabase.from("slog_posts") as any)
    .select("*")
    .order("trip_date", { ascending: false });

  const allPosts = posts || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-universa text-3xl font-bold text-slate-900 tracking-tight">
            Travel Stories
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Write, review, and organize travel journal entries from across Slovenia.
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slovenia-blue hover:bg-slovenia-blue-dark text-white font-medium text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Write New Story
        </Link>
      </div>

      {/* Posts Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        {allPosts.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="font-medium text-base text-slate-700">No stories written yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Begin documenting your journey through Slovenia.
            </p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slovenia-blue text-white text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Write Your First Story
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Story</th>
                  <th className="py-3.5 px-6">Destination</th>
                  <th className="py-3.5 px-6">Trip Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allPosts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {post.cover_image && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                            <Image
                              src={post.cover_image}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="font-medium text-slate-900 hover:text-slovenia-blue line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <div className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-xs">
                            /posts/{post.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-600">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-slovenia-green/10 text-slovenia-green">
                        <MapPin className="w-3 h-3 text-slovenia-green-leaf" />
                        {post.location || "Slovenia"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-600 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {post.trip_date}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            post.published
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                        {post.featured && (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {post.published && (
                          <Link
                            href={`/posts/${post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="View published story"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slovenia-blue hover:bg-slate-100 transition-colors"
                          title="Edit story"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <PostTableActions
                          postId={post.id}
                          published={post.published}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
