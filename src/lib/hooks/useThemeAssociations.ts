'use client';

import { useEffect, useState } from 'react';
import { getThemeFaculty, getThemeLabs, getThemeProjects } from '@/lib/supabase/queries';
import type { Person } from '@/types/person';
import type { Lab } from '@/types/lab';
import type { Project } from '@/types/project';

export type ThemeAssociations = {
  faculty: Person[];
  labs: Lab[];
  projects: Project[];
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
    ])
      .then(([faculty, labs, projects]) => {
        if (!cancelled) setData({ faculty, labs, projects });
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