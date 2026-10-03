'use client';

import { useEffect, useState } from 'react';
import { getAllProjects } from '@/lib/supabase/queries';
import type { Project } from '@/types/project';

// Also returns setItems so the admin panel can apply its own creates/edits/
// deletes locally instead of refetching or mirroring into a second state.
export function useAllProjects() {
  const [items, setItems] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAllProjects()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load projects');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, setItems, error };
}