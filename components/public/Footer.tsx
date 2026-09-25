import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Lock } from "lucide-react";

export function Footer() {
  const destinations = [
    { name: "Ljubljana", slug: "ljubljana" },
    { name: "Lake Bled", slug: "lake-bled" },
    { name: "Lake Bohinj", slug: "lake-bohinj" },
    { name: "Soča Valley", slug: "soca-valley" },
    { name: "Piran & Coast", slug: "piran" },
    { name: "Triglav National Park", slug: "triglav" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Top subtle tricolor accent */}
      <div className="h-1 slovenia-accent-bar w-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 p-1 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <Image
                  src="/brand/ljubljana-dragon.png"
                  alt="Ljubljana Dragon"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <span className="font-universa text-2xl font-normal tracking-[0.08em] text-white uppercase">
                  slovlog
                </span>
                <p className="text-xs text-slate-400">Slovenia Travel Journal</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Documenting a journey across the green heart of Europe — from the guardian dragons of Ljubljana and emerald alpine lakes to the turquoise Soča river and Venetian Adriatic shores.
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slovenia-green/20 text-slovenia-green-leaf border border-slovenia-green/30">
              <Heart className="w-3.5 h-3.5 fill-current" />
              I feel SLOVEnia
            </div>
          </div>

          {/* Col 2: Destinations */}
          <div>
            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-3">
              Destinations
            </h4>
            <ul className="space-y-2 text-xs">
              {destinations.map((d) => (
                <li key={d.name}>
                  <Link
                    href={`/?destination=${encodeURIComponent(d.name)}#stories`}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3 text-slovenia-green-leaf" />
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                  Travel Stories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                  About the Journey
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  Admin CMS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} slovlog.com. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Powered by Next.js, Vercel & Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
