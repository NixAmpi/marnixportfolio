import * as THREE from "three";
import type { Skill } from "@/data/types";
import { inkFor } from "../keycaps";
import type { LayoutKey, ModifierId } from "../layout";
import { topAspect } from "./geometry";

/** Atlas: 8×4 grid of square cells for normal/wide keys, plus one wide strip for the spacebar. */
const CELL = 192;
const COLS = 8;
const W = CELL * COLS; // 1536
const GRID_ROWS = 4;
const SPACE = { x: 0, y: CELL * GRID_ROWS, w: CELL * 6, h: CELL };
const H = CELL * (GRID_ROWS + 1); // 960

const MOD_LABEL: Record<ModifierId, string> = { esc: "Esc", enter: "Enter ↵", shift: "⇧ Shift", space: "Marnix." };
export const MOD_COLOR = "#2a2d38";
const MOD_INK = "#c9cedb";

export type Legends = {
  texture: THREE.CanvasTexture;
  /** uv rect [u0, v0, su, sv] for each layout key, in layout order. */
  rects: [number, number, number, number][];
};

/**
 * Draws every keycap legend into one texture: skill logo + its shortcut letter (top-left,
 * like a real cap), modifier labels, and "Marnix." in the accent gradient on the spacebar.
 * Each drawing is horizontally compressed by the cap's top-face aspect so it maps undistorted.
 */
export function buildLegends(keys: LayoutKey[], skills: Skill[], logos: CanvasImageSource[]): Legends {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d")!;
  const rects: Legends["rects"] = [];
  let cell = 0;

  for (const key of keys) {
    const isSpace = key.mod === "space";
    const box = isSpace ? SPACE : { x: (cell % COLS) * CELL, y: Math.floor(cell / COLS) * CELL, w: CELL, h: CELL };
    if (!isSpace) cell++;
    rects.push([box.x / W, 1 - (box.y + box.h) / H, box.w / W, box.h / H]);

    // Work in a "true-shape" space: draw as if the region had the cap's real aspect.
    const aspect = topAspect(key.w);
    const sx = box.w / box.h / aspect;
    g.save();
    g.beginPath();
    g.rect(box.x, box.y, box.w, box.h);
    g.clip();
    g.translate(box.x + box.w / 2, box.y + box.h / 2);
    g.scale(sx, 1);
    const halfW = (box.h * aspect) / 2;
    const halfH = box.h / 2;

    if (key.skill !== null) {
      const skill = skills[key.skill];
      const ink = inkFor(skill.color);
      // Logo, tinted to the ink colour via an offscreen composite.
      const s = box.h * 0.5;
      const tmp = document.createElement("canvas");
      tmp.width = tmp.height = Math.ceil(s);
      const t = tmp.getContext("2d")!;
      t.drawImage(logos[key.skill], 0, 0, s, s);
      t.globalCompositeOperation = "source-in";
      t.fillStyle = ink;
      t.fillRect(0, 0, s, s);
      g.drawImage(tmp, -s / 2, -s / 2 + box.h * 0.06, s, s);
      // Shortcut letter, top-left.
      g.fillStyle = ink;
      g.globalAlpha = 0.85;
      g.font = `700 ${Math.round(box.h * 0.19)}px ui-sans-serif, system-ui, sans-serif`;
      g.textBaseline = "top";
      g.fillText(skill.key, -halfW + box.h * 0.1, -halfH + box.h * 0.08);
    } else if (isSpace) {
      const grad = g.createLinearGradient(-halfW * 0.5, 0, halfW * 0.5, 0);
      grad.addColorStop(0, "#9b82ff");
      grad.addColorStop(0.5, "#5b95ff");
      grad.addColorStop(1, "#22d3ee");
      g.fillStyle = grad;
      g.font = `800 ${Math.round(box.h * 0.42)}px ui-sans-serif, system-ui, sans-serif`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(MOD_LABEL.space, 0, box.h * 0.04);
    } else if (key.mod) {
      g.fillStyle = MOD_INK;
      g.font = `600 ${Math.round(box.h * 0.2)}px ui-sans-serif, system-ui, sans-serif`;
      g.textBaseline = "bottom";
      g.fillText(MOD_LABEL[key.mod], -halfW + box.h * 0.12, halfH - box.h * 0.12);
    }
    g.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return { texture, rects };
}
