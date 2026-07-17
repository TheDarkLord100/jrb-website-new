"use client";

import { Grid } from "@react-three/drei";

/**
 * A restrained reference grid beneath the point cloud — deliberately styled
 * like a plotting/visualization tool (Rviz, MATLAB) rather than a game
 * environment. Fills otherwise-empty space and reframes the whole scene as
 * "a data visualization" rather than a decorative effect.
 */
export default function GridFloor() {
  return (
    <Grid
      position={[0, -2.6, 0]}
      args={[20, 20]}
      cellSize={0.5}
      cellThickness={0.5}
      cellColor="#1c3540"
      sectionSize={2.5}
      sectionThickness={0.8}
      sectionColor="#2a4a58"
      followCamera={false}
      infiniteGrid
    />
  );
}