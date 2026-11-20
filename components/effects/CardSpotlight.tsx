"use client";

import { useEffect } from "react";
import { usePointerEffects } from "@/lib/hooks";

/**
 * One window listener drives the spotlight for every `.fx-card`: it writes the pointer
 * position (relative to the hovered card) into --mx/--my, which only feed the glow's
 * `transform` in globals.css. Desktop pointers only.
 */
export function CardSpotlight() {
  const enabled = usePointerEffects();

  useEffect(() => {
    if (!enabled) return;
    let active: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(".fx-card") ?? null;
      if (card !== active) {
        active?.classList.remove("fx-on");
        active = card;
        card?.classList.add("fx-on");
      }
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const onLeave = () => {
      active?.classList.remove("fx-on");
      active = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, [enabled]);

  return null;
}
