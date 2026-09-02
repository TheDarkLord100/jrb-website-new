'use client';

import { useEffect, useState } from 'react';
import { getCollaborators } from '@/lib/supabase/queries';
import type { Collaborator } from '@/types/industry';

export function useCollaborators(initialCollaborators: Collaborator[] = []) {
  const [collaborators, setCollaborators] = useState<Collaborator[] | null>(
    initialCollaborators.length > 0 ? initialCollaborators : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCollaborators()
      .then((data) => {
        if (!cancelled) setCollaborators(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load collaborators');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { collaborators, error };
}