// The four research themes, in the order the public site presents them.
// There's no themes table yet -- these slugs must match the theme_slug
// check constraint on `projects`, `theme_faculty` and `theme_labs`, so
// adding or renaming a theme means updating all three constraints and this
// list together.
export const RESEARCH_THEMES = [
  {
    slug: 'human-robotics',
    label: 'Human-Centred and Assistive Robotics',
    shortLabel: 'Human-Centred',
  },
  {
    slug: 'soft-bio-robotics',
    label: 'Soft, Compliant and Bio-Inspired Robotic Systems',
    shortLabel: 'Soft & Bio-Inspired',
  },
  {
    slug: 'field-robotics',
    label: 'Autonomous Field Robotics',
    shortLabel: 'Field Robotics',
  },
  {
    slug: 'cross-cutting',
    label: 'Embodied Intelligence, Learning and Control',
    shortLabel: 'Cross-Cutting',
  },
] as const;

export type ThemeSlug = (typeof RESEARCH_THEMES)[number]['slug'];

export function getTheme(slug: string) {
  return RESEARCH_THEMES.find((t) => t.slug === slug) ?? null;
}

// Position in RESEARCH_THEMES, for sorting by theme in site order rather
// than alphabetically. Unknown slugs sort last.
export function themeRank(slug: string): number {
  const idx = RESEARCH_THEMES.findIndex((t) => t.slug === slug);
  return idx === -1 ? RESEARCH_THEMES.length : idx;
}