import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-slovenia-canvas">
      <div className="flex items-center gap-4 mb-6">
        <Image
          src="/brand/ljubljana-dragon.png"
          alt="Ljubljana Dragon"
          width={64}
          height={64}
          className="w-16 h-16 object-contain"
          priority
        />
        <h1 className="font-universa text-5xl font-bold text-slovenia-blue tracking-tight">
          slovlog
        </h1>
      </div>
      <p className="text-lg text-slate-600 font-sans max-w-md text-center">
        A journey through the green heart of Europe.
      </p>
    </main>
  );
}
