"use client";

import { useSyncExternalStore } from "react";
import { canRun3D } from "@/lib/webgl";

const noop = () => () => {};

let capable: boolean | null = null;
/** Whether to show the 3D keyboard. Server render (and first hydration pass) says no. */
export function use3DCapable(): boolean {
  return useSyncExternalStore(
    noop,
    () => (capable ??= canRun3D()),
    () => false,
  );
}

const SOUND_KEY = "keyboard-sound";
const listeners = new Set<() => void>();
let memory = false; // fallback when storage is blocked (some private windows)

function readSound(): boolean {
  try {
    const stored = localStorage.getItem(SOUND_KEY);
    return stored === null ? memory : stored === "on";
  } catch {
    return memory;
  }
}

/** Key-click sound preference, persisted per visitor. Muted by default. */
export function useKeySound(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    readSound,
    () => false,
  );
  const set = (next: boolean) => {
    memory = next;
    try {
      localStorage.setItem(SOUND_KEY, next ? "on" : "off");
    } catch {
      // storage unavailable: preference just won't persist
    }
    listeners.forEach((l) => l());
  };
  return [on, set];
}
