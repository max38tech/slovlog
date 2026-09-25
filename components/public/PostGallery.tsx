"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/public/Lightbox";
import { Images } from "lucide-react";

export function PostGallery({ images }: { images: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Images className="w-5 h-5 text-slovenia-green-leaf dark:text-emerald-400" />
        <h3 className="font-universa text-xl font-normal text-slate-900 dark:text-white tracking-[0.06em] uppercase">
          Photo Gallery ({images.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            onClick={() => setLightboxIndex(idx)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 border border-slate-200/60 dark:border-slate-800"
          >
            <Image
              src={imgUrl}
              alt={`Gallery image ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-xs">
                View Fullscreen
              </span>
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}
    </section>
  );
}
