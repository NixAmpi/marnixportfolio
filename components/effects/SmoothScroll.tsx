"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useReducedMotion } from "@/lib/hooks";

declare global {
  interface Window {
    /** The active Lenis instance, for components that scroll programmatically. */
    __lenis?: Lenis;
  }
}

/** Smoothly scrolls to `target` through Lenis when it's running, natively otherwise. */
export function scrollToTarget(target: number | string | HTMLElement) {
  if (window.__lenis) return window.__lenis.scrollTo(target);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top =
    typeof target === "number"
      ? target
      : ((typeof target === "string" ? document.querySelector<HTMLElement>(target) : target)?.offsetTop ?? 0);
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}

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
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      document.documentElement.classList.remove("has-lenis");
      delete window.__lenis;
    };
  }, [reduced]);

  return null;
}
