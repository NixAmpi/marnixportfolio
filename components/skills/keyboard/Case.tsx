"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";

/** Typing angle: the case is a wedge, thicker at the back. */
export const TYPING_ANGLE = THREE.MathUtils.degToRad(6);
const FRONT_THICKNESS = 0.36; // case height under the plate at the front edge
const PLATE_T = 0.05;
const RIM_H = 0.16;

export type CaseBox = { minX: number; maxX: number; minZ: number; maxZ: number };

/** Rounded-rectangle THREE.Shape (x, y in shape space), centred on (cx, cy). */
function roundedShape(w: number, h: number, r: number, cx = 0, cy = 0, path: THREE.Shape | THREE.Path = new THREE.Shape()) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  path.moveTo(x + r, y);
  path.lineTo(x + w - r, y);
  path.quadraticCurveTo(x + w, y, x + w, y + r);
  path.lineTo(x + w, y + h - r);
  path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  path.lineTo(x + r, y + h);
  path.quadraticCurveTo(x, y + h, x, y + h - r);
  path.lineTo(x, y + r);
  path.quadraticCurveTo(x, y, x + r, y);
  return path;
}

/**
 * Case body, in deck space (the deck group is tilted by TYPING_ANGLE; deck y=0 is the plate top).
 * The top is flat in deck space; the bottom is slanted so it sits flat on the table in world space.
 */
/** Deck-space y of the case bottom at depth z (the bottom is flat in world space). */
export function caseBottomAt(box: CaseBox) {
  const cos = Math.cos(TYPING_ANGLE);
  const sin = Math.sin(TYPING_ANGLE);
  const yB = -(FRONT_THICKNESS + PLATE_T) * cos - box.maxZ * sin;
  return (z: number) => (yB + z * sin) / cos;
}

function caseBodyGeometry(box: CaseBox) {
  const W = box.maxX - box.minX;
  const bevel = 0.07;
  const bottomAt = caseBottomAt(box);
  const top = -PLATE_T;
  // Profile in (sx = -z, sy = y), corners lightly rounded.
  const r = 0.1;
  const zF = box.maxZ - bevel;
  const zB = box.minZ + bevel;
  const s = new THREE.Shape();
  const P = (z: number, y: number) => new THREE.Vector2(-z, y);
  const pts = [P(zF, bottomAt(zF) + bevel), P(zF, top - bevel), P(zB, top - bevel), P(zB, bottomAt(zB) + bevel)];
  s.moveTo(pts[0].x, pts[0].y + r);
  s.lineTo(pts[1].x, pts[1].y - r);
  s.quadraticCurveTo(pts[1].x, pts[1].y, pts[1].x + r, pts[1].y);
  s.lineTo(pts[2].x - r, pts[2].y);
  s.quadraticCurveTo(pts[2].x, pts[2].y, pts[2].x, pts[2].y - r);
  s.lineTo(pts[3].x, pts[3].y + r);
  s.quadraticCurveTo(pts[3].x, pts[3].y, pts[3].x - r, pts[3].y);
  s.lineTo(pts[0].x + r, pts[0].y);
  s.quadraticCurveTo(pts[0].x, pts[0].y, pts[0].x, pts[0].y + r);
  const g = new THREE.ExtrudeGeometry(s, { depth: W - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 6 });
  g.rotateY(Math.PI / 2); // extrusion → +x, shape x (-z) → z
  g.translate(box.minX + bevel, 0, 0);
  g.computeVertexNormals();
  return { geometry: g, bottomAt };
}

/** The raised rim around the recessed plate (a rounded frame), lying flat in deck space. */
function rimGeometry(box: CaseBox, inner: CaseBox) {
  const outer = roundedShape(box.maxX - box.minX - 0.02, box.maxZ - box.minZ - 0.02, 0.16, (box.minX + box.maxX) / 2, -(box.minZ + box.maxZ) / 2) as THREE.Shape;
  const hole = roundedShape(inner.maxX - inner.minX, inner.maxZ - inner.minZ, 0.08, (inner.minX + inner.maxX) / 2, -(inner.minZ + inner.maxZ) / 2, new THREE.Path());
  outer.holes.push(hole as THREE.Path);
  const g = new THREE.ExtrudeGeometry(outer, { depth: RIM_H, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 2, curveSegments: 8 });
  g.rotateX(-Math.PI / 2); // shape (x, y) → (x, -z), extrusion → +y
  g.translate(0, -PLATE_T, 0);
  return g;
}

/** Coiled cable: a short run out of the back, a helix, then off toward the back. */
function cableGeometry(start: THREE.Vector3, tableY: number) {
  const pts: THREE.Vector3[] = [];
  pts.push(start.clone(), start.clone().add(new THREE.Vector3(0, -0.05, -0.35)));
  const coilStart = start.clone().add(new THREE.Vector3(0, -0.12, -0.55));
  const turns = 11;
  const length = 1.5;
  const radius = 0.075;
  for (let i = 0; i <= turns * 16; i++) {
    const t = i / (turns * 16);
    const a = t * turns * Math.PI * 2;
    pts.push(new THREE.Vector3(coilStart.x + Math.cos(a) * radius, coilStart.y + Math.sin(a) * radius, coilStart.z - t * length));
  }
  const end = coilStart.clone().add(new THREE.Vector3(0, 0, -length));
  pts.push(end.clone().add(new THREE.Vector3(0, -0.15, -0.3)), new THREE.Vector3(end.x + 0.2, tableY + 0.04, end.z - 1.2), new THREE.Vector3(end.x + 0.5, tableY + 0.04, end.z - 3.5));
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
  return new THREE.TubeGeometry(curve, 900, 0.03, 8, false);
}

export function KeyboardCase({
  box,
  plate,
  detailed,
  soundOn,
  onKnob,
  onKnobHover,
  onTableY,
}: {
  onKnobHover?: (hovering: boolean) => void;
  /** Outer footprint of the case in deck space. */
  box: CaseBox;
  /** Recessed plate area (inside the rim). */
  plate: CaseBox;
  /** Desktop extras: cable and knob. */
  detailed: boolean;
  soundOn: boolean;
  onKnob: () => void;
  /** Reports the world-space table height (for shadows/glow). */
  onTableY?: (y: number) => void;
}) {
  const body = useMemo(() => caseBodyGeometry(box), [box]);
  const rim = useMemo(() => rimGeometry(box, plate), [box, plate]);
  const tableY = useMemo(() => {
    // World y of the case bottom (front edge), after the deck tilt.
    const z = box.maxZ;
    const yd = body.bottomAt(z);
    return yd * Math.cos(TYPING_ANGLE) - z * Math.sin(TYPING_ANGLE);
  }, [box, body]);
  useEffect(() => onTableY?.(tableY), [tableY, onTableY]);

  const port = useMemo(() => new THREE.Vector3(box.minX + 1.1, -PLATE_T - 0.2, box.minZ - 0.02), [box]);
  const cable = useMemo(() => (detailed ? cableGeometry(port, (tableY + port.z * Math.sin(TYPING_ANGLE)) / Math.cos(TYPING_ANGLE)) : null), [detailed, port, tableY]);

  useEffect(
    () => () => {
      body.geometry.dispose();
      rim.dispose();
      cable?.dispose();
    },
    [body, rim, cable],
  );

  // Knob: spins on click (toggling sound) with a springy settle; idles slowly while sound is on.
  const knob = useRef<THREE.Group>(null);
  const knobTarget = useRef(0);
  const knobVel = useRef(0);
  useFrame((_, delta) => {
    const k = knob.current;
    if (!k) return;
    const dt = Math.min(delta, 1 / 30);
    if (soundOn) knobTarget.current += dt * 0.25;
    const force = (knobTarget.current - k.rotation.y) * 90 - knobVel.current * 12;
    knobVel.current += force * dt;
    k.rotation.y += knobVel.current * dt;
  });
  const knobPos = useMemo(() => new THREE.Vector3(box.maxX - 0.62, RIM_H - PLATE_T, (box.minZ + plate.minZ) / 2), [box, plate]);

  const feet = useMemo(
    () =>
      [
        [box.minX + 0.5, box.maxZ - 0.45],
        [box.maxX - 0.5, box.maxZ - 0.45],
        [box.minX + 0.5, box.minZ + 0.45],
        [box.maxX - 0.5, box.minZ + 0.45],
      ].map(([x, z]) => new THREE.Vector3(x, body.bottomAt(z) - 0.02, z)),
    [box, body],
  );

  return (
    <group>
      {/* Aluminium wedge body */}
      <mesh geometry={body.geometry}>
        <meshPhysicalMaterial color="#5a5f6c" metalness={0.8} roughness={0.35} clearcoat={0.3} clearcoatRoughness={0.4} />
      </mesh>
      {/* Raised rim around the recessed plate */}
      <mesh geometry={rim}>
        <meshPhysicalMaterial color="#666b78" metalness={0.8} roughness={0.32} clearcoat={0.35} />
      </mesh>
      {/* Recessed plate where the switches sit */}
      <mesh position={[(plate.minX + plate.maxX) / 2, -PLATE_T / 2, (plate.minZ + plate.maxZ) / 2]}>
        <boxGeometry args={[plate.maxX - plate.minX, PLATE_T, plate.maxZ - plate.minZ]} />
        <meshStandardMaterial color="#14151b" metalness={0.5} roughness={0.55} />
      </mesh>
      {/* Rubber feet */}
      {feet.map((p, i) => (
        <mesh key={i} position={p}>
          <cylinderGeometry args={[0.14, 0.14, 0.05, 20]} />
          <meshStandardMaterial color="#0b0b0e" roughness={0.9} />
        </mesh>
      ))}
      {detailed && (
        <>
          {/* USB-C port on the back edge, and a coiled cable */}
          <mesh position={port}>
            <boxGeometry args={[0.22, 0.08, 0.04]} />
            <meshStandardMaterial color="#08080a" roughness={0.6} />
          </mesh>
          {cable && (
            <mesh geometry={cable}>
              <meshStandardMaterial color="#5b4bd6" roughness={0.55} />
            </mesh>
          )}
          {/* Rotary knob (toggles sound) */}
          <group
            ref={knob}
            position={knobPos}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              knobTarget.current += Math.PI / 3;
              onKnob();
            }}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              onKnobHover?.(true);
            }}
            onPointerOut={() => onKnobHover?.(false)}
          >
            <mesh position={[0, 0.14, 0]}>
              <cylinderGeometry args={[0.26, 0.28, 0.28, 48]} />
              <meshPhysicalMaterial color="#c5c9d3" metalness={1} roughness={0.28} clearcoat={0.4} />
            </mesh>
            {/* Indicator notch */}
            <mesh position={[0, 0.285, 0.17]}>
              <boxGeometry args={[0.04, 0.012, 0.12]} />
              <meshBasicMaterial color={soundOn ? "#22d3ee" : "#555b69"} toneMapped={false} />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
}
