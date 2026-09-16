'use client';

import { useEffect, useState } from 'react';
import { getAllMtechBasketCourses } from '@/lib/supabase/queries';
import type { MtechBasketCourseRow } from '@/types/mtech';

export function useMtechBasketCourses(initialItems: MtechBasketCourseRow[] = []) {
  const [items, setItems] = useState<MtechBasketCourseRow[] | null>(
    initialItems.length > 0 ? initialItems : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAllMtechBasketCourses()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load basket courses');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, error };
}