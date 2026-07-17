// Maps each point-cloud shape (by its `name` in manifest.json) to what's
// shown in the hero legend/caption. Add an entry here whenever you add a
// new shape to the pipeline output — if a shape has no entry, its name is
// shown as a fallback (see HeroPointCloud.tsx).
export type ShapeContent = {
  label: string; // short object name, e.g. "Quadcopter"
  vertical: string; // which research vertical it represents
  href: string; // where clicking it should take the visitor
};

export const SHAPE_CONTENT: Record<string, ShapeContent> = {
  drone: {
    label: "Quadcopter",
    vertical: "Autonomous Field Robotics",
    href: "/research/themes/field-robotics",
  },
  kuka: {
    label: "Robotic Arm",
    vertical: "Manipulation & Control",
    href: "/research/themes/human-robotics",
  },
  amr: {
    label: "Autonomous Mobile Robot",
    vertical: "Autonomous Field Robotics",
    href: "/research/themes/field-robotics",
  },
};