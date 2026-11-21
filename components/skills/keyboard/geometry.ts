import * as THREE from "three";

/** Size of 1u in world units. Caps are a little smaller so gaps show the switches. */
export const U = 1;
export const CAP = {
  gap: 0.14, // between neighbouring caps (wide enough to see the switches)
  height: 0.5, // base → top edge (before per-row sculpting)
  topInset: 0.11, // how much narrower the top is on each side (OEM taper)
  dish: 0.035, // depth of the cylindrical dish
  radiusBottom: 0.07,
  radiusTop: 0.12,
};

/** Points around a rounded rectangle (centre 0,0), counter-clockwise, `seg` points per corner. */
function roundedRect(w: number, d: number, r: number, seg = 6): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  const hw = w / 2 - r;
  const hd = d / 2 - r;
  const corners: [number, number, number][] = [
    [hw, hd, 0],
    [-hw, hd, Math.PI / 2],
    [-hw, -hd, Math.PI],
    [hw, -hd, (3 * Math.PI) / 2],
  ];
  for (const [cx, cz, a0] of corners) {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * (Math.PI / 2);
      pts.push(new THREE.Vector2(cx + Math.cos(a) * r, cz + Math.sin(a) * r));
    }
  }
  return pts;
}

/**
 * A lofted OEM-style keycap: wide rounded base tapering to a smaller, rounder top with a
 * cylindrical dish (deepest along the middle, left↔right). Base sits at y=0, top edge at
 * y=CAP.height. Attributes: `uv` maps the top face 0…1 (for the legend atlas) and `aTop`
 * is 1 on the top face, 0 on the walls.
 */
export function keycapGeometry(widthU: number): THREE.BufferGeometry {
  const wB = widthU * U - CAP.gap;
  const dB = U - CAP.gap;
  const wT = wB - CAP.topInset * 2;
  const dT = dB - CAP.topInset * 2;
  const levels = 5;
  const ringBase = roundedRect(wB, dB, CAP.radiusBottom).length;

  const pos: number[] = [];
  const uv: number[] = [];
  const top: number[] = [];
  const index: number[] = [];

  const dishY = (x: number) => CAP.height - CAP.dish * (1 - Math.min(1, (x / (wT / 2)) ** 2));

  // Walls: rings from base to top edge, slightly convex (eased taper).
  for (let l = 0; l < levels; l++) {
    const t = l / (levels - 1);
    const e = 1 - (1 - t) ** 1.6; // bulge outward low on the wall
    const ring = roundedRect(
      THREE.MathUtils.lerp(wB, wT, e),
      THREE.MathUtils.lerp(dB, dT, e),
      THREE.MathUtils.lerp(CAP.radiusBottom, CAP.radiusTop, t),
    );
    for (const p of ring) {
      pos.push(p.x, t * CAP.height, p.y);
      uv.push(0, 0);
      top.push(0);
    }
  }
  for (let l = 0; l < levels - 1; l++) {
    for (let i = 0; i < ringBase; i++) {
      const a = l * ringBase + i;
      const b = l * ringBase + ((i + 1) % ringBase);
      const c = a + ringBase;
      const d = b + ringBase;
      index.push(a, c, b, b, c, d);
    }
  }

  // Top: concentric scaled copies of the top outline down to the centre, following the dish.
  const topStart = pos.length / 3;
  const outline = roundedRect(wT, dT, CAP.radiusTop);
  const steps = 4;
  for (let s = 0; s < steps; s++) {
    const k = 1 - s / steps;
    for (const p of outline) {
      const x = p.x * k;
      const z = p.y * k;
      pos.push(x, dishY(x), z);
      uv.push(x / wT + 0.5, 0.5 - z / dT);
      top.push(1);
    }
  }
  const centre = pos.length / 3;
  pos.push(0, dishY(0), 0);
  uv.push(0.5, 0.5);
  top.push(1);
  for (let s = 0; s < steps - 1; s++) {
    for (let i = 0; i < ringBase; i++) {
      const a = topStart + s * ringBase + i;
      const b = topStart + s * ringBase + ((i + 1) % ringBase);
      const c = a + ringBase;
      const d = b + ringBase;
      index.push(a, c, b, b, c, d);
    }
  }
  const inner = topStart + (steps - 1) * ringBase;
  for (let i = 0; i < ringBase; i++) index.push(inner + i, centre, inner + ((i + 1) % ringBase));

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  // Separate copy for the legend shader (three only declares `uv` when a map needs it).
  g.setAttribute("aLegUv", new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute("aTop", new THREE.Float32BufferAttribute(top, 1));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

/** Aspect (width / depth) of a cap's top face, so legends can be drawn undistorted. */
export const topAspect = (widthU: number) =>
  (widthU * U - CAP.gap - CAP.topInset * 2) / (U - CAP.gap - CAP.topInset * 2);

/** A tiny tiling normal map of fine noise — the grain of matte PBT plastic. */
export function pbtNormalMap(): THREE.DataTexture {
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  let seed = 7;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < size * size; i++) {
    data[i * 4] = 128 + (rand() - 0.5) * 70;
    data[i * 4 + 1] = 128 + (rand() - 0.5) * 70;
    data[i * 4 + 2] = 255;
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.needsUpdate = true;
  return tex;
}
