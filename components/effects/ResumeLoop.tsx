"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Switching a <Canvas> from frameloop "never" to "always" doesn't restart React Three
 * Fiber's render loop on its own; it waits for an invalidate(). Place inside the Canvas
 * and pass the same `active` flag so a paused scene resumes when it comes back on screen.
 */
export function ResumeLoop({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);
  return null;
}
