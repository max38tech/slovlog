"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const unauthorizedEmail = searchParams.get("email");
  const next = searchParams.get("next") || "/admin";
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = `/api/auth/google/login?next=${encodeURIComponent(next)}`;
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 relative overflow-hidden">
      {/* Top Slovenian tricolor accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 slovenia-accent-bar" />

      <div className="flex flex-col items-center text-center mb-8 pt-2">
        <div className="relative w-20 h-20 mb-4 p-2 bg-slovenia-canvas rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center">
          <Image
            src="/brand/ljubljana-dragon.png"
            alt="Ljubljana Dragon"
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
            priority
          />
        </div>
        <h1 className="font-universa text-3xl font-normal text-slate-900 tracking-[0.08em] uppercase">
          slovlog CMS
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Slovenia Travel Journal Administration
        </p>
      </div>

      {error === "unauthorized" && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-left flex gap-3 items-start animate-fade-in">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-800 space-y-1">
            <p className="font-semibold text-red-900">Access Restricted</p>
            <p>
              {unauthorizedEmail ? (
                <>
                  The account <strong className="font-medium underline">{unauthorizedEmail}</strong> is not authorized to access this administration area.
                </>
              ) : (
                "Your Google account is not on the authorized administrators list."
              )}
            </p>
            <p className="text-red-700 pt-1">
              Please sign in with the authorized owner account (<span className="font-mono">shawn.shiobara@gmail.com</span>) or contact the owner.
            </p>
          </div>
        </div>
      )}

      {error === "missing_credentials" && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex gap-2 items-center">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          Google OAuth credentials (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) are missing from your environment.
        </div>
      )}

      {(error === "auth_failed" || error === "state_mismatch") && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex gap-2 items-center">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          Authentication failed or expired. Please try signing in again.
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-300 shadow-sm hover:shadow transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-slovenia-blue" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span className="group-hover:text-slate-900">Sign in with Google</span>
      </button>

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slovenia-blue transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to public blog (slovlog.com)
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100/70 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="text-slate-400">Loading sign-in...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
