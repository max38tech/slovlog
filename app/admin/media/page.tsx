import { createAdminClient } from "@/lib/supabase/server";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { MediaGrid } from "@/components/admin/MediaGrid";
import { Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const supabase = createAdminClient();

  const { data: mediaItems } = await (supabase.from("slog_media") as any)
    .select("*")
    .order("created_at", { ascending: false });

  const items = mediaItems || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="font-universa text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-slovenia-blue" />
          Media Library
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload and organize your Slovenia trip photography stored in Supabase Storage.
        </p>
      </div>

      {/* Uploader Card */}
      <MediaUploader />

      {/* Media Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-universa text-lg font-bold text-slate-900">
            Uploaded Photos ({items.length})
          </h2>
        </div>
        <MediaGrid items={items} />
      </div>
    </div>
  );
}
