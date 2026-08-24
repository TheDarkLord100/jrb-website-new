'use client';

import { useEffect, useRef, useState } from 'react';
import { getAnnouncementsByType } from '@/lib/supabase/queries';
import type { Announcement } from '@/types/announcement';

export function useAnnouncementsByType(
  type: Announcement['type'],
  initialItems: Announcement[] = []
) {
  const [items, setItems] = useState<Announcement[] | null>(
    initialItems.length > 0 ? initialItems : null
  );
  const [error, setError] = useState<string | null>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    let cancelled = false;

    // Skip clearing to null on the very first run when we already have
    // seeded data for this type — only reset on later type changes.
    if (!isFirstRun.current) {
      setItems(null);
      setError(null);
    }
    isFirstRun.current = false;

    getAnnouncementsByType(type)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load announcements');
      });

    return () => {
      cancelled = true;
    };
  }, [type]);

  return { items, error };
}