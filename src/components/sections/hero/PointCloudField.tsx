"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { LoadedShape } from "@/types/pointcloud";

// Durations are independent (not fractions of one fixed cycle) so an
// interrupt (the visitor clicking a legend item) can cut a phase short
// without the timing math falling apart.
const ASSEMBLE_DURATION = 3.4; // seconds to go from wherever points are -> a shape
const DISPERSE_DURATION = 3.0; // seconds to fall back to the noise cloud
const AUTO_HOLD_DURATION = 3.0; // seconds a shape stays assembled during auto-cycling
const STAGGER = 0.32; // per-point delay spread, so points don't move in lockstep

// Denser / more contained than the first version — reads as a cluster,
// not dust scattered across the whole scene.
const NOISE_RADIUS_MIN = 2.6;
const NOISE_RADIUS_SPREAD = 1.6;

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

type Phase = "assembling" | "holding" | "dispersing";

type SceneData = {
  geometry: THREE.BufferGeometry;
  noisePos: Float32Array;
  currentPos: Float32Array;
  sourcePos: Float32Array; // snapshot of currentPos at the start of the active phase
  delays: Float32Array;
  jitter: Float32Array; // per-point size/brightness variance, from the pipeline
};

const VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export default function PointCloudField({
  shapes,
  count,
  activeIndex,
  onPhaseChange,
}: {
  shapes: LoadedShape[];
  count: number;
  /** Controlled: when set, the field assembles + holds this shape indefinitely.
   *  When null, it auto-cycles through all shapes with noise in between. */
  activeIndex: number | null;
  onPhaseChange?: (shapeIndex: number, mode: Phase) => void;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const dataRef = useRef<SceneData | null>(null);
  const uniforms = useMemo(
    () => ({
      uOpacity: { value: 1.0 },
      // one flat color for every point, in every state — no color transition
      uColor: { value: new THREE.Color(0xffc94d) },
    }),
    []
  );

  // FSM state, mutated imperatively in useFrame — deliberately refs, not
  // React state, since this updates every frame.
  const phaseRef = useRef<Phase>("dispersing");
  const phaseElapsedRef = useRef(0);
  const shapeIndexRef = useRef(0);
  const lastReportedRef = useRef("");
  const autoCycleAdvanceRef = useRef(false);

  useEffect(() => {
    const noisePos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = NOISE_RADIUS_MIN + Math.random() * NOISE_RADIUS_SPREAD;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      noisePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      noisePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7 + 0.3;
      noisePos[i * 3 + 2] = r * Math.cos(phi) * 0.8;
    }

    const delays = new Float32Array(count);
    for (let i = 0; i < count; i++) delays[i] = Math.random();

    // per-point jitter, either from the pipeline (4th float per point) or
    // generated here as a fallback if a shape set is missing it
    const jitter = shapes[0]?.jitter ?? new Float32Array(count).map(() => Math.random());

    const currentPos = new Float32Array(noisePos);
    const sourcePos = new Float32Array(noisePos);

    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) sizes[i] = 0.05 + jitter[i] * 0.03;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(currentPos, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    dataRef.current = {
      geometry,
      noisePos,
      currentPos,
      sourcePos,
      delays,
      jitter,
    };

    if (pointsRef.current) {
      pointsRef.current.geometry = geometry;
    }

    phaseRef.current = "dispersing";
    phaseElapsedRef.current = DISPERSE_DURATION; // start already "at noise"
    shapeIndexRef.current = 0;

    return () => {
      geometry.dispose();
      dataRef.current = null;
    };
  }, [count, shapes]);

  useFrame((_, delta) => {
    const data = dataRef.current;
    if (!data || !shapes.length) return;

    const { geometry, noisePos, currentPos, sourcePos, delays } = data;

    // ---- decide phase transitions ----
    const wantsShape = activeIndex !== null;

    if (wantsShape && (phaseRef.current === "dispersing" || shapeIndexRef.current !== activeIndex)) {
      // (re)target: snapshot wherever points currently are and assemble
      // toward the requested shape from there — no popping.
      sourcePos.set(currentPos);
      shapeIndexRef.current = activeIndex as number;
      phaseRef.current = "assembling";
      phaseElapsedRef.current = 0;
    } else if (!wantsShape && phaseRef.current === "holding" && !autoCycleAdvanceRef.current) {
      // manual selection was cleared -> disperse, then resume auto-cycling
      sourcePos.set(currentPos);
      phaseRef.current = "dispersing";
      phaseElapsedRef.current = 0;
    }

    phaseElapsedRef.current += delta;

    if (phaseRef.current === "assembling" && phaseElapsedRef.current >= ASSEMBLE_DURATION) {
      phaseRef.current = "holding";
      phaseElapsedRef.current = 0;
    } else if (
      phaseRef.current === "holding" &&
      !wantsShape &&
      phaseElapsedRef.current >= AUTO_HOLD_DURATION
    ) {
      sourcePos.set(currentPos);
      phaseRef.current = "dispersing";
      phaseElapsedRef.current = 0;
      autoCycleAdvanceRef.current = true;
    } else if (phaseRef.current === "dispersing" && phaseElapsedRef.current >= DISPERSE_DURATION) {
      if (autoCycleAdvanceRef.current || (!wantsShape && shapes.length > 0)) {
        shapeIndexRef.current = (shapeIndexRef.current + 1) % shapes.length;
        sourcePos.set(noisePos);
        phaseRef.current = "assembling";
        phaseElapsedRef.current = 0;
        autoCycleAdvanceRef.current = false;
      }
    }

    // ---- report phase to parent for UI (legend/status text) ----
    const key = `${shapeIndexRef.current}-${phaseRef.current}`;
    if (key !== lastReportedRef.current) {
      lastReportedRef.current = key;
      onPhaseChange?.(shapeIndexRef.current, phaseRef.current);
    }

    // ---- write positions/colors for this frame ----
    const duration = phaseRef.current === "assembling" ? ASSEMBLE_DURATION : DISPERSE_DURATION;
    const rawT = Math.min(1, phaseElapsedRef.current / duration);
    const target =
      phaseRef.current === "dispersing" ? noisePos : shapes[shapeIndexRef.current].positions;

    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      let p: number;
      if (phaseRef.current === "holding") {
        p = 1;
      } else {
        const start = delays[i] * STAGGER;
        const local = Math.min(1, Math.max(0, (rawT - start) / (1 - STAGGER)));
        p = easeInOutCubic(local);
      }

      const ix = i * 3;
      currentPos[ix] = sourcePos[ix] + (target[ix] - sourcePos[ix]) * p;
      currentPos[ix + 1] = sourcePos[ix + 1] + (target[ix + 1] - sourcePos[ix + 1]) * p;
      currentPos[ix + 2] = sourcePos[ix + 2] + (target[ix + 2] - sourcePos[ix + 2]) * p;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <shaderMaterial
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}