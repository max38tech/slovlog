import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { isPostVisibleToUser, calculateReadingTime } from "@/lib/utils/public-posts";
import { MarkdownRenderer } from "@/components/public/MarkdownRenderer";
import { PostGallery } from "@/components/public/PostGallery";
import { MapPin, Calendar, Clock, ArrowLeft, ArrowRight, Share2, Compass } from "lucide-react";
import { SAMPLE_POSTS } from "@/lib/data/sample-posts";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: post } = await (supabase.from("slog_posts") as any)
    .select("title, excerpt, cover_image, location")
    .eq("slug", slug)
    .single();

  if (!post) {
    return { title: "Story Not Found" };
  }

  return {
    title: `${post.title} — slovlog`,
    description: post.excerpt || `Exploring ${post.location || "Slovenia"} on slovlog.com`,
    openGraph: {
      title: `${post.title} — slovlog`,
      description: post.excerpt || `Travel notes from ${post.location || "Slovenia"}`,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = createAdminClient();

  // Check if current user is an admin (to allow previewing drafts)
  const sessionUser = await getSessionUser();
  const isAdmin = Boolean(sessionUser);

  // Query post by slug
  let post: any = null;
  try {
    const { data, error } = await (supabase.from("slog_posts") as any)
      .select("*")
      .eq("slug", slug)
      .single();
    if (!error && data) {
      post = data;
    }
  } catch (e) {
    console.warn("Could not query post from Supabase:", e);
  }

  // Fallback to sample posts if not in DB
  if (!post) {
    post = SAMPLE_POSTS.find((p) => p.slug === slug) || null;
  }

  if (!post) {
    notFound();
  }

  // Review Focus: Strict draft isolation
  if (!isPostVisibleToUser(post, isAdmin)) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);

  // Fetch neighboring stories for navigation
  const { data: adjacentPosts } = await (supabase.from("slog_posts") as any)
    .select("slug, title, location, trip_date")
    .eq("published", true)
    .order("trip_date", { ascending: false });

  const allPublished = adjacentPosts || [];
  const currentIndex = allPublished.findIndex((p: { slug: string }) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPublished[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPublished.length - 1 ? allPublished[currentIndex + 1] : null;

  return (
    <article className="pb-24">
      {/* Draft Warning Banner for Admins */}
      {!post.published && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-semibold">
          Draft Preview Mode — This story is hidden from public visitors.
        </div>
      )}

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slovenia-blue dark:hover:text-blue-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to all stories
          </Link>

          {post.location && (
            <Link
              href={`/?destination=${encodeURIComponent(post.location)}#stories`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slovenia-green/10 dark:bg-emerald-950/40 text-slovenia-green dark:text-emerald-300 border border-slovenia-green/20 dark:border-emerald-800/40 text-xs font-semibold hover:bg-slovenia-green/20 dark:hover:bg-emerald-900/40 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-slovenia-green-leaf dark:text-emerald-400" />
              {post.location}
            </Link>
          )}
        </div>

        {/* Title */}
        <h1 className="font-sans text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Subtitle / Excerpt */}
        {post.excerpt && (
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-sans mt-4 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Metadata Strip */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slovenia-blue dark:text-blue-400" />
            {post.trip_date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            {readingTime}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-slovenia-green-leaf dark:text-emerald-400" />
            Slovenia Journey
          </span>
        </div>
      </header>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <MarkdownRenderer content={post.content} />

        {/* Photo Gallery with Lightbox */}
        {post.gallery_images && post.gallery_images.length > 0 && (
          <PostGallery images={post.gallery_images} />
        )}

        {/* Neighboring Story Pagination */}
        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPost ? (
            <Link
              href={`/posts/${prevPost.slug}`}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slovenia-blue/40 dark:hover:border-blue-500/40 bg-white dark:bg-[#131d2e] hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all text-left group"
            >
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                Previous Story
              </span>
              <p className="font-sans text-base font-bold text-slate-900 dark:text-white group-hover:text-slovenia-blue dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {prevPost.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{prevPost.location}</p>
            </Link>
          ) : (
            <div />
          )}

          {nextPost && (
            <Link
              href={`/posts/${nextPost.slug}`}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slovenia-blue/40 dark:hover:border-blue-500/40 bg-white dark:bg-[#131d2e] hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all text-right group sm:col-start-2"
            >
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center justify-end gap-1 mb-1">
                Next Story
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <p className="font-sans text-base font-bold text-slate-900 dark:text-white group-hover:text-slovenia-blue dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {nextPost.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{nextPost.location}</p>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
