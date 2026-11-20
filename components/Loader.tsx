"use client";

import { useEffect } from "react";
import { profile } from "@/data/profile";

/**
 * Pure-CSS intro: the bar fills and the overlay fades by ~1.3s without waiting on JS.
 * An inline script in the layout hides it on repeat visits within the session.
 */
export function Loader() {
  useEffect(() => {
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      // storage unavailable (private mode) — the intro just plays again
    }
  }, []);

  return (
    <div
      aria-hidden
      className="intro-loader pointer-events-none fixed inset-0 z-[90] flex flex-col items-center justify-center gap-5 bg-ink-950"
    >
      <span className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {profile.shortName}
        <span className="text-gradient">.</span>
      </span>
      <span className="h-[3px] w-40 overflow-hidden rounded-full bg-white/10">
        <span className="intro-loader-bar block h-full w-full rounded-full bg-accent-gradient" />
      </span>
    </div>
  );
}
