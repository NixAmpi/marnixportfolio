"use client";

import { useEffect, useRef } from "react";
import { usePointerEffects } from "@/lib/hooks";

const INTERACTIVE = "a, button, [role='button'], summary, label, select, [data-cursor='hover']";
const TEXT_FIELD = "input, textarea, [contenteditable='true']";

/**
 * Desktop-only cursor: a dot that tracks the pointer exactly and a ring that trails it,
 * growing over links and buttons. Positions are written straight to `transform` from a
 * rAF loop, so moving the mouse never re-renders React. Text fields keep the native caret.
 */
export function Cursor() {
  const enabled = usePointerEffects();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const target = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;
    let visible = false;

    const setVisible = (v: boolean) => {
      if (v === visible) return;
      visible = v;
      dot.current?.classList.toggle("opacity-0", !v);
      ring.current?.classList.toggle("opacity-0", !v);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as Element | null;
      const inField = !!el?.closest?.(TEXT_FIELD);
      setVisible(!inField);
      ring.current?.classList.toggle("cursor-ring-hover", !inField && !!el?.closest?.(INTERACTIVE));
    };
    const onLeave = () => setVisible(false);
    const onDown = () => ring.current?.classList.add("cursor-ring-down");
    const onUp = () => ring.current?.classList.remove("cursor-ring-down");

    const tick = () => {
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      {/* Outer element is positioned by transform; inner element is centred and scaled. */}
      <div ref={ring} aria-hidden className="pointer-events-none fixed top-0 left-0 z-[80] opacity-0 transition-opacity duration-200">
        <div className="cursor-ring -mt-4 -ml-4 size-8 rounded-full border border-white/50 transition-[transform,border-color,background-color] duration-300 ease-out" />
      </div>
      <div ref={dot} aria-hidden className="pointer-events-none fixed top-0 left-0 z-[81] opacity-0 transition-opacity duration-200">
        <div className="-mt-[3px] -ml-[3px] size-1.5 rounded-full bg-accent-cyan" />
      </div>
    </>
  );
}
