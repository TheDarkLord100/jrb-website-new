'use client';

import { useEffect, useState } from 'react';
import { getMtechSections } from '@/lib/supabase/queries';
import type { MtechSection } from '@/types/mtech';

export function useMtechSections(initialItems: MtechSection[] = []) {
  const [items, setItems] = useState<MtechSection[] | null>(
    initialItems.length > 0 ? initialItems : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getMtechSections()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load sections');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, error };
}
