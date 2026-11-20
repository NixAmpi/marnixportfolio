"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { REDUCED_MOTION, useReducedMotion } from "@/lib/hooks";

/**
 * Counts a stat like "5" or "6+" up from 0 the first time it scrolls into view.
 * The server renders the final value; the client resets it to 0 only while it's
 * still off-screen, then writes each frame straight into the text node.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : NaN;
  const suffix = match ? match[2] : "";
  const primed = useRef(false);

  // Prime to 0 before it's seen (skipped if already visible, reduced motion, or non-numeric).
  // The media query is read directly: on the first client pass the hook still reports the
  // server value (false), and priming then would leave reduced-motion users looking at "0".
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || Number.isNaN(target) || primed.current) return;
    if (window.matchMedia(REDUCED_MOTION).matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;
    primed.current = true;
    el.textContent = `0${suffix}`;
  }, [reduced, target, suffix]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || !primed.current) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (el.textContent = `${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, target, suffix]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {value}
    </span>
  );
}
