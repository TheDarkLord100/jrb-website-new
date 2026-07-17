"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import { usePointCloudShapes } from "@/lib/usePointCloudShapes";
import PointCloudField from "@/components/sections/hero/PointCloudField";
import GridFloor from "@/components/sections/hero/GridFloor";

export default function HeroPointCloud() {
  const { count, shapes, error } = usePointCloudShapes();
  const [hasInteracted, setHasInteracted] = useState(false);

  // Horizontal placement on screen is controlled by the container's CSS
  // position/width below (right-aligned, narrower than the full section),
  // NOT by this 3D offset — since OrbitControls' target tracks the group,
  // the camera re-centers on it regardless of world position, and the
  // canvas previously spanned the full section width anyway. Keep the
  // group at the origin of its own (now right-aligned) viewport.
  const groupPosition: [number, number, number] = [0, 0, 0];

  // Isometric-style camera: elevated ~30° above horizontal and rotated ~30°
  // around the target, rather than a flat, straight-on view. Computed as an
  // offset from the target (groupPosition) using spherical coordinates.
  const DISTANCE = 11;
  const ELEVATION_DEG = 30;
  const AZIMUTH_DEG = 30;
  const elevationRad = (ELEVATION_DEG * Math.PI) / 180;
  const azimuthRad = (AZIMUTH_DEG * Math.PI) / 180;
  const horizontalDist = DISTANCE * Math.cos(elevationRad);
  const cameraOffset: [number, number, number] = [
    horizontalDist * Math.sin(azimuthRad),
    DISTANCE * Math.sin(elevationRad),
    horizontalDist * Math.cos(azimuthRad),
  ];
  const cameraPosition: [number, number, number] = [
    groupPosition[0] + cameraOffset[0],
    groupPosition[1] + cameraOffset[1],
    groupPosition[2] + cameraOffset[2],
  ];

  // OrbitControls' polar angle is measured from the +Y axis (90° = level
  // with the target, smaller = looking down from above). Center the
  // drag range on the isometric elevation instead of a horizontal view.
  const polarAngleCenter = ((90 - ELEVATION_DEG) * Math.PI) / 180;
  const polarAngleSpread = 0.32;

  return (
    <div className="relative h-[55vh] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[62%]">
      {shapes && count && (
        <Canvas
          camera={{ position: cameraPosition, fov: 45 }}
          onPointerDown={() => setHasInteracted(true)}
        >
          <group position={groupPosition}>
            <PointCloudField shapes={shapes} count={count} activeIndex={null} />
            <GridFloor />
          </group>
          <OrbitControls
            target={groupPosition}
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.45}
            rotateSpeed={0.5}
            enableDamping
            dampingFactor={0.08}
            minPolarAngle={polarAngleCenter - polarAngleSpread}
            maxPolarAngle={polarAngleCenter + polarAngleSpread}
          />
        </Canvas>
      )}

      {error && (
        <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
          Couldn't load point cloud data.
        </div>
      )}

      {/* left-side scrim so the mission text stays legible where this box
          overlaps the text column — desktop only, since on mobile the
          canvas sits below the text, not behind it */}
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[30%] bg-gradient-to-r from-[#001A23] via-[#001A23]/40 to-transparent lg:block" />

      {/* drag hint, fades out after first interaction */}
      <div
        className={`pointer-events-none absolute right-6 bottom-6 text-[10px] font-medium tracking-widest text-white/30 uppercase transition-opacity duration-700 ${
          hasInteracted ? "opacity-0" : "opacity-100"
        }`}
      >
        Drag to rotate
      </div>
    </div>
  );
}