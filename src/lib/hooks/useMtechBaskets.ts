'use client';

import { useEffect, useState } from 'react';
import { getMtechBaskets } from '@/lib/supabase/queries';
import type { MtechBasket } from '@/types/mtech';

export function useMtechBaskets(initialItems: MtechBasket[] = []) {
  const [items, setItems] = useState<MtechBasket[] | null>(
    initialItems.length > 0 ? initialItems : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getMtechBaskets()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load baskets');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, error };
}