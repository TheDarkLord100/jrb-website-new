"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { usePointCloudShapes } from "@/lib/usePointCloudShapes";

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

function FixedShape({ positions, jitter, count }: { positions: Float32Array; jitter: Float32Array; count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(0xffc94d) }, uOpacity: { value: 0.25 } }),
    []
  );

  useEffect(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) sizes[i] = 0.03 + jitter[i] * 0.015;
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    if (pointsRef.current) {
      pointsRef.current.geometry = geo;
    }

    return () => geo.dispose();
  }, [positions, jitter, count]);

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

/**
 * A small, always-assembled point cloud for a single shape — no assemble/
 * disperse cycle, just a gentle idle rotation. Deliberately sized and styled
 * as a subtle icon/badge (fills whatever small container it's given), not a
 * focal illustration — content around it should stay the visual priority.
 */
export default function StaticPointCloud({ shapeName }: { shapeName: string }) {
  const { shapes, count } = usePointCloudShapes();
  const shape = shapes?.find((s) => s.name === shapeName);

  // Same isometric framing as the Hero's point cloud: elevated ~30° above
  // horizontal and rotated ~30° around the target, instead of a flat,
  // straight-on view.
  const DISTANCE = 9;
  const ELEVATION_DEG = 30;
  const AZIMUTH_DEG = 30;
  const elevationRad = (ELEVATION_DEG * Math.PI) / 180;
  const azimuthRad = (AZIMUTH_DEG * Math.PI) / 180;
  const horizontalDist = DISTANCE * Math.cos(elevationRad);
  const cameraPosition: [number, number, number] = [
    horizontalDist * Math.sin(azimuthRad),
    DISTANCE * Math.sin(elevationRad),
    horizontalDist * Math.cos(azimuthRad),
  ];

  return (
    <div className="relative h-full w-full">
      {shape && count && (
        <Canvas
          camera={{ position: cameraPosition, fov: 45 }}
          gl={{ alpha: true }}
          style={{ background: "transparent" }}
        >
          <FixedShape positions={shape.positions} jitter={shape.jitter} count={count} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.2}
            enableDamping
            dampingFactor={0.08}
          />
        </Canvas>
      )}
    </div>
  );
}