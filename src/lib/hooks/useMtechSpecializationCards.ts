'use client';

import { useEffect, useState } from 'react';
import { getMtechSpecializationCards } from '@/lib/supabase/queries';
import type { MtechCard } from '@/types/mtech';

export function useMtechSpecializationCards(initialItems: MtechCard[] = []) {
  const [items, setItems] = useState<MtechCard[] | null>(
    initialItems.length > 0 ? initialItems : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getMtechSpecializationCards()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load specializations');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, error };
}
