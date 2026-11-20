"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FramedShot, frameBox, screenshotBackdrop, type FrameKind } from "@/components/ScreenshotFrame";

type Shot = { src: string; alt: string; caption?: string };

/** Shortest signed distance from the active slide, wrapping around the ends. */
function offsetOf(i: number, active: number, n: number) {
  let d = i - active;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

// How far neighbours sit from centre (as % of their own width), how much they shrink,
// and where frames are anchored. Phones rise from the bottom; browser windows are centred.
const layout: Record<FrameKind, { step: number; scales: [number, number]; position: string; box: string }> = {
  phone: { step: 64, scales: [0.84, 0.7], position: "bottom-[-1rem] origin-bottom", box: "aspect-[4/5] sm:aspect-[16/9]" },
  // -mt-[19%] ≈ half the frame height (80% width ÷ 2.19 + chrome bar), as a % of width.
  browser: { step: 74, scales: [0.82, 0.68], position: "top-1/2 -mt-[19%] origin-center", box: "aspect-[16/10] sm:aspect-[16/9]" },
};

/**
 * Coverflow-style carousel of framed screenshots: the active screen is centred and
 * full size, neighbours peek in smaller and dimmed at the sides. Arrows, dots, swipe,
 * arrow keys, or clicking a side screen all navigate.
 */
export function ScreenshotCarousel({ shots, title, frame }: { shots: Shot[]; title: string; frame: FrameKind }) {
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);
  const n = shots.length;
  const go = (i: number) => setActive(((i % n) + n) % n);
  const L = layout[frame];

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(active - 1);
        if (e.key === "ArrowRight") go(active + 1);
      }}
      className="mt-10"
    >
      <div
        className={`glass relative touch-pan-y overflow-hidden ${L.box} ${screenshotBackdrop}`}
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
        }}
      >
        {shots.map((shot, i) => {
          const d = offsetOf(i, active, n);
          const far = Math.abs(d) > 2;
          const scale = d === 0 ? 1 : L.scales[Math.abs(d) === 1 ? 0 : 1];
          return (
            <button
              key={shot.src}
              type="button"
              tabIndex={Math.abs(d) === 1 ? 0 : -1}
              aria-hidden={Math.abs(d) > 1}
              aria-label={d === 0 ? undefined : `Show ${shot.caption ?? `screenshot ${i + 1}`}`}
              onClick={() => d !== 0 && go(i)}
              disabled={far}
              style={{
                transform: `translateX(calc(-50% + ${d * L.step}%)) scale(${scale})`,
                zIndex: 10 - Math.abs(d),
                // Side frames stay opaque (no see-through layering) and are dimmed instead.
                opacity: far ? 0 : 1,
                filter: d === 0 ? "none" : `brightness(${Math.abs(d) === 1 ? 0.55 : 0.35})`,
              }}
              className={`absolute left-1/2 block overflow-hidden border-white/15 bg-white text-left shadow-2xl shadow-black/60 transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${frameBox[frame]} ${L.position} ${
                d === 0 ? "cursor-default" : "cursor-pointer"
              } ${far ? "pointer-events-none" : ""}`}
            >
              <span className={frame === "phone" ? "absolute inset-0" : "block"}>
                <FramedShot
                  kind={frame}
                  src={shot.src}
                  alt={d === 0 ? shot.alt : ""}
                  sizes={frame === "phone" ? "(min-width: 640px) 270px, 50vw" : "(min-width: 1024px) 800px, 80vw"}
                  preload={i === 0}
                />
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => go(active - 1)}
          aria-label="Previous screenshot"
          className="absolute top-1/2 left-3 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-950/70 text-white backdrop-blur transition hover:bg-ink-950 sm:left-5"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label="Next screenshot"
          className="absolute top-1/2 right-3 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-950/70 text-white backdrop-blur transition hover:bg-ink-950 sm:right-5"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        <p aria-live="polite" className="text-sm font-semibold text-white">
          {shots[active].caption}
          <span className="ml-2 font-normal text-muted">
            {active + 1} / {n}
          </span>
        </p>
        <div className="flex gap-2">
          {shots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${shot.caption ?? `screenshot ${i + 1}`}`}
              aria-current={i === active ? "true" : undefined}
              className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-accent-gradient" : "w-2 bg-white/25 hover:bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
