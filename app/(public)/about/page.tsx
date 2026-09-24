import Link from "next/link";
import Image from "next/image";
import { MapPin, Compass, ArrowLeft, Heart, Mountain, Sparkles, Navigation } from "lucide-react";

export const metadata = {
  title: "About the Slovenia Journey",
  description: "Itinerary, route, and memories from traveling across Slovenia.",
};

export default function AboutPage() {
  const itineraryStops = [
    {
      stop: "01",
      destination: "Ljubljana",
      title: "The Dragon City & Plečnik's Masterpieces",
      description: "Exploring the Dragon Bridge (Zmajski most), the Triple Bridge, Tivoli park, and the funicular ride up to Ljubljana Castle overlooking red baroque roofs.",
      tag: "Capital & Culture",
    },
    {
      stop: "02",
      destination: "Lake Bled & Lake Bohinj",
      title: "Alpine Glacial Lakes & Triglav National Park",
      description: "Rowing traditional wooden pletna boats to the island church of Lake Bled, eating Bled cream cake (kremna rezina), and hiking the pristine wild shores of Lake Bohinj.",
      tag: "Alpine Lakes",
    },
    {
      stop: "03",
      destination: "Vršič Pass & Soča Valley",
      title: "50 Hairpin Turns to Emerald Waters",
      description: "Driving across the historic 1,611m mountain pass in the Julian Alps, plunging into the surreal emerald-turquoise waters of the glacial Soča river.",
      tag: "Mountain Pass",
    },
    {
      stop: "04",
      destination: "Postojna & Škocjan Caves",
      title: "Subterranean Karst Canyons",
      description: "Descending into UNESCO-protected underground river gorges and soaring stalactite caverns carved through Slovenian limestone.",
      tag: "Karst Underworld",
    },
    {
      stop: "05",
      destination: "Piran & the Adriatic Coast",
      title: "Venetian Bells & Coastal Sunsets",
      description: "Walking cobblestone alleys of medieval Piran, climbing Saint George's belltower overlooking the Gulf of Trieste, and tasting fresh seafood on Tartini Square.",
      tag: "Adriatic Sea",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slovenia-blue transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to all stories
        </Link>
      </div>

      {/* Hero */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slovenia-green/10 text-slovenia-green text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-slovenia-green-leaf" />
          The Itinerary & Story
        </div>
        <h1 className="font-universa text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          About slovlog
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
          This blog documents our journey across Slovenia — a compact European jewel where towering limestone peaks, subterranean karst caves, lush wine regions, and the Adriatic sea sit just hours apart.
        </p>
      </div>

      {/* Dragon Emblem callout */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
        <div className="w-20 h-20 rounded-2xl bg-slovenia-canvas border border-slate-100 p-2 shrink-0 flex items-center justify-center">
          <Image
            src="/brand/ljubljana-dragon.png"
            alt="Ljubljana Dragon"
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-universa text-xl font-bold text-slate-900">
            Why the Dragon?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            According to Greek myth, Jason and the Argonauts fled across the Danube and Sava rivers to Ljubljana, slaying a fierce dragon in the marshlands. Today, the dragon is the proud symbol of Ljubljana — guarding the bridges and representing courage, protection, and Slovenian resilience.
          </p>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-slovenia-blue" />
          <h2 className="font-universa text-2xl font-bold text-slate-900">
            Our Travel Route
          </h2>
        </div>

        <div className="space-y-4">
          {itineraryStops.map((stop) => (
            <div
              key={stop.stop}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-slovenia-blue/40 transition-colors flex flex-col sm:flex-row gap-5"
            >
              <div className="flex items-center sm:items-start gap-3 shrink-0">
                <span className="font-universa text-2xl font-black text-slovenia-blue/30 sm:w-10">
                  {stop.stop}
                </span>
                <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slovenia-blue/10 text-slovenia-blue sm:hidden">
                  {stop.tag}
                </span>
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-universa text-lg font-bold text-slate-900">
                    {stop.destination}
                  </h3>
                  <span className="hidden sm:inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slovenia-blue/10 text-slovenia-blue">
                    {stop.tag}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-700">{stop.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{stop.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slovenia Travel Tips */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-1.5 slovenia-accent-bar w-full" />
        <h3 className="font-universa text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-slovenia-green-leaf" />
          Slovenia Travel Takeaways
        </h3>
        <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed list-disc list-inside">
          <li><strong>Eco-conscious:</strong> Ljubljana was named Europe&apos;s Green Capital and over 60% of the entire country is blanketed in protected forest.</li>
          <li><strong>Vignette reminder:</strong> Driving on Slovenian motorways requires an electronic vignette (e-vinjeta) purchased online before driving.</li>
          <li><strong>Tap water:</strong> Slovenia has some of the purest, tastiest mountain drinking water in the world — free fountains are everywhere.</li>
        </ul>
      </div>
    </div>
  );
}
