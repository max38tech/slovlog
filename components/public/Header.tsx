import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      {/* Slovenian Tricolor Accent Line */}
      <div className="h-1 slovenia-accent-bar w-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 p-1 rounded-xl bg-slovenia-canvas border border-slate-200 group-hover:border-slovenia-blue transition-colors flex items-center justify-center">
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
            <span className="font-universa text-2xl font-normal tracking-[0.08em] text-slovenia-blue group-hover:text-slovenia-blue-dark transition-colors leading-none uppercase">
              slovlog
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              Slovenia Journal
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-slate-700 hover:text-slovenia-blue transition-colors"
          >
            Stories
          </Link>
          <Link
            href="/#destinations"
            className="text-sm font-medium text-slate-700 hover:text-slovenia-blue transition-colors"
          >
            Destinations
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-slate-700 hover:text-slovenia-blue transition-colors"
          >
            About Trip
          </Link>
          <Link
            href="/admin"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Admin CMS Login"
          >
            <Lock className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
