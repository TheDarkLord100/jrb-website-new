'use client';

import { useEffect, useState } from 'react';
import {
  getMtechSections,
  getMtechCreditCategories,
  getMtechCourses,
  getMtechSpecializations,
} from '@/lib/supabase/queries';
import type { MtechSection, MtechCreditCategory, MtechCourse, MtechCard } from '@/types/mtech';

type MtechContent = {
  sections: MtechSection[];
  creditCategories: MtechCreditCategory[];
  courses: MtechCourse[];
  specializations: MtechCard[];
};

export function useMtechContent() {
  const [data, setData] = useState<MtechContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getMtechSections(),
      getMtechCreditCategories(),
      getMtechCourses(),
      getMtechSpecializations(),
    ])
      .then(([sections, creditCategories, courses, specializations]) => {
        if (!cancelled) {
          setData({ sections, creditCategories, courses, specializations });
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load page content');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error };
}
