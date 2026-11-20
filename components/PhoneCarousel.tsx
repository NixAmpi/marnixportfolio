"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Shot = { src: string; alt: string; caption?: string };

const backdrop =
  "bg-[radial-gradient(circle_at_25%_20%,rgba(124,92,255,0.35),transparent_50%),radial-gradient(circle_at_80%_85%,rgba(34,211,238,0.22),transparent_50%),linear-gradient(150deg,#141634,#0a0b1e)]";

/** Shortest signed distance from the active slide, wrapping around the ends. */
function offsetOf(i: number, active: number, n: number) {
  let d = i - active;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

/**
 * Coverflow-style carousel of phone screenshots: the active screen is centred and
 * full size, neighbours peek in smaller at the sides. Arrows, dots, swipe, arrow keys,
 * or clicking a side phone all navigate.
 */
export function PhoneCarousel({ shots, title }: { shots: Shot[]; title: string }) {
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);
  const n = shots.length;
  const go = (i: number) => setActive(((i % n) + n) % n);

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
        className={`glass relative aspect-[4/5] touch-pan-y overflow-hidden sm:aspect-[16/9] ${backdrop}`}
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
          const scale = d === 0 ? 1 : Math.abs(d) === 1 ? 0.84 : 0.7;
          return (
            <button
              key={shot.src}
              type="button"
              tabIndex={Math.abs(d) === 1 ? 0 : -1}
              aria-hidden={d !== 0 && Math.abs(d) > 1}
              aria-label={d === 0 ? undefined : `Show ${shot.caption ?? `screenshot ${i + 1}`}`}
              onClick={() => d !== 0 && go(i)}
              disabled={far}
              style={{
                transform: `translateX(calc(-50% + ${d * 64}%)) scale(${scale})`,
                zIndex: 10 - Math.abs(d),
                // Side phones stay opaque (no see-through layering) and are dimmed instead.
                opacity: far ? 0 : 1,
                filter: d === 0 ? "none" : `brightness(${Math.abs(d) === 1 ? 0.55 : 0.35})`,
              }}
              className={`absolute bottom-[-1rem] left-1/2 aspect-[640/1303] h-[88%] origin-bottom overflow-hidden rounded-[1.1rem] border-[3px] border-white/15 bg-white shadow-2xl shadow-black/60 transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                d === 0 ? "cursor-default" : "cursor-pointer"
              } ${far ? "pointer-events-none" : ""}`}
            >
              <Image
                src={shot.src}
                alt={d === 0 ? shot.alt : ""}
                fill
                sizes="(min-width: 640px) 270px, 50vw"
                loading={i === 0 ? "eager" : undefined}
                fetchPriority={i === 0 ? "high" : undefined}
                className="object-cover object-top"
              />
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
