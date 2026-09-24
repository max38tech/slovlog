"use client";

import { useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteMediaAction } from "@/lib/actions/media";
import { Copy, Trash2, MapPin, Check, Loader2 } from "lucide-react";
import { useState } from "react";

interface MediaItemProps {
  id: string;
  file_name: string;
  file_path: string;
  public_url: string;
  mime_type: string | null;
  size_bytes: number | null;
  caption: string | null;
  location: string | null;
  created_at: string;
}

export function MediaGrid({ items }: { items: MediaItemProps[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success("Copied public image URL to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy URL to clipboard.");
    }
  };

  const handleDelete = (id: string, filePath: string) => {
    if (!confirm("Delete this photo? It will be removed from Supabase Storage.")) {
      return;
    }

    startTransition(async () => {
      const res = await deleteMediaAction(id, filePath);
      if (res?.error) {
        toast.error("Failed to delete media: " + res.error);
      } else {
        toast.success("Photo deleted.");
        router.refresh();
      }
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (items.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
        <p className="font-medium text-slate-700">No media uploaded yet</p>
        <p className="text-xs text-slate-400 mt-1">
          Use the uploader above to add photos of your journey across Slovenia.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow transition-all group flex flex-col"
        >
          {/* Image Thumbnail */}
          <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
            <Image
              src={item.public_url}
              alt={item.caption || item.file_name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {item.location && (
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slovenia-green-leaf" />
                {item.location}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-3.5 flex-1 flex flex-col justify-between">
            <div>
              <p
                className="font-medium text-xs text-slate-800 truncate"
                title={item.file_name}
              >
                {item.caption || item.file_name}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>{formatFileSize(item.size_bytes)}</span>
                <span>{item.created_at?.split("T")[0]}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleCopy(item.id, item.public_url)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex-1 justify-center"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(item.id, item.file_path)}
                disabled={isPending}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
