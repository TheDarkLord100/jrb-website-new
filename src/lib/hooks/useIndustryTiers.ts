'use client';

import { useEffect, useState } from 'react';
import { getIndustryTiers } from '@/lib/supabase/queries';
import type { IndustryTier } from '@/types/industry';

export function useIndustryTiers(initialTiers: IndustryTier[] = []) {
  const [tiers, setTiers] = useState<IndustryTier[] | null>(
    initialTiers.length > 0 ? initialTiers : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getIndustryTiers()
      .then((data) => {
        if (!cancelled) setTiers(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load tiers');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { tiers, error };
}
