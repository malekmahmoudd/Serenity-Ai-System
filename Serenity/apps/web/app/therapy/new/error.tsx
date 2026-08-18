"use client";

/**
 * Route-level error boundary for /therapy/new.
 *
 * Next.js wraps this automatically around the route segment -- any render-
 * time exception in therapy/new/page.tsx (or anything it imports) lands here
 * instead of a blank white screen or Next's default dev overlay.
 *
 * WHY THIS MATTERS MORE HERE THAN ELSEWHERE
 * -------------------------------------------
 * A crashed page is a bad experience anywhere. In this specific product, it
 * can happen mid-disclosure -- someone typing something difficult, hitting
 * enter, and the screen going blank. The reset button and the crisis number
 * below are not decoration; they are what stops that moment from being a
 * dead end.
 *
 * WHAT THIS DOES NOT COVER
 * ---------------------------
 * This only catches RENDER errors (thrown during React's render). A failed
 * fetch() inside an event handler -- e.g. sendMessageToBackend's network
 * call -- does not throw during render and will never reach this file. That
 * path already has its own try/catch with an inline fallback message (see
 * page.tsx). Both exist because they catch different failure classes.
 */

import { useEffect } from "react";

export default function TherapyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side equivalent of this lives in backend/main.py's global
    // exception handler. Client-side, this is the one place guaranteed to
    // see a render crash, so it is the one place to log it.
    console.error("[therapy/new] render error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-200">
        <h2 className="mb-3 text-lg font-semibold text-white">
          Something went wrong on our end
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-slate-400">
          This isn&apos;t anything you did. Your conversation is safe — nothing
          is lost by refreshing.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <button
            onClick={reset}
            className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="flex-1 rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            Go home
          </button>
        </div>

        {/*
          Not dismissible, not smaller text, same as the persistent footer on
          the chat page itself. If the app just broke, this may be the only
          thing on screen -- it has to work standing alone.
        */}
        <div className="mt-6 border-t border-slate-800 pt-5 text-xs leading-relaxed text-slate-500">
          If you need to talk to someone right now: ambulance{" "}
          <a href="tel:123" className="underline hover:text-slate-300">
            123
          </a>{" "}
          &middot; mental health support, free and 24/7:{" "}
          <a href="tel:16328" className="underline hover:text-slate-300">
            16328
          </a>
        </div>
      </div>
    </div>
  );
}
