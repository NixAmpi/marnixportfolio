"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";

const TYPE_MS = 55;
const DELETE_MS = 30;
const HOLD_MS = 1800;

/**
 * Types through `roles` with a blinking caret. The first role renders in full on the
 * server, so there's no flash; the cycle begins after a pause. Screen readers get the
 * complete list once, as plain text, instead of the changing characters.
 */
export function RoleRotator({ roles }: { roles: readonly string[] }) {
  const reduced = useReducedMotion();
  const [text, setText] = useState(roles[0]);

  useEffect(() => {
    if (reduced || roles.length < 2) return;
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    let current = roles[0];

    const erase = () => {
      current = current.slice(0, -1);
      setText(current);
      if (current.length > 0) timer = setTimeout(erase, DELETE_MS);
      else {
        index = (index + 1) % roles.length;
        timer = setTimeout(type, 250);
      }
    };
    const type = () => {
      const full = roles[index];
      current = full.slice(0, current.length + 1);
      setText(current);
      timer = setTimeout(current === full ? erase : type, current === full ? HOLD_MS : TYPE_MS);
    };

    timer = setTimeout(erase, HOLD_MS + 1200);
    return () => clearTimeout(timer);
  }, [reduced, roles]);

  return (
    <>
      <span className="sr-only">{roles.join(", ")}</span>
      <span aria-hidden className="inline-flex min-h-[1.5em] items-center">
        {reduced ? roles[0] : text}
        {!reduced && <span className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[1px] bg-accent-cyan" />}
      </span>
    </>
  );
}
