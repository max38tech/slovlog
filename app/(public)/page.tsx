import Link from "next/link";
import Image from "next/image";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { PostCard } from "@/components/public/PostCard";
import { MapPin, Calendar, Clock, ArrowRight, Compass, Mountain, Heart, AlertCircle } from "lucide-react";
import { calculateReadingTime } from "@/lib/utils/public-posts";
import { SAMPLE_POSTS } from "@/lib/data/sample-posts";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{ destination?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { destination } = await searchParams;
  const configured = isSupabaseConfigured();
  let allPosts: any[] = [];

  if (configured) {
    try {
      const supabase = createAdminClient();
      let query = (supabase.from("slog_posts") as any)
        .select("*")
        .eq("published", true)
        .order("trip_date", { ascending: false });

      if (destination && destination !== "all") {
        query = query.ilike("location", `%${destination}%`);
      }

      const { data: posts, error } = await query;
      if (!error && posts && posts.length > 0) {
        allPosts = posts;
      }
    } catch (e) {
      console.warn("Could not fetch posts from Supabase, using sample posts:", e);
    }
  }

  // Fallback to sample posts if DB is unconfigured or empty
  if (allPosts.length === 0) {
    if (destination && destination !== "all") {
      allPosts = SAMPLE_POSTS.filter((p) =>
        p.location?.toLowerCase().includes(destination.toLowerCase())
      );
    } else {
      allPosts = SAMPLE_POSTS;
    }
  }

  const featuredPost = allPosts.find((p: any) => p.featured) || allPosts[0];
  const gridPosts = featuredPost
    ? allPosts.filter((p: any) => p.id !== featuredPost.id)
    : allPosts;

  const destinationOptions = [
    { label: "All Destinations", value: "" },
    { label: "Ljubljana", value: "Ljubljana" },
    { label: "Lake Bled", value: "Lake Bled" },
    { label: "Lake Bohinj", value: "Lake Bohinj" },
    { label: "Soča Valley", value: "Soča Valley" },
    { label: "Piran & Coast", value: "Piran" },
    { label: "Triglav National Park", value: "Triglav" },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Unconfigured Supabase Banner (shown only if env vars are missing) */}
      {!configured && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Displaying sample stories. To connect your live Supabase database, set <strong className="font-mono">NEXT_PUBLIC_SUPABASE_URL</strong> and <strong className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> in Vercel.
          </span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slovenia-canvas to-slovenia-canvas dark:from-slate-900/60 dark:via-[#0b111e] dark:to-[#0b111e] border-b border-slate-200/80 dark:border-slate-800/80 pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {/* Dragon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slovenia-blue/10 dark:bg-slovenia-blue/20 border border-slovenia-blue/20 dark:border-blue-400/30 text-slovenia-blue dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
            <Compass className="w-3.5 h-3.5" />
            Slovenia Travel Journal
          </div>

          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <div className="relative w-24 h-24 p-3 rounded-3xl bg-white dark:bg-slate-900 shadow-lg dark:shadow-[0_0_30px_rgba(0,93,164,0.35)] border border-slate-200/80 dark:border-slate-800 flex items-center justify-center hover:scale-105 transition-transform duration-300">
              <Image
                src="/brand/ljubljana-dragon.png"
                alt="Ljubljana Dragon Emblem"
                width={80}
                height={80}
                className="w-20 h-20 object-contain drop-shadow-sm"
                priority
              />
            </div>
            <h1 className="font-universa text-4xl sm:text-6xl font-normal text-slate-900 dark:text-white tracking-[0.06em] max-w-3xl uppercase leading-tight">
              Travels Across Slovenia
            </h1>
          </div>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Exploring the green heart of Europe — from the guardian dragons of Ljubljana and emerald alpine lakes to the turquoise Soča river and Venetian Adriatic coastlines.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 mt-10 pt-8 border-t border-slate-200/60 dark:border-slate-800/80 text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-slovenia-blue dark:text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Julian Alps & Triglav
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slovenia-green-leaf dark:text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Castles & Glacial Lakes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-slovenia-red dark:text-red-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                I feel SLOVEnia
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Filter Bar */}
      <section id="destinations" className="max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-universa text-lg font-normal text-slate-900 dark:text-white tracking-[0.06em] flex items-center gap-2 uppercase">
            <MapPin className="w-5 h-5 text-slovenia-green-leaf dark:text-emerald-400" />
            Explore by Destination
          </h2>
          {destination && (
            <Link
              href="/#stories"
              className="text-xs text-slovenia-blue dark:text-blue-400 font-medium hover:underline"
            >
              Clear filter
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {destinationOptions.map((opt) => {
            const isSelected = (!destination && !opt.value) || destination === opt.value;
            return (
              <Link
                key={opt.label}
                href={opt.value ? `/?destination=${encodeURIComponent(opt.value)}#stories` : "/#stories"}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isSelected
                    ? "bg-slovenia-blue text-white shadow-xs dark:shadow-[0_0_15px_rgba(0,93,164,0.4)]"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                }`}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stories Feed */}
      <section id="stories" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Featured Story Hero (if available and no destination filter is active) */}
        {!destination && featuredPost && (
          <div className="bg-white dark:bg-[#131d2e] border border-slate-200 dark:border-slate-800/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-md dark:shadow-none dark:hover:border-slate-700 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group">
            {/* Image */}
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px] bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {featuredPost.cover_image && (
                <Image
                  src={featuredPost.cover_image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  priority
                />
              )}
              {featuredPost.location && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-slovenia-green-leaf dark:text-emerald-400 font-semibold text-xs shadow-xs border border-transparent dark:border-slate-700/60 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slovenia-green-leaf dark:text-emerald-400" />
                  <span className="text-slate-900 dark:text-slate-100">{featuredPost.location}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slovenia-blue dark:text-blue-300 bg-slovenia-blue/10 dark:bg-slovenia-blue/20 px-2.5 py-0.5 rounded-full">
                    Featured Journey
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {featuredPost.trip_date}
                  </span>
                </div>

                <h2 className="font-sans text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-slovenia-blue dark:group-hover:text-blue-400 transition-colors leading-tight">
                  <Link href={`/posts/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>

                {featuredPost.excerpt && (
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {calculateReadingTime(featuredPost.content)}
                </span>

                <Link
                  href={`/posts/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slovenia-blue hover:bg-slovenia-blue-dark text-white font-medium text-xs shadow-xs transition-all"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stories Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-universa text-xl font-normal text-slate-900 dark:text-white tracking-[0.06em] uppercase">
              {destination ? `Stories from ${destination}` : "All Travel Stories"}
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-400">
              {allPosts.length} {allPosts.length === 1 ? "story" : "stories"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
