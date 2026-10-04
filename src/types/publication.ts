import type { ThemeSlug } from '@/lib/researchThemes';

// Mirrors the `publications` table.
export type Publication = {
  id: string;
  title: string;
  authors: string | null; // display string, e.g. "A. Kumar, S. Bhasin"
  venue: string | null;
  year: number | null;
  doi: string | null; // bare DOI, e.g. "10.1109/TRO.2024.123"
  url: string | null;
  cited_by_count: number | null; // snapshot from import time
  theme_slug: ThemeSlug;
  openalex_id: string | null; // "W…" -- set only for imported papers
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // Centre faculty linked through publication_people.
  person_ids: string[];
};

export type PublicationInput = Omit<
  Publication,
  'id' | 'created_at' | 'updated_at' | 'person_ids'
>;