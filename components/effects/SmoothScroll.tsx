"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useReducedMotion } from "@/lib/hooks";

/** Lenis smooth scrolling; skipped entirely when the user prefers reduced motion. */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: true,
      // Same-page "#section" links glide instead of jumping. Lenis honours each section's
      // scroll-margin-top (set in globals.css), which already clears the fixed navbar.
      anchors: true,
      stopInertiaOnNavigate: true,
    });
    document.documentElement.classList.add("has-lenis");
    return () => {
      lenis.destroy();
      document.documentElement.classList.remove("has-lenis");
    };
  }, [reduced]);

  return null;
}
