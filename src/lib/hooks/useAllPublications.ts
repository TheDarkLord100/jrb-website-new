'use client';

import { useEffect, useState } from 'react';
import { getAllPublications } from '@/lib/supabase/queries';
import type { Publication } from '@/types/publication';

// Admin hook -- also returns setItems so the panel can apply its own
// creates/edits/deletes locally instead of refetching.
export function useAllPublications() {
  const [items, setItems] = useState<Publication[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAllPublications()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load publications');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, setItems, error };
}