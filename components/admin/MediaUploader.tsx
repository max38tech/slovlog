"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadCloud, Loader2, Image as ImageIcon, MapPin } from "lucide-react";
import { uploadMediaAction } from "@/lib/actions/media";

export function MediaUploader() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dragActive, setDragActive] = useState(false);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("Ljubljana");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File is too large. Maximum allowed size is 20MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);
    formData.append("location", location);

    startTransition(async () => {
      const res = await uploadMediaAction(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(`Successfully uploaded "${file.name}"!`);
        setCaption("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        router.refresh();
      }
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="bg-white dark:bg-[#131d2e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-universa text-lg font-normal text-slate-900 dark:text-white tracking-[0.06em] uppercase flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-slovenia-blue dark:text-blue-400" />
            Upload Travel Photos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Photos are saved to Supabase Storage (slovlog-media) and served via global CDN.
          </p>
        </div>
      </div>

      {/* Optional Metadata Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
            Caption / Description (Optional)
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Dragon Bridge at sunset"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slovenia-blue/20 focus:border-slovenia-blue"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slovenia-green-leaf dark:text-emerald-400" />
            Location Tag
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Ljubljana, Lake Bled, Piran"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slovenia-blue/20 focus:border-slovenia-blue"
          />
        </div>
      </div>

      {/* Drag & Drop Target */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center min-h-[160px] ${
          dragActive
            ? "border-slovenia-blue bg-slovenia-blue/5 dark:bg-slovenia-blue/10 scale-[0.99]"
            : "border-slate-300 dark:border-slate-700 hover:border-slovenia-blue/60 dark:hover:border-blue-500/60 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/80"
        } ${isPending ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        {isPending ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-slovenia-blue dark:text-blue-400" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Uploading photo to Supabase...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-slovenia-blue/10 dark:bg-slovenia-blue/20 text-slovenia-blue dark:text-blue-400 flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Click to browse or drag and drop photos here
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                PNG, JPG, WEBP, or AVIF up to 20MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
