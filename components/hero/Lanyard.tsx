"use client";

/*
 * Hanging ID-card lanyard, after the React Bits "Lanyard" pattern:
 * a fixed anchor, three rope-jointed links and a card rigid body, with the strap
 * drawn as a MeshLine through the links. The card face is /public/lanyard/card.png.
 */

import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree, type ThreeElement, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    // The constructor's params are optional at runtime; props are applied after construction.
    meshLineMaterial: Omit<ThreeElement<typeof MeshLineMaterial>, "args"> & {
      args?: ConstructorParameters<typeof MeshLineMaterial>;
    };
  }
}

type Layout = { cameraZ: number; anchorY: number; segment: number };

// Tuned so the anchor sits just above the top edge and the card hangs mid-frame.
const LAYOUTS: Record<"desktop" | "compact", Layout> = {
  desktop: { cameraZ: 19, anchorY: 3.6, segment: 1 },
  compact: { cameraZ: 13, anchorY: 2.45, segment: 0.55 },
};

const CARD = { width: 1.6, height: 2.25, depth: 0.02 };
const CARD_JOINT_Y = 1.45;

export type LanyardProps = {
  compact: boolean;
  active: boolean;
  onReady?: () => void;
};

export default function Lanyard({ compact, active, onReady }: LanyardProps) {
  const layout = compact ? LAYOUTS.compact : LAYOUTS.desktop;
  return (
    <Canvas
      camera={{ position: [0, 0, layout.cameraZ], fov: 20 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      frameloop={active ? "always" : "never"}
      style={{ touchAction: "pan-y" }}
      aria-hidden
    >
      <ambientLight intensity={Math.PI} />
      <Suspense fallback={null}>
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60} paused={!active}>
          <Band layout={layout} onReady={onReady} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Suspense>
    </Canvas>
  );
}

const segmentProps: RigidBodyProps = {
  type: "dynamic",
  canSleep: true,
  colliders: false,
  angularDamping: 4,
  linearDamping: 4,
};

function Band({ layout, onReady, maxSpeed = 50, minSpeed = 0 }: { layout: Layout; onReady?: () => void; maxSpeed?: number; minSpeed?: number }) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const lerped = useRef<{ j1?: THREE.Vector3; j2?: THREE.Vector3 }>({});

  const tmp = useMemo(
    () => ({ vec: new THREE.Vector3(), ang: new THREE.Vector3(), dir: new THREE.Vector3() }),
    [],
  );
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3(
        [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
        false,
        "chordal",
      ),
  );
  const [dragged, setDragged] = useState<THREE.Vector3 | null>(null);
  const [hovered, setHovered] = useState(false);
  const size = useThree((s) => s.size);

  const [front, back, strap] = useTexture(
    ["/lanyard/card.png", "/lanyard/card-back.png", "/lanyard/band.png"],
    (textures) => {
      for (const t of textures) {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 16;
      }
      textures[2].wrapS = textures[2].wrapT = THREE.RepeatWrapping;
    },
  );

  const s = layout.segment;
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], s]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], s]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], s]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, CARD_JOINT_Y, 0]]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    const [f, a, b, c, body, line] = [fixed.current, j1.current, j2.current, j3.current, card.current, band.current];
    if (!f || !a || !b || !c || !body || !line) return;

    if (dragged) {
      const { vec, dir } = tmp;
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [body, a, b, c, f].forEach((r) => r.wakeUp());
      body.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }

    // Ease the middle links toward their physics positions to avoid jitter in the strap.
    for (const [key, rb] of [["j1", a], ["j2", b]] as const) {
      const t = rb.translation();
      const l = (lerped.current[key] ??= new THREE.Vector3(t.x, t.y, t.z));
      const dist = Math.max(0.1, Math.min(1, l.distanceTo(t)));
      l.lerp(t, Math.min(1, delta * (minSpeed + dist * (maxSpeed - minSpeed))));
    }

    curve.points[0].copy(c.translation());
    curve.points[1].copy(lerped.current.j2!);
    curve.points[2].copy(lerped.current.j1!);
    curve.points[3].copy(f.translation());
    line.geometry.setPoints(curve.getPoints(32));

    // Gently turn the card back to face the camera.
    tmp.ang.copy(body.angvel());
    const rot = body.rotation();
    body.setAngvel({ x: tmp.ang.x, y: tmp.ang.y - rot.y * 0.25, z: tmp.ang.z }, true);
  });

  const grab = (e: ThreeEvent<PointerEvent>) => {
    if (!card.current) return;
    (e.target as unknown as Element).setPointerCapture?.(e.pointerId);
    const t = card.current.translation();
    setDragged(new THREE.Vector3().copy(e.point).sub(new THREE.Vector3(t.x, t.y, t.z)));
  };
  const release = (e: ThreeEvent<PointerEvent>) => {
    (e.target as unknown as Element).releasePointerCapture?.(e.pointerId);
    setDragged(null);
  };

  return (
    <>
      <group position={[0, layout.anchorY, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[s, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2 * s, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[3 * s, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[3 * s + 0.5, -CARD_JOINT_Y, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[CARD.width / 2, CARD.height / 2, CARD.depth / 2]} />
          <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={grab}
            onPointerUp={release}
            onPointerCancel={release}
          >
            <mesh>
              <boxGeometry args={[CARD.width, CARD.height, CARD.depth]} />
              <meshStandardMaterial color="#0a2530" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0, CARD.depth / 2 + 0.0005]}>
              <planeGeometry args={[CARD.width, CARD.height]} />
              <meshBasicMaterial map={front} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, -CARD.depth / 2 - 0.0005]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CARD.width, CARD.height]} />
              <meshBasicMaterial map={back} toneMapped={false} />
            </mesh>
            {/* metal clip + ring */}
            <mesh position={[0, CARD.height / 2 + 0.05, 0]}>
              <boxGeometry args={[0.24, 0.16, 0.05]} />
              <meshStandardMaterial color="#c9ced8" metalness={1} roughness={0.3} />
            </mesh>
            <mesh position={[0, CARD_JOINT_Y - 0.08, 0]}>
              <torusGeometry args={[0.08, 0.02, 12, 32]} />
              <meshStandardMaterial color="#c9ced8" metalness={1} roughness={0.3} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[size.width, size.height]}
          useMap={1}
          map={strap}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
