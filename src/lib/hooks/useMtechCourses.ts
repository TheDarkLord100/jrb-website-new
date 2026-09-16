'use client';

import { useEffect, useState } from 'react';
import { getMtechCourses } from '@/lib/supabase/queries';
import type { MtechCourse } from '@/types/mtech';

export function useMtechCourses(initialItems: MtechCourse[] = []) {
  const [items, setItems] = useState<MtechCourse[] | null>(
    initialItems.length > 0 ? initialItems : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getMtechCourses()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load courses');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, error };
}