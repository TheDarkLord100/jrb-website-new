import {
  Users,
  Leaf,
  Factory,
  HeartPulse,
  Car,
  Briefcase,
  FlaskConical,
  Lightbulb,
  GraduationCap,
  Compass,
  Puzzle,
  Target,
  TrendingUp,
  Circle,
  type LucideIcon,
} from "lucide-react";

// Add an entry here whenever a new icon name is used in an `icon` column
// (mtech_specializations, mtech_career_pathways, industry_tiers, ...).
// Falls back to a plain circle so an unrecognized/typo'd name never
// crashes the page.
const ICONS: Record<string, LucideIcon> = {
  Users,
  Leaf,
  Factory,
  HeartPulse,
  Car,
  Briefcase,
  FlaskConical,
  Lightbulb,
  GraduationCap,
  Compass,
  Puzzle,
  Target,
  TrendingUp,
};

export function getLucideIcon(name: string): LucideIcon {
  return ICONS[name] ?? Circle;
}