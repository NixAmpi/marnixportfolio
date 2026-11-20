"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

const Lanyard = dynamic(() => import("./Lanyard"), { ssr: false });

type Mode = "static" | "3d";

function canRun3D(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if ((nav.deviceMemory ?? 8) < 4 || (nav.hardwareConcurrency ?? 8) < 4) return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Shows a static hanging card immediately (no layout shift), then — on capable
 * devices, after the first interaction — swaps in the physics lanyard on top of it.
 */
export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("static");
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (!canRun3D()) return;
    const mq = window.matchMedia("(max-width: 1023px)");
    const onChange = () => setCompact(mq.matches);
    mq.addEventListener("change", onChange);

    // The three.js + physics chunks are ~3 MB, so they only load once the visitor
    // interacts. Until then the static card (same framing) stands in, keeping
    // first load light and blocking time near zero.
    const events = ["pointermove", "pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;
    const start = () => {
      events.forEach((ev) => window.removeEventListener(ev, start));
      setCompact(mq.matches);
      setMode("3d");
    };
    events.forEach((ev) => window.addEventListener(ev, start, { once: true, passive: true }));

    return () => {
      mq.removeEventListener("change", onChange);
      events.forEach((ev) => window.removeEventListener(ev, start));
    };
  }, []);

  // Pause the render loop and physics while the hero is scrolled out of view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <StaticCard hidden={ready} />
      {mode === "3d" && (
        <div className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
          <Lanyard key={compact ? "compact" : "desktop"} compact={compact} active={visible} onReady={handleReady} />
        </div>
      )}
      <p className="sr-only">ID card for {profile.name}, {profile.role}.</p>
    </div>
  );
}

/** Same framing as the 3D card: strap from the top edge, card hanging mid-frame. */
function StaticCard({ hidden }: { hidden: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      <div className="absolute top-[40%] left-1/2 h-[48%] -translate-x-1/2 lg:top-[46%] lg:h-[33%]">
        <span className="absolute bottom-[96%] left-1/2 h-[200vh] w-3 -translate-x-1/2 rounded-sm bg-[#0e0e12] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]" />
        <span className="absolute -top-[5%] left-1/2 h-[7%] w-[16%] -translate-x-1/2 rounded-md bg-gradient-to-b from-slate-200 to-slate-400" />
        <Image
          src="/lanyard/card.png"
          alt=""
          width={800}
          height={1125}
          fetchPriority="high"
          sizes="(min-width: 1024px) 300px, 240px"
          className="relative h-full w-auto origin-top rotate-[4deg] rounded-xl shadow-2xl shadow-black/60"
        />
      </div>
    </div>
  );
}
