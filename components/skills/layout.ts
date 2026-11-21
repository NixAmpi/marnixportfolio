/**
 * Physical layout of the 3D keyboard: which key sits where, in key units ("u", 1u = one
 * standard key). Skill keys follow the order of data/skills.ts; modifier keys (Esc, Enter,
 * Shift, Space) are decoration that press and sound but aren't skills.
 */
import { skills } from "@/data/skills";
import type { KeyKind } from "./keySounds";

export type ModifierId = "esc" | "enter" | "shift" | "space";
export const MODIFIERS: ModifierId[] = ["esc", "enter", "shift", "space"];

export type LayoutKey = {
  /** Index into the shared key-time arrays: skills first, then modifiers. */
  slot: number;
  /** Skill index, or null for a modifier. */
  skill: number | null;
  mod: ModifierId | null;
  /** Width in u (1, 1.5, 2, 3.5…). */
  w: number;
  /** Row from the back (0) to the front. */
  row: number;
  /** Centre of the key in u, measured from the board's left edge. */
  x: number;
  /** Which sound family this key uses. */
  sound: KeyKind;
};

export type Layout = { keys: LayoutKey[]; cols: number; rows: number };

/** Slot for a modifier in the key-time arrays (after all skills). */
export const modSlot = (m: ModifierId) => skills.length + MODIFIERS.indexOf(m);
export const SLOT_COUNT = skills.length + MODIFIERS.length;

type Cell = number | ModifierId | [ModifierId, number];

// Desktop: 7.5u wide; the spacebar sits dead centre on the bottom row.
//   [Esc 1.5][P][J][T][Q][H][C]
//   [R][W][F][N][E][M][Enter 1.5]
//   [Shift 1.5][B][G][V][I][L][K]
//   [O][Y][   Space 3.5   ][U][A]
const DESKTOP: Cell[][] = [
  [["esc", 1.5], 0, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, ["enter", 1.5]],
  [["shift", 1.5], 12, 13, 14, 15, 16, 17],
  [18, 19, ["space", 3.5], 20, 21],
];

// Phones: 5u wide, no Enter/Shift.
const COMPACT: Cell[][] = [
  ["esc", 0, 1, 2, 3],
  [4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18],
  [19, ["space", 2], 20, 21],
];

const SOUND_FOR: Record<ModifierId, KeyKind> = { esc: "key", enter: "large", shift: "large", space: "space" };

function build(rows: Cell[][]): Layout {
  const keys: LayoutKey[] = [];
  let cols = 0;
  rows.forEach((row, r) => {
    let x = 0;
    for (const cell of row) {
      const [id, w] = Array.isArray(cell) ? cell : [cell, 1];
      const mod = typeof id === "string" ? id : null;
      keys.push({
        slot: mod ? modSlot(mod) : (id as number),
        skill: mod ? null : (id as number),
        mod,
        w,
        row: r,
        x: x + w / 2,
        sound: mod ? SOUND_FOR[mod] : "key",
      });
      x += w;
    }
    cols = Math.max(cols, x);
  });
  return { keys, cols, rows: rows.length };
}

export const LAYOUTS = { desktop: build(DESKTOP), compact: build(COMPACT) };

/** Stereo position (-1 left … 1 right) of a slot in the given layout. */
export function panForSlot(slot: number, compact: boolean): number {
  const layout = compact ? LAYOUTS.compact : LAYOUTS.desktop;
  const key = layout.keys.find((k) => k.slot === slot);
  return key ? (key.x / layout.cols) * 2 - 1 : 0;
}

/** Shared press/release timestamps (seconds, performance.now()/1000) for every slot. */
export type KeyTimes = { down: Float64Array; up: Float64Array };
export const createKeyTimes = (): KeyTimes => ({
  down: new Float64Array(SLOT_COUNT).fill(-10),
  up: new Float64Array(SLOT_COUNT).fill(-10),
});
