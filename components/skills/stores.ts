"use client";

import { useSyncExternalStore } from "react";
import { canRun3D } from "@/lib/webgl";
import type { SoundProfile } from "./keySounds";

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

/**
 * A small localStorage-backed value shared across components. Falls back to memory when
 * storage is blocked (some private windows); the server always sees `fallback`.
 */
function persisted<T extends string>(key: string, fallback: T, valid: (v: string) => v is T) {
  const listeners = new Set<() => void>();
  let memory = fallback;
  const read = (): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null && valid(stored) ? stored : memory;
    } catch {
      return memory;
    }
  };
  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  };
  const write = (next: T) => {
    memory = next;
    try {
      localStorage.setItem(key, next);
    } catch {
      // storage unavailable: the value just won't persist
    }
    listeners.forEach((l) => l());
  };
  return () => [useSyncExternalStore(subscribe, read, () => fallback), write] as const;
}

const useSoundSetting = persisted("keyboard-sound", "off", (v): v is "on" | "off" => v === "on" || v === "off");

/** Key-click sound preference, persisted per visitor. Muted by default. */
export function useKeySound(): [boolean, (on: boolean) => void] {
  const [value, write] = useSoundSetting();
  return [value === "on", (on) => write(on ? "on" : "off")];
}

/** Which switch sound profile to play ("thocky" by default). */
export const useSoundProfile = persisted<SoundProfile>(
  "keyboard-sound-profile",
  "thocky",
  (v): v is SoundProfile => v === "thocky" || v === "clacky" || v === "clicky",
);
