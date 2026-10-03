'use client';

import { useEffect, useState } from 'react';
import { getFeaturedProjects } from '@/lib/supabase/queries';
import type { Project } from '@/types/project';

export function useFeaturedProjects(initialItems: Project[] = []) {
  const [items, setItems] = useState<Project[] | null>(
    initialItems.length > 0 ? initialItems : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getFeaturedProjects()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load featured projects');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, error };
}