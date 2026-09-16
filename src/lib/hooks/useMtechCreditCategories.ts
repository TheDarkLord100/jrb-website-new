'use client';

import { useEffect, useState } from 'react';
import { getMtechCreditCategories } from '@/lib/supabase/queries';
import type { MtechCreditCategory } from '@/types/mtech';

export function useMtechCreditCategories(initialItems: MtechCreditCategory[] = []) {
  const [items, setItems] = useState<MtechCreditCategory[] | null>(
    initialItems.length > 0 ? initialItems : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getMtechCreditCategories()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load credit categories');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, error };
}
