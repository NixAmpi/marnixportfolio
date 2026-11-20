"use client";

import { useSyncExternalStore } from "react";

/** Subscribes to a CSS media query. Server render (and first hydration) assumes `false`. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** A mouse or trackpad: hover-capable with a precise pointer. False on touch devices. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export const useReducedMotion = () => useMediaQuery(REDUCED_MOTION);

/** True only where pointer effects (cursor, tilt, magnetic, spotlight) make sense. */
export function usePointerEffects(): boolean {
  const fine = useMediaQuery(FINE_POINTER);
  const reduced = useMediaQuery(REDUCED_MOTION);
  return fine && !reduced;
}
