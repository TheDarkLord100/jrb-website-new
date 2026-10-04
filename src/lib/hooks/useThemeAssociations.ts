'use client';

import { useEffect, useState } from 'react';
import {
  getThemeFaculty,
  getThemeLabs,
  getThemeProjects,
  getThemePublications,
} from '@/lib/supabase/queries';
import type { Person } from '@/types/person';
import type { Lab } from '@/types/lab';
import type { Project } from '@/types/project';
import type { Publication } from '@/types/publication';

export type ThemeAssociations = {
  faculty: Person[];
  labs: Lab[];
  projects: Project[];
  publications: Publication[];
};

export function useThemeAssociations(
  themeSlug: string,
  initialData: ThemeAssociations | null = null
) {
  const [data, setData] = useState<ThemeAssociations | null>(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getThemeFaculty(themeSlug),
      getThemeLabs(themeSlug),
      getThemeProjects(themeSlug),
      getThemePublications(themeSlug),
    ])
      .then(([faculty, labs, projects, publications]) => {
        if (!cancelled) setData({ faculty, labs, projects, publications });
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load theme data');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [themeSlug]);

  return { data, error };
}