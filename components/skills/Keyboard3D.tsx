"use client";

/*
 * Isometric mechanical keyboard of skill keycaps. Loaded with next/dynamic (ssr: false)
 * only once the Skills section nears the viewport; the parent pauses it (frameloop
 * "never") whenever it's off-screen.
 */

import * as THREE from "three";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useTexture } from "@react-three/drei";
import { ResumeLoop } from "@/components/effects/ResumeLoop";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Skill } from "@/data/types";
import { inkFor } from "./keycaps";

export type KeyboardProps = {
  skills: Skill[];
  /** Per-key: true when outside the active category filter. */
  dimmed: boolean[];
  /** Key highlighted from the accessible button list (keyboard focus). */
  focused: number | null;
  /** Press timestamps (performance.now() / 1000) per key, written by the parent. */
  pressTimes: React.RefObject<Float64Array>;
  /** Key goes down (mouse press). */
  onPress: (index: number) => void;
  /** Key comes back up (mouse release). */
  onRelease: (index: number) => void;
  /** Touch/pen tap: down then up. */
  onTap: (index: number) => void;
  active: boolean;
  compact: boolean;
  onReady?: () => void;
};

const KEY = { w: 1, h: 0.55, d: 1, pitch: 1.18 };
const PLATE = { margin: 0.32, h: 0.38 };
const MAX_TILT = THREE.MathUtils.degToRad(5);
const YAW = THREE.MathUtils.degToRad(-30);
const ELEVATION = THREE.MathUtils.degToRad(60); // camera 30° off straight-down
const FOV = 26;

export default function Keyboard3D(props: KeyboardProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: FOV, near: 0.1, far: 100 }}
      frameloop={props.active ? "always" : "never"}
      style={{ touchAction: "pan-y" }}
      aria-hidden
    >
      <ResumeLoop active={props.active} />
      <ambientLight intensity={0.55} />
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

/** Spring-ish press curve: quick travel down, then a damped bounce back past rest. */
function pressOffset(t: number): number {
  if (t < 0 || t > 1.2) return 0;
  const down = 0.045;
  if (t < down) return -0.2 * (t / down);
  const s = t - down;
  return -0.2 * Math.exp(-s * 9) * Math.cos(s * 22);
}

/** One canvas texture per key: the logo tinted to the key's ink colour plus its letter legend. */
function useKeyTextures(skills: Skill[]) {
  const logos = useTexture(skills.map((s) => s.logo));
  return useMemo(
    () =>
      skills.map((skill, i) => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const g = canvas.getContext("2d")!;
        const ink = inkFor(skill.color);
        const img = (logos as THREE.Texture[])[i].image as CanvasImageSource;
        // Logo, tinted by compositing a fill over its alpha.
        const s = 132;
        g.drawImage(img, (size - s) / 2, (size - s) / 2 + 14, s, s);
        g.globalCompositeOperation = "source-in";
        g.fillStyle = ink;
        g.fillRect(0, 0, size, size);
        // Letter legend, top-left like a real keycap.
        g.globalCompositeOperation = "source-over";
        g.globalAlpha = 0.8;
        g.fillStyle = ink;
        g.font = "700 46px ui-sans-serif, system-ui, sans-serif";
        g.textBaseline = "top";
        g.fillText(skill.key, 26, 20);
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        return tex;
      }),
    [logos, skills],
  );
}

function Board({ skills, dimmed, focused, pressTimes, onPress, onRelease, onTap, compact, onReady }: KeyboardProps) {
  const cols = compact ? 4 : 6;
  const rows = Math.ceil(skills.length / cols);
  const plateW = cols * KEY.pitch + PLATE.margin * 2;
  const plateD = rows * KEY.pitch + PLATE.margin * 2;

  const textures = useKeyTextures(skills);
  const capGeo = useMemo(() => new RoundedBoxGeometry(KEY.w, KEY.h, KEY.d, 4, 0.14), []);
  const decalGeo = useMemo(() => new THREE.PlaneGeometry(0.78, 0.78), []);
  const plateGeo = useMemo(() => new RoundedBoxGeometry(plateW, PLATE.h, plateD, 4, 0.22), [plateW, plateD]);

  // Per-key materials (own colour). Animation state lives in a ref, outside React state.
  const caps = useMemo(
    () =>
      skills.map((s) => {
        const base = new THREE.Color(s.color);
        return {
          base,
          mat: new THREE.MeshPhysicalMaterial({ color: base.clone(), roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.25, emissive: new THREE.Color(0) }),
        };
      }),
    [skills],
  );
  const anim = useRef(skills.map(() => ({ y: 0, dim: 0, glow: 0 })));
  const decalMats = useMemo(
    () => textures.map((map) => new THREE.MeshBasicMaterial({ map, transparent: true, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 })),
    [textures],
  );

  const positions = useMemo(
    () =>
      skills.map((_, i) => {
        const r = Math.floor(i / cols);
        const inRow = r === rows - 1 ? skills.length - r * cols : cols; // centre a short last row
        const c = i % cols;
        return new THREE.Vector3((c - (inRow - 1) / 2) * KEY.pitch, KEY.h / 2, (r - (rows - 1) / 2) * KEY.pitch);
      }),
    [skills, cols, rows],
  );

  const keyRefs = useRef<(THREE.Group | null)[]>([]);
  const floatRef = useRef<THREE.Group>(null);
  const hovered = useRef<number | null>(null);
  const lastPointer = useRef<string>("mouse");
  const held = useRef<number | null>(null);

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
  const dark = useMemo(() => new THREE.Color("#1a1c33"), []);
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(
    () => () => {
      capGeo.dispose();
      decalGeo.dispose();
      plateGeo.dispose();
      caps.forEach((c) => c.mat.dispose());
      decalMats.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
    [capGeo, decalGeo, plateGeo, caps, decalMats, textures],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const now = performance.now() / 1000;
    const k = 1 - Math.exp(-dt * 14);

    for (let i = 0; i < caps.length; i++) {
      const cap = caps[i];
      const a = anim.current[i];
      const ref = keyRefs.current[i];
      if (!ref || !a) continue;
      const lifted = hovered.current === i || focused === i;
      const targetY = (lifted ? 0.1 : 0) + (dimmed[i] ? -0.16 : 0);
      a.y += (targetY - a.y) * k;
      a.dim += ((dimmed[i] ? 1 : 0) - a.dim) * k;
      const sincePress = now - pressTimes.current[i];
      const flash = sincePress >= 0 && sincePress < 0.35 ? 1 - sincePress / 0.35 : 0;
      a.glow += ((lifted ? 1 : 0) - a.glow) * k;
      ref.position.setY(positions[i].y + a.y + pressOffset(sincePress));
      cap.mat.color.copy(cap.base).lerp(dark, a.dim * 0.72);
      cap.mat.emissive.copy(cap.base).multiplyScalar(a.glow * 0.35 + flash * 0.5);
      decalMats[i].setValues({ opacity: 1 - a.dim * 0.6 });
    }

    // Slow float, plus a small tilt toward the pointer (max ~5°).
    const f = floatRef.current;
    if (f) {
      const t = state.clock.elapsedTime;
      f.position.y = Math.sin(t * 0.9) * 0.08;
      const tx = -state.pointer.y * MAX_TILT;
      const tz = -state.pointer.x * MAX_TILT;
      f.rotation.x += (tx - f.rotation.x) * (1 - Math.exp(-dt * 3));
      f.rotation.z += (tz - f.rotation.z) * (1 - Math.exp(-dt * 3));
    }
  });

  const setHover = (i: number | null) => {
    hovered.current = i;
    const el = gl.domElement;
    el.style.setProperty("cursor", i === null ? "" : "pointer");
    if (i === null) el.removeAttribute("data-cursor");
    else el.setAttribute("data-cursor", "hover"); // grows the custom cursor ring
  };

  return (
    <>
      <FitCamera width={plateW} depth={plateD} />
      <group rotation={[0, YAW, 0]}>
        <ContactShadows position={[0, -PLATE.h - 0.08, 0]} scale={Math.max(plateW, plateD) * 1.7} blur={2.6} opacity={0.55} far={2} frames={1} />
        <group ref={floatRef}>
          {/* Base plate */}
          <mesh geometry={plateGeo} position={[0, -PLATE.h / 2, 0]}>
            <meshPhysicalMaterial color="#12142a" roughness={0.55} metalness={0.35} clearcoat={0.4} />
          </mesh>
          {skills.map((skill, i) => (
            <group
              key={skill.name}
              ref={(el) => {
                keyRefs.current[i] = el;
              }}
              position={positions[i]}
              onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                if (e.pointerType === "mouse") setHover(i);
              }}
              onPointerOut={() => {
                if (hovered.current === i) setHover(null);
              }}
              onPointerDown={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                lastPointer.current = e.pointerType;
                if (e.pointerType === "mouse") {
                  held.current = i;
                  onPress(i); // mouse: down on press, up on release, like a real key
                }
              }}
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                if (lastPointer.current !== "mouse") onTap(i); // touch/pen: only on a tap, not a scroll
              }}
            >
              <mesh geometry={capGeo} material={caps[i].mat} />
              <mesh geometry={decalGeo} material={decalMats[i]} position={[0, KEY.h / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} />
            </group>
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
    // Footprint of the yawed plate, then how much of it the camera sees across and up/down.
    const spanX = Math.abs(width * Math.cos(YAW)) + Math.abs(depth * Math.sin(YAW));
    const spanZ = Math.abs(width * Math.sin(YAW)) + Math.abs(depth * Math.cos(YAW));
    const halfW = spanX / 2;
    const halfH = (spanZ * Math.sin(ELEVATION)) / 2 + 0.5; // depth foreshortened, plus key height
    const dist = Math.max(halfW / tanX, halfH / tanY) * 1.02 + spanZ * 0.12;
    camera.position.set(0, dist * Math.sin(ELEVATION), dist * Math.cos(ELEVATION));
    camera.lookAt(0, -0.15, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, width, depth]);

  return null;
}
