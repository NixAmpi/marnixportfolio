"use client";

/*
 * The Skills section's mechanical keyboard. Loaded with next/dynamic (ssr: false) only once
 * the section nears the viewport; paused (frameloop "never") whenever it's off-screen.
 */

import * as THREE from "three";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useTexture } from "@react-three/drei";
import { ResumeLoop } from "@/components/effects/ResumeLoop";
import type { Skill } from "@/data/types";
import type { SoundProfile } from "./keySounds";
import { LAYOUTS, type KeyTimes, type LayoutKey } from "./layout";
import { U, keycapGeometry } from "./keyboard/geometry";
import { buildLegends, MOD_COLOR } from "./keyboard/legends";
import { keycapMaterial } from "./keyboard/materials";

export type KeyboardProps = {
  skills: Skill[];
  /** Per skill: true when outside the active category filter. */
  dimmed: boolean[];
  /** Skill highlighted from the accessible button list (keyboard focus). */
  focused: number | null;
  /** Shared press/release times per slot, written by the parent and by clicks here. */
  keyTimes: React.RefObject<KeyTimes>;
  /** A key goes down (mouse press). */
  onPress: (slot: number) => void;
  /** A key comes back up (mouse release). */
  onRelease: (slot: number) => void;
  /** Touch/pen tap: down then up. */
  onTap: (slot: number) => void;
  active: boolean;
  compact: boolean;
  onReady?: () => void;
  /** Sound profile — also picks the switch stem colour, like real switches. */
  profile: SoundProfile;
};

const BEZEL = 0.45;
const CAP_REST_Y = 0.48; // cap underside above the plate: switch + a visible stem
const TRAVEL = 0.2; // ≈ 4 mm of travel; fully down, the cap stops just above the housing
/** Switch housing (plate-mounted) and stem, in plate-top coordinates. */
const SWITCH = { base: 0.12, top: 0.1, stemBase: 0.16, size: 0.7 }; // MX-style: housing ≈ 78% of the cap
const STEM_COLOR: Record<SoundProfile, string> = { thocky: "#d9a55b", clacky: "#e5484d", clicky: "#3b82f6" };
const YAW = THREE.MathUtils.degToRad(-30);
const ELEVATION = THREE.MathUtils.degToRad(60); // camera 30° off straight-down
const FOV = 26;

/** Sculpted OEM rows: per-row height scale and tilt (degrees, + faces the typist), back → front. */
const SCULPT = {
  desktop: { height: [1.12, 1.02, 0.97, 1.03], tilt: [9, 4, 0, -5] },
  compact: { height: [1.14, 1.06, 1, 0.98, 1.03], tilt: [10, 6, 2, -2, -6] },
};

/**
 * Key travel for a press at `down` and release at `up` (seconds). Fast 40 ms travel down,
 * held while the key is held, then a ~120 ms springy return with a tiny overshoot.
 */
function travelAt(now: number, down: number, up: number): number {
  if (down < 0) return 0;
  const d = now - down;
  if (d < 0) return 0;
  const pressDepth = d < 0.04 ? (d / 0.04) ** 2 : 1;
  if (up < down) return pressDepth; // still held
  const r = now - Math.max(up, down + 0.04);
  if (r < 0) return pressDepth;
  const s = r / 0.12;
  if (s > 3) return 0;
  return Math.exp(-4 * s) * Math.cos(Math.PI * 1.15 * s);
}

export default function Keyboard3D(props: KeyboardProps) {
  return (
    <Canvas
      dpr={props.compact ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: FOV, near: 0.1, far: 100 }}
      frameloop={props.active ? "always" : "never"}
      style={{ touchAction: "pan-y" }}
      aria-hidden
    >
      <ResumeLoop active={props.active} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-4, 9, 6]} intensity={1.6} />
      <directionalLight position={[6, 4, -4]} intensity={0.4} color="#9fb4ff" />
      <Suspense fallback={null}>
        <Board {...props} />
        <Environment resolution={128}>
          <Lightformer intensity={2.2} position={[0, 6, 4]} scale={[12, 4, 1]} />
          <Lightformer intensity={0.9} color="#a78bfa" position={[-8, 2, -2]} rotation={[0, Math.PI / 2, 0]} scale={[10, 4, 1]} />
          <Lightformer intensity={0.7} color="#22d3ee" position={[8, 2, -2]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 4, 1]} />
        </Environment>
      </Suspense>
    </Canvas>
  );
}

type CapClass = {
  width: number;
  keys: LayoutKey[];
  geometry: THREE.BufferGeometry;
  dim: THREE.InstancedBufferAttribute;
  glow: THREE.InstancedBufferAttribute;
};

function Board({ skills, dimmed, focused, keyTimes, onPress, onRelease, onTap, compact, onReady, profile }: KeyboardProps) {
  const layout = compact ? LAYOUTS.compact : LAYOUTS.desktop;
  const sculpt = compact ? SCULPT.compact : SCULPT.desktop;
  const plateW = layout.cols * U + BEZEL * 2;
  const plateD = layout.rows * U + BEZEL * 2;

  const logos = useTexture(skills.map((s) => s.logo));
  const legends = useMemo(
    () => buildLegends(layout.keys, skills, (logos as THREE.Texture[]).map((t) => t.image as CanvasImageSource)),
    [layout, skills, logos],
  );
  const material = useMemo(() => keycapMaterial(legends.texture), [legends]);

  // One instanced mesh per keycap width; legend rects are static per instance.
  const classes = useMemo<CapClass[]>(() => {
    const byWidth = new Map<number, LayoutKey[]>();
    layout.keys.forEach((k) => byWidth.set(k.w, [...(byWidth.get(k.w) ?? []), k]));
    return [...byWidth].map(([width, keys]) => {
      const geometry = keycapGeometry(width);
      const rects = new Float32Array(keys.length * 4);
      keys.forEach((k, i) => rects.set(legends.rects[layout.keys.indexOf(k)], i * 4));
      geometry.setAttribute("aUvRect", new THREE.InstancedBufferAttribute(rects, 4));
      const dim = new THREE.InstancedBufferAttribute(new Float32Array(keys.length), 1).setUsage(THREE.DynamicDrawUsage);
      const glow = new THREE.InstancedBufferAttribute(new Float32Array(keys.length), 1).setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("aDim", dim);
      geometry.setAttribute("aGlow", glow);
      return { width, keys, geometry, dim, glow };
    });
  }, [layout, legends]);

  const meshes = useRef<(THREE.InstancedMesh | null)[]>([]);
  const anim = useRef(new Map<number, { lift: number; dim: number; glow: number }>());
  const hovered = useRef<number | null>(null);
  const held = useRef<number | null>(null);
  const lastPointer = useRef("mouse");
  const floatRef = useRef<THREE.Group>(null);
  const gl = useThree((s) => s.gl);
  const scratch = useMemo(
    () => ({ m: new THREE.Matrix4(), p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3(), e: new THREE.Euler(), c: new THREE.Color(), dark: new THREE.Color("#14151d") }),
    [],
  );
  // Switches: one under every cap, plus two stabilizers under the spacebar.
  const switches = useMemo(
    () =>
      layout.keys.flatMap((k) => {
        const x = (k.x - layout.cols / 2) * U;
        const z = (k.row - (layout.rows - 1) / 2) * U;
        const stab = k.mod === "space" ? (k.w / 2 - 0.55) * U : 0;
        return (stab ? [0, -stab, stab] : [0]).map((dx) => ({ slot: k.slot, row: k.row, x: x + dx, z }));
      }),
    [layout],
  );
  const switchGeo = useMemo(
    () => ({
      base: new THREE.BoxGeometry(SWITCH.size, SWITCH.base, SWITCH.size).translate(0, SWITCH.base / 2, 0),
      top: new THREE.BoxGeometry(SWITCH.size * 0.86, SWITCH.top, SWITCH.size * 0.86).translate(0, SWITCH.base + SWITCH.top / 2, 0),
      // Unit-height stem scaled each frame to reach the cap's underside.
      stem: new THREE.BoxGeometry(0.13, 1, 0.13).translate(0, 0.5, 0),
    }),
    [],
  );
  const stemMat = useMemo(() => new THREE.MeshStandardMaterial({ color: STEM_COLOR.thocky, roughness: 0.45 }), []);
  useEffect(() => {
    stemMat.color.set(STEM_COLOR[profile]);
  }, [stemMat, profile]);
  const housingRefs = useRef<(THREE.InstancedMesh | null)[]>([]);
  const stemRef = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    for (const mesh of housingRefs.current) {
      if (!mesh) continue;
      switches.forEach((sw, i) => mesh.setMatrixAt(i, m.makeTranslation(sw.x, 0, sw.z)));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    }
  }, [switches]);

  const baseColors = useMemo(
    () => new Map(layout.keys.map((k) => [k.slot, new THREE.Color(k.skill !== null ? skills[k.skill].color : MOD_COLOR)])),
    [layout, skills],
  );

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(
    () => () => {
      classes.forEach((c) => c.geometry.dispose());
      Object.values(switchGeo).forEach((g) => g.dispose());
      stemMat.dispose();
      material.dispose();
      legends.texture.dispose();
    },
    [classes, material, legends, switchGeo, stemMat],
  );

  // A mouse press is released wherever the button comes up, even off the key.
  useEffect(() => {
    const up = () => {
      if (held.current === null) return;
      onRelease(held.current);
      held.current = null;
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [onRelease]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const now = performance.now() / 1000;
    const k = 1 - Math.exp(-dt * 14);
    const times = keyTimes.current;
    const { m, p, q, s, e, c, dark } = scratch;

    classes.forEach((cls, ci) => {
      const mesh = meshes.current[ci];
      if (!mesh) return;
      cls.keys.forEach((key, i) => {
        const a = anim.current.get(key.slot) ?? { lift: 0, dim: 0, glow: 0 };
        anim.current.set(key.slot, a);
        const isDimmed = key.skill !== null && dimmed[key.skill];
        const lifted = hovered.current === key.slot || (key.skill !== null && focused === key.skill);
        a.lift += ((lifted ? 0.05 : 0) - a.lift) * k;
        a.dim += ((isDimmed ? 1 : 0) - a.dim) * k;
        a.glow += ((lifted ? 1 : 0) - a.glow) * k;
        const sincePress = now - times.down[key.slot];
        const flash = sincePress >= 0 && sincePress < 0.3 ? 1 - sincePress / 0.3 : 0;

        const travel = travelAt(now, times.down[key.slot], times.up[key.slot]) * TRAVEL;
        p.set((key.x - layout.cols / 2) * U, CAP_REST_Y - travel + a.lift - a.dim * 0.08, (key.row - (layout.rows - 1) / 2) * U);
        e.set(THREE.MathUtils.degToRad(sculpt.tilt[key.row]), 0, 0);
        q.setFromEuler(e);
        s.set(1, sculpt.height[key.row], 1);
        mesh.setMatrixAt(i, m.compose(p, q, s));
        mesh.setColorAt(i, c.copy(baseColors.get(key.slot)!).lerp(dark, a.dim * 0.7));
        cls.dim.setX(i, a.dim);
        cls.glow.setX(i, Math.min(1, a.glow * 0.5 + flash));
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      cls.dim.needsUpdate = true;
      cls.glow.needsUpdate = true;
      if (!mesh.boundingSphere) mesh.computeBoundingSphere();
    });

    // Stems: top stays under the cap, so they visibly compress as the key travels.
    const stems = stemRef.current;
    if (stems) {
      switches.forEach((sw, i) => {
        const travel = travelAt(now, times.down[sw.slot], times.up[sw.slot]) * TRAVEL;
        const a = anim.current.get(sw.slot);
        const capBottom = CAP_REST_Y - travel + (a?.lift ?? 0) - (a?.dim ?? 0) * 0.08;
        p.set(sw.x, SWITCH.stemBase, sw.z);
        q.identity();
        s.set(1, Math.max(0.02, capBottom - SWITCH.stemBase + 0.04), 1);
        stems.setMatrixAt(i, m.compose(p, q, s));
      });
      stems.instanceMatrix.needsUpdate = true;
      if (!stems.boundingSphere) stems.computeBoundingSphere();
    }

    const f = floatRef.current;
    if (f) {
      f.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.06;
      f.rotation.x += (-state.pointer.y * 0.06 - f.rotation.x) * (1 - Math.exp(-dt * 3));
      f.rotation.z += (-state.pointer.x * 0.06 - f.rotation.z) * (1 - Math.exp(-dt * 3));
    }
  });

  const setHover = (slot: number | null) => {
    hovered.current = slot;
    const el = gl.domElement;
    el.style.setProperty("cursor", slot === null ? "" : "pointer");
    if (slot === null) el.removeAttribute("data-cursor");
    else el.setAttribute("data-cursor", "hover"); // grows the custom cursor ring
  };
  const slotOf = (ci: number, e: ThreeEvent<PointerEvent | MouseEvent>) =>
    e.instanceId === undefined ? null : classes[ci].keys[e.instanceId].slot;

  return (
    <>
      <FitCamera width={plateW} depth={plateD} />
      <group rotation={[0, YAW, 0]}>
        <ContactShadows position={[0, -0.5, 0]} scale={Math.max(plateW, plateD) * 1.7} blur={2.6} opacity={0.55} far={2} frames={1} />
        <group ref={floatRef}>
          {/* Plate (replaced by the full case in a later step) */}
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[plateW, 0.4, plateD]} />
            <meshPhysicalMaterial color="#12142a" roughness={0.55} metalness={0.35} />
          </mesh>
          {/* Switches: dark base, translucent milky top, coloured stem */}
          <instancedMesh
            ref={(el) => {
              housingRefs.current[0] = el;
            }}
            args={[switchGeo.base, undefined, switches.length]}
            frustumCulled={false}
          >
            <meshStandardMaterial color="#26283a" roughness={0.45} />
          </instancedMesh>
          <instancedMesh
            ref={(el) => {
              housingRefs.current[1] = el;
            }}
            args={[switchGeo.top, undefined, switches.length]}
            frustumCulled={false}
          >
            <meshPhysicalMaterial color="#eef1ff" emissive="#8a90b8" emissiveIntensity={0.25} roughness={0.25} transparent opacity={0.72} depthWrite={false} />
          </instancedMesh>
          <instancedMesh ref={stemRef} args={[switchGeo.stem, stemMat, switches.length]} frustumCulled={false} />
          {classes.map((cls, ci) => (
            <instancedMesh
              key={cls.width}
              ref={(el) => {
                meshes.current[ci] = el;
              }}
              args={[cls.geometry, material, cls.keys.length]}
              frustumCulled={false}
              onPointerMove={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                if (e.pointerType === "mouse") {
                  const slot = slotOf(ci, e);
                  if (slot !== hovered.current) setHover(slot);
                }
              }}
              onPointerOut={() => setHover(null)}
              onPointerDown={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                lastPointer.current = e.pointerType;
                const slot = slotOf(ci, e);
                if (slot !== null && e.pointerType === "mouse") {
                  held.current = slot;
                  onPress(slot); // mouse: down on press, up on release, like a real key
                }
              }}
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                const slot = slotOf(ci, e);
                if (slot !== null && lastPointer.current !== "mouse") onTap(slot); // touch: a tap, not a scroll
              }}
            />
          ))}
        </group>
      </group>
    </>
  );
}

/** Places the camera (30° off top-down) so the whole keyboard fits the canvas at any aspect. */
function FitCamera({ width, depth }: { width: number; depth: number }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);

  useLayoutEffect(() => {
    const aspect = size.width / size.height;
    const tanY = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const tanX = tanY * aspect;
    const spanX = Math.abs(width * Math.cos(YAW)) + Math.abs(depth * Math.sin(YAW));
    const spanZ = Math.abs(width * Math.sin(YAW)) + Math.abs(depth * Math.cos(YAW));
    const halfW = spanX / 2;
    const halfH = (spanZ * Math.sin(ELEVATION)) / 2 + 0.6;
    const dist = Math.max(halfW / tanX, halfH / tanY) * 1.02 + spanZ * 0.12;
    camera.position.set(0, dist * Math.sin(ELEVATION), dist * Math.cos(ELEVATION));
    camera.lookAt(0, -0.1, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, width, depth]);

  return null;
}

