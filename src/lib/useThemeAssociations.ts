"use client";

import { useEffect, useState } from "react";
import { getThemeFaculty, getThemeLabs } from "@/lib/supabase/queries";
import type { Person } from "@/types/person";
import type { Lab } from "@/types/lab";

type ThemeAssociations = {
  faculty: Person[];
  labs: Lab[];
};

export function useThemeAssociations(themeSlug: string) {
  const [data, setData] = useState<ThemeAssociations | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getThemeFaculty(themeSlug), getThemeLabs(themeSlug)])
      .then(([faculty, labs]) => {
        if (!cancelled) setData({ faculty, labs });
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load theme data");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [themeSlug]);

  return { data, error };
}