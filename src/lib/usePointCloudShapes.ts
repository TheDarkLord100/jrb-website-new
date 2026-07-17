"use client";

import { useEffect, useState } from "react";
import type { LoadedShape, PointCloudManifest } from "@/types/pointcloud";

async function loadShape(shape: { name: string; bin_file: string }, count: number): Promise<LoadedShape> {
  const res = await fetch(`/pointclouds/${shape.bin_file}`);
  const buf = await res.arrayBuffer();
  const floats = new Float32Array(buf);

  const positions = new Float32Array(count * 3);
  const jitter = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = floats[i * 4];
    positions[i * 3 + 1] = floats[i * 4 + 1];
    positions[i * 3 + 2] = floats[i * 4 + 2];
    jitter[i] = floats[i * 4 + 3];
  }
  return { name: shape.name, positions, jitter };
}

/** Fetches /public/pointclouds/manifest.json + each shape's .bin file. */
export function usePointCloudShapes() {
  const [count, setCount] = useState<number | null>(null);
  const [shapes, setShapes] = useState<LoadedShape[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/pointclouds/manifest.json");
        if (!res.ok) throw new Error("manifest.json not found");
        const manifest: PointCloudManifest = await res.json();

        const loaded = await Promise.all(
          manifest.shapes.map((s) => loadShape(s, manifest.count))
        );

        if (!cancelled) {
          setCount(manifest.count);
          setShapes(loaded);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load point clouds");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { count, shapes, error };
}