import type { ThemeSlug } from '@/lib/researchThemes';

export type ProjectMediaType = 'image' | 'video';

export type Project = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  theme_slug: ThemeSlug;
  // media_url and media_type are always both set or both null -- enforced
  // by the projects_media_pair_check constraint.
  media_url: string | null;
  media_type: ProjectMediaType | null;
  media_alt: string | null;
  // Set only for projects imported from GitHub -- its presence is what
  // marks a project as "from GitHub" vs added manually.
  github_repo_id: number | null;
  github_url: string | null;
  is_featured: boolean;
  featured_order: number | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

// The writable columns -- id and the timestamps are owned by the database.
export type ProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at'>;