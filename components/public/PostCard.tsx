import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { calculateReadingTime } from "@/lib/utils/public-posts";

interface PostCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    cover_image: string | null;
    location: string | null;
    trip_date: string;
    featured?: boolean;
  };
}

export function PostCard({ post }: PostCardProps) {
  const readingTime = calculateReadingTime(post.content);

  return (
    <article className="bg-white dark:bg-[#131d2e] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md dark:shadow-none dark:hover:border-slate-700 transition-all duration-300 flex flex-col group">
      {/* Cover Image */}
      <Link href={`/posts/${post.slug}`} className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800/80 overflow-hidden block">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slovenia-blue/10 dark:from-slovenia-blue/20 to-slovenia-green/10 dark:to-slovenia-green/20 text-slovenia-blue dark:text-blue-300">
            <span className="font-universa text-2xl font-normal tracking-[0.08em] opacity-30 uppercase">slovlog</span>
          </div>
        )}

        {/* Location pill */}
        {post.location && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-slovenia-green-leaf dark:text-emerald-400 font-semibold text-xs shadow-xs border border-transparent dark:border-slate-700/60 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slovenia-green-leaf dark:text-emerald-400" />
            <span className="text-slate-800 dark:text-slate-200 font-medium">{post.location}</span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-400 mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.trip_date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readingTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-sans text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-slovenia-blue dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            <Link href={`/posts/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 line-clamp-2 leading-relaxed font-sans">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Read Link */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <Link
            href={`/posts/${post.slug}`}
            className="text-xs font-semibold text-slovenia-blue dark:text-blue-400 hover:text-slovenia-blue-dark dark:hover:text-blue-300 inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
          >
            <span>Read Story</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
