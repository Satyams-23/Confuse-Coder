"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import * as THREE from "three";
import type { Theme } from "./ThemeProvider";

/*
  The hero object is the account's own logo, built in 3D from pieces.
  confused (t=0): pieces float apart, jumbled and spinning
  clear    (t=1): pieces snap together into the logo
*/

type V3 = [number, number, number];
type PieceDef = { id: string; node: ReactNode; pos: V3; rot?: V3; from: V3; fromRot: V3 };

const ease = (x: number) => x * x * (3 - 2 * x);

function Piece({ def, t, i }: { def: PieceDef; t: MutableRefObject<number>; i: number }) {
  const g = useRef<THREE.Group>(null!);
  const rot = def.rot ?? [0, 0, 0];
  useFrame((state) => {
    const k = ease(t.current);
    const loose = 1 - k;
    const time = state.clock.elapsedTime;
    const wob = Math.sin(time * 1.3 + i * 1.7) * 0.18 * loose;
    g.current.position.set(
      def.from[0] + (def.pos[0] - def.from[0]) * k,
      def.from[1] + (def.pos[1] - def.from[1]) * k + wob,
      def.from[2] + (def.pos[2] - def.from[2]) * k,
    );
    g.current.rotation.set(
      def.fromRot[0] + (rot[0] - def.fromRot[0]) * k + time * 0.4 * loose,
      def.fromRot[1] + (rot[1] - def.fromRot[1]) * k,
      def.fromRot[2] + (rot[2] - def.fromRot[2]) * k + time * 0.25 * loose,
    );
  });
  return <group ref={g}>{def.node}</group>;
}

/* ───────── @confuse__coder: nested double-C ring ───────── */
function arcGeo(rOut: number, rIn: number, a0: number, a1: number, cx = 0) {
  const s = new THREE.Shape();
  s.absarc(cx, 0, rOut, a0, a1, false);
  s.absarc(cx, 0, rIn, a1, a0, true);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.34,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 4,
    curveSegments: 64,
  });
  g.translate(0, 0, -0.17);
  return g;
}

const deg = (d: number) => (d * Math.PI) / 180;

function useCcPieces(): PieceDef[] {
  return useMemo(() => {
    const mat = (
      <meshPhysicalMaterial
        color="#ff7a1a"
        emissive="#ff4d00"
        emissiveIntensity={0.16}
        metalness={0.35}
        roughness={0.17}
        clearcoat={1}
        clearcoatRoughness={0.08}
      />
    );
    // Outer C (opening on the right) in 3 arcs, inner c in 2 arcs.
    const arcs: [number, number, number, number, number][] = [
      [1.7, 1.12, 40, 133, 0],
      [1.7, 1.12, 133, 227, 0],
      [1.7, 1.12, 227, 320, 0],
      [0.78, 0.4, 50, 180, 0.2],
      [0.78, 0.4, 180, 310, 0.2],
    ];
    const scatter: { from: V3; fromRot: V3 }[] = [
      { from: [1.6, 1.6, 0.6], fromRot: [0.9, -0.6, 1.2] },
      { from: [-2.1, 0.6, -0.4], fromRot: [-0.7, 0.8, -0.5] },
      { from: [0.9, -1.9, 0.3], fromRot: [0.4, 1.1, 2.2] },
      { from: [-0.9, -0.6, 1.4], fromRot: [1.4, 0.3, -1.6] },
      { from: [0.3, 0.9, -1.2], fromRot: [-1.2, -0.9, 0.8] },
    ];
    return arcs.map(([ro, ri, a0, a1, cx], i) => ({
      id: `cc${i}`,
      node: <mesh geometry={arcGeo(ro, ri, deg(a0), deg(a1), cx)}>{mat}</mesh>,
      pos: [0, 0, 0] as V3,
      ...scatter[i],
    }));
  }, []);
}

/* ───────── @confuse__coder.dev: tilted yellow card with </> ───────── */
function Bar({ a, b, r = 0.13 }: { a: [number, number]; b: [number, number]; r?: number }) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  return (
    <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]} rotation={[0, 0, Math.atan2(dy, dx) - Math.PI / 2]}>
      <capsuleGeometry args={[r, len, 8, 16]} />
      <meshToonMaterial color="#111111" />
    </mesh>
  );
}

function useDevPieces(): PieceDef[] {
  return useMemo(() => {
    const Z = 0.26;
    return [
      {
        id: "shadow",
        node: (
          <RoundedBox args={[2.9, 2.6, 0.3]} radius={0.14} smoothness={4}>
            <meshToonMaterial color="#111111" />
          </RoundedBox>
        ),
        pos: [0.2, -0.22, -0.28],
        from: [0.9, -1.6, -1.4],
        fromRot: [0.5, -0.4, 0.6],
      },
      {
        id: "card",
        node: (
          <group>
            <RoundedBox args={[2.9, 2.6, 0.3]} radius={0.14} smoothness={4}>
              <meshToonMaterial color="#111111" />
            </RoundedBox>
            <RoundedBox args={[2.66, 2.36, 0.36]} radius={0.1} smoothness={4}>
              <meshToonMaterial color="#FFD23F" />
            </RoundedBox>
          </group>
        ),
        pos: [0, 0, 0],
        from: [-0.4, 0.3, -1],
        fromRot: [-0.6, 0.7, -0.4],
      },
      {
        // starts on the RIGHT, pointing the wrong way: that's the "confused" bit
        id: "lt",
        node: (
          <group position={[0, 0, Z]}>
            <Bar a={[-0.85, 0]} b={[-0.45, 0.5]} />
            <Bar a={[-0.85, 0]} b={[-0.45, -0.5]} />
          </group>
        ),
        pos: [0, 0, 0],
        from: [1.9, 0.9, 0.9],
        fromRot: [0, 0, Math.PI],
      },
      {
        id: "slash",
        node: (
          <group position={[0, 0, Z]}>
            <Bar a={[-0.16, -0.55]} b={[0.16, 0.55]} />
          </group>
        ),
        pos: [0, 0, 0],
        from: [0.2, 1.8, 1.2],
        fromRot: [0.3, 0.2, 1.9],
      },
      {
        id: "gt",
        node: (
          <group position={[0, 0, Z]}>
            <Bar a={[0.85, 0]} b={[0.45, 0.5]} />
            <Bar a={[0.85, 0]} b={[0.45, -0.5]} />
          </group>
        ),
        pos: [0, 0, 0],
        from: [-1.9, -0.8, 0.8],
        fromRot: [0, 0, -Math.PI],
      },
      {
        id: "dot",
        node: (
          <group position={[1.3, 1.15, 0.3]}>
            <mesh>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshToonMaterial color="#3DDC97" />
            </mesh>
            <mesh>
              <torusGeometry args={[0.3, 0.07, 12, 40]} />
              <meshToonMaterial color="#111111" />
            </mesh>
          </group>
        ),
        pos: [0, 0, 0],
        from: [0.6, 0.9, 1.6],
        fromRot: [0, 0, 0],
      },
    ];
  }, []);
}

function Logo({ clear, theme }: { clear: boolean; theme: Theme }) {
  const group = useRef<THREE.Group>(null!);
  const t = useRef(0);
  const cc = useCcPieces();
  const dev = useDevPieces();
  const pieces = theme === "cc" ? cc : dev;

  useFrame((state, dt) => {
    t.current += ((clear ? 1 : 0) - t.current) * Math.min(1, dt * 2.8);
    const { x, y } = state.pointer;
    const baseZ = theme === "dev" ? 0.1 : 0; // .dev logo card is tilted ~6° anticlockwise (top edge rises to the right)
    group.current.rotation.y += (x * 0.45 - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (-y * 0.3 - group.current.rotation.x) * 0.05;
    group.current.rotation.z += (baseZ - group.current.rotation.z) * 0.05;
  });

  return (
    <group ref={group} scale={theme === "dev" ? 0.92 : 0.95} position={[0, 0.55, 0]}>
      {pieces.map((p, i) => (
        <Piece key={p.id} def={p} t={t} i={i} />
      ))}
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const p = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
      const r = 3 + Math.random() * 5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      p.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph) - 2], i * 3);
    }
    return p;
  }, []);
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.02;
    ref.current.rotation.x += dt * 0.008;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#ffb547" transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function HeroScene({ clear, theme }: { clear: boolean; theme: Theme }) {
  return (
    <Canvas camera={{ position: [0, 0, 7.4], fov: 38 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      {theme === "cc" ? (
        <>
          <ambientLight intensity={0.25} />
          <pointLight position={[3, 3, 4]} intensity={40} color="#ffb547" />
          <pointLight position={[-4, -2, 2]} intensity={25} color="#ff3d00" />
          <Environment resolution={128}>
            <Lightformer form="rect" intensity={3} position={[0, 4, -2]} scale={[8, 1.5, 1]} color="#ffd9b0" />
            <Lightformer form="ring" intensity={2} position={[-4, 0, 3]} scale={3} color="#ff7a1a" />
            <Lightformer form="rect" intensity={1.5} position={[4, -2, 2]} scale={[2, 6, 1]} color="#ffffff" />
          </Environment>
          <Dust />
        </>
      ) : (
        <>
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 6]} intensity={2.4} />
        </>
      )}
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
        <Logo clear={clear} theme={theme} />
      </Float>
    </Canvas>
  );
}
