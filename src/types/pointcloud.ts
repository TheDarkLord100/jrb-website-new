// Matches the manifest.json produced by tools/pointcloud-pipeline/generate_pointcloud.py
export type PointCloudManifestShape = {
  name: string;
  count: number;
  bin_file: string;
  bin_bytes?: number;
  original_min: [number, number, number];
  original_max: [number, number, number];
  original_diagonal: number;
  scale_applied: number;
};

export type PointCloudManifest = {
  count: number;
  floats_per_point: number;
  layout: string[]; // ["x", "y", "z", "jitter"]
  target_size: number;
  shapes: PointCloudManifestShape[];
};

// Loaded, parsed shape ready to feed into the Points geometry.
export type LoadedShape = {
  name: string;
  positions: Float32Array; // length = count * 3
  jitter: Float32Array; // length = count
};