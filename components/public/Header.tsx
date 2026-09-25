import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      {/* Slovenian Tricolor Accent Line */}
      <div className="h-1 slovenia-accent-bar w-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 p-1 rounded-xl bg-slovenia-canvas dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:border-slovenia-blue dark:group-hover:border-blue-400 transition-all flex items-center justify-center shadow-xs">
            <Image
              src="/brand/ljubljana-dragon.png"
              alt="Ljubljana Dragon"
              width={30}
              height={30}
              className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-universa text-2xl font-normal tracking-[0.08em] text-slovenia-blue dark:text-blue-400 group-hover:text-slovenia-blue-dark dark:group-hover:text-blue-300 transition-colors leading-none uppercase">
              slovlog
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wider uppercase mt-0.5">
              Slovenia Journal
            </span>
          </div>
        </Link>

        {/* Navigation Links & Actions */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slovenia-blue dark:hover:text-blue-400 transition-colors"
          >
            Stories
          </Link>
          <Link
            href="/#destinations"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slovenia-blue dark:hover:text-blue-400 transition-colors"
          >
            Destinations
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slovenia-blue dark:hover:text-blue-400 transition-colors"
          >
            About Trip
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            {/* Theme Toggle (System / Light / Dark) */}
            <ThemeToggle />

            {/* Admin CMS Lock */}
            <Link
              href="/admin"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Admin CMS Login"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
