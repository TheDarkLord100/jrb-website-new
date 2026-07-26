'use client';

import { useEffect, useState } from 'react';
import type { LoadedShape, PointCloudManifest } from '@/types/pointcloud';

async function loadShape(
  shape: { name: string; bin_file: string },
  count: number
): Promise<LoadedShape> {
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

type LoadedResult = { count: number; shapes: LoadedShape[] };

// Every StaticPointCloud/HeroPointCloud instance on a page (e.g. 4+ on
// /research/themes) would otherwise independently refetch the same
// manifest + .bin files. This cache is module-level (shared across every
// hook call in the app, not per-component), so the network work happens
// once per page load and every instance just awaits the same promise.
let cachedLoad: Promise<LoadedResult> | null = null;

function loadAllShapes(): Promise<LoadedResult> {
  if (!cachedLoad) {
    cachedLoad = (async () => {
      const res = await fetch('/pointclouds/manifest.json');
      if (!res.ok) throw new Error('manifest.json not found');
      const manifest: PointCloudManifest = await res.json();
      const shapes = await Promise.all(manifest.shapes.map((s) => loadShape(s, manifest.count)));
      return { count: manifest.count, shapes };
    })().catch((e) => {
      // Don't cache a rejected promise -- a transient network failure
      // shouldn't permanently break every future instance on the page.
      cachedLoad = null;
      throw e;
    });
  }
  return cachedLoad;
}

/** Fetches /public/pointclouds/manifest.json + each shape's .bin file (once per page, cached). */
export function usePointCloudShapes() {
  const [count, setCount] = useState<number | null>(null);
  const [shapes, setShapes] = useState<LoadedShape[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadAllShapes()
      .then((result) => {
        if (!cancelled) {
          setCount(result.count);
          setShapes(result.shapes);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load point clouds');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { count, shapes, error };
}
