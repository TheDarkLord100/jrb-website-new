'use client';

import { useEffect, useState } from 'react';
import { getAllAnnouncements } from '@/lib/supabase/queries';
import type { Announcement } from '@/types/announcement';

export function useAnnouncements(initialItems: Announcement[] = []) {
  const [items, setItems] = useState<Announcement[] | null>(
    initialItems.length > 0 ? initialItems : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAllAnnouncements()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load announcements');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, error };
}
