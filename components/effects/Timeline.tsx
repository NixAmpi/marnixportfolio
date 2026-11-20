"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";

/** The timeline <ol>; its glowing line draws itself (scaleY) as the list scrolls through view. */
export function TimelineTrack({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <ol ref={ref} className={className}>
      <motion.span
        aria-hidden
        style={{ scaleY: reduced ? 1 : progress }}
        className="absolute top-2 bottom-2 -left-px w-px origin-top bg-gradient-to-b from-accent-violet via-accent-blue to-transparent shadow-[0_0_12px_rgba(124,92,255,0.7)]"
      />
      {children}
    </ol>
  );
}

/** Timeline marker; a soft ring pulses (transform + opacity) while its entry is on screen. */
export function TimelineDot() {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 1, margin: "-10% 0px -20% 0px" });

  return (
    <span
      ref={ref}
      aria-hidden
      className={`timeline-dot absolute top-6 -left-[7px] size-3.5 rounded-full border-2 border-accent-violet bg-ink-950 shadow-[0_0_0_4px_rgba(124,92,255,0.15),0_0_14px_rgba(124,92,255,0.8)] ${inView ? "is-live" : ""}`}
    />
  );
}
