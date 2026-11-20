"use client";

import { useRef } from "react";
import { usePointerEffects } from "@/lib/hooks";

const MAX = 6; // px

/**
 * Nudges its child up to MAX px toward the pointer and springs back on leave.
 * Desktop pointers only; writes `transform` directly, so it never re-renders.
 */
export function Magnetic({ children }: { children: React.ReactNode }) {
  const enabled = usePointerEffects();
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!enabled || !el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    el.style.transition = "transform 0.15s ease-out";
    el.style.transform = `translate3d(${dx * MAX}px, ${dy * MAX}px, 0)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.style.transform = "";
  };

  return (
    <span ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="inline-flex">
      {children}
    </span>
  );
}
