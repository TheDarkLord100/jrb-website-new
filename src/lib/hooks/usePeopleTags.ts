'use client';

import { useEffect, useState } from 'react';
import { getPeopleTags } from '@/lib/supabase/queries';
import type { PeopleTag } from '@/types/peopleTag';

// Unlike most hooks here, this starts from the seeded list even when it's
// empty: no tags is a perfectly valid state (the filter row just hides),
// and showing a skeleton for it would be pointless. Also returns setTags so
// the admin panel can apply its own edits locally.
export function usePeopleTags(initialTags: PeopleTag[] = []) {
  const [tags, setTags] = useState<PeopleTag[]>(initialTags);

  useEffect(() => {
    let cancelled = false;

    getPeopleTags().then((data) => {
      if (!cancelled) setTags(data);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { tags, setTags };
}