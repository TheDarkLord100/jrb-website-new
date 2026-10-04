'use client';

import { useEffect, useState } from 'react';
import { getPeople } from '@/lib/supabase/queries';
import type { Person } from '@/types/person';

// Also returns setPeople so the admin panel can apply its own edits locally
// instead of refetching. The public directory just ignores it.
export function usePeople(initialPeople: Person[] = []) {
  const [people, setPeople] = useState<Person[] | null>(
    initialPeople.length > 0 ? initialPeople : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getPeople()
      .then((data) => {
        if (!cancelled) setPeople(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load people');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { people, setPeople, error };
}