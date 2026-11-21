"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { KeyTimes } from "../layout";
import { caseBottomAt, type CaseBox } from "./Case";

const ACCENTS = ["#7c5cff", "#4f8cff", "#22d3ee"].map((c) => new THREE.Color(c));
const CYCLE = 9; // seconds for purple → blue → cyan → back

/** The site's accent gradient at time t, ping-ponging purple → blue → cyan. */
export function accentAt(t: number, out: THREE.Color) {
  const phase = (Math.sin((t / CYCLE) * Math.PI * 2) + 1) / 2; // 0…1
  return phase < 0.5 ? out.lerpColors(ACCENTS[0], ACCENTS[1], phase * 2) : out.lerpColors(ACCENTS[1], ACCENTS[2], phase * 2 - 1);
}

/** How strongly the lights should pulse right now: 1 at the latest key press, decaying fast. */
export function pressPulse(times: KeyTimes, now: number) {
  let latest = -10;
  for (let i = 0; i < times.down.length; i++) latest = Math.max(latest, times.down[i]);
  const since = now - latest;
  return since >= 0 && since < 1 ? Math.exp(-since * 6) : 0;
}

/** Soft rounded-rectangle glow texture (white), made with the canvas shadow trick. */
function glowTexture() {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.shadowColor = "#fff";
  g.shadowBlur = 46;
  g.shadowOffsetX = size * 4; // draw the shape off-canvas so only its blur lands inside
  g.fillStyle = "#fff";
  const inset = 64;
  g.beginPath();
  g.roundRect(inset - size * 4, inset, size - inset * 2, size - inset * 2, 28);
  g.fill();
  const t = new THREE.CanvasTexture(c);
  return t;
}

/** Current underglow colour + press pulse, computed once per frame and shared by both pieces. */
function useGlow(keyTimes: React.RefObject<KeyTimes>, apply: (color: THREE.Color, pulse: number) => void) {
  const color = useMemo(() => new THREE.Color(), []);
  useFrame((state) => {
    accentAt(state.clock.elapsedTime, color);
    apply(color, pressPulse(keyTimes.current, performance.now() / 1000));
  });
}

/** Thin RGB light strip around the bottom edge of the case. Lives in deck space. */
export function UnderglowStrip({ box, keyTimes }: { box: CaseBox; keyTimes: React.RefObject<KeyTimes> }) {
  const strip = useMemo(() => {
    const bottomAt = caseBottomAt(box);
    const pad = 0.012;
    const r = 0.16;
    const [x0, x1, z0, z1] = [box.minX - pad, box.maxX + pad, box.minZ - pad, box.maxZ + pad];
    const corners: [number, number, number][] = [
      [x1 - r, z1 - r, 0],
      [x0 + r, z1 - r, Math.PI / 2],
      [x0 + r, z0 + r, Math.PI],
      [x1 - r, z0 + r, (3 * Math.PI) / 2],
    ];
    const pts: THREE.Vector3[] = [];
    for (const [cx, cz, a0] of corners) {
      for (let i = 0; i <= 6; i++) {
        const a = a0 + (i / 6) * (Math.PI / 2);
        const z = cz + Math.sin(a) * r;
        pts.push(new THREE.Vector3(cx + Math.cos(a) * r, bottomAt(z) + 0.05, z));
      }
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true, "centripetal"), 240, 0.016, 6, true);
  }, [box]);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useEffect(() => () => strip.dispose(), [strip]);
  useGlow(keyTimes, (color, pulse) => mat.current?.color.copy(color).multiplyScalar(1.2 + pulse * 1.3));
  return (
    <mesh geometry={strip}>
      <meshBasicMaterial ref={mat} toneMapped={false} />
    </mesh>
  );
}

/** Soft coloured light spilling onto the table under the case. Lives in the flat world frame. */
export function FloorGlow({ box, keyTimes, tableY }: { box: CaseBox; keyTimes: React.RefObject<KeyTimes>; tableY: number }) {
  const tex = useMemo(() => glowTexture(), []);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useEffect(() => () => tex.dispose(), [tex]);
  useGlow(keyTimes, (color, pulse) => {
    if (!mat.current) return;
    mat.current.color.copy(color);
    mat.current.opacity = 0.42 + pulse * 0.4;
  });
  return (
    <mesh position={[(box.minX + box.maxX) / 2, tableY + 0.01, (box.minZ + box.maxZ) / 2]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
      <planeGeometry args={[(box.maxX - box.minX) * 1.9, (box.maxZ - box.minZ) * 1.9]} />
      <meshBasicMaterial ref={mat} map={tex} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
