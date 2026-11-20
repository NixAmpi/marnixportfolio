"use client";

import { useRef } from "react";
import { usePointerEffects } from "@/lib/hooks";

const MAX_DEG = 6;

/** A div that tilts up to MAX_DEG toward the pointer (desktop only) and resets on leave. Transform-only. */
export function TiltCard({ className, children }: { className?: string; children: React.ReactNode }) {
  const enabled = usePointerEffects();
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!enabled || !el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "transform 0.12s ease-out";
    el.style.transform = `perspective(900px) rotateX(${(-py * 2 * MAX_DEG).toFixed(2)}deg) rotateY(${(px * 2 * MAX_DEG).toFixed(2)}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transform = "";
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={className}>
      {children}
    </div>
  );
}
