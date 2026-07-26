import { supabase } from '@/lib/supabase/client';
import type { Person } from '@/types/person';
import type { Lab } from '@/types/lab';

// Faculty linked to a research theme via the theme_faculty junction table --
// sources the real, current `people` row (name, id, etc.) rather than a
// hardcoded name string that can drift out of sync.
type ThemeFacultyRow = { people: Person | null };

export async function getThemeFaculty(themeSlug: string): Promise<Person[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('theme_faculty')
    .select('people(*)')
    .eq('theme_slug', themeSlug);

  if (error) {
    console.error('Error fetching theme faculty:', error);
    return [];
  }

  return ((data ?? []) as unknown as ThemeFacultyRow[])
    .map((row) => row.people)
    .filter((p): p is Person => p !== null);
}

// Labs linked to a research theme via the theme_labs junction table.
type ThemeLabRow = { labs: Lab | null };

export async function getThemeLabs(themeSlug: string): Promise<Lab[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('theme_labs')
    .select('labs(*)')
    .eq('theme_slug', themeSlug);

  if (error) {
    console.error('Error fetching theme labs:', error);
    return [];
  }

  return ((data ?? []) as unknown as ThemeLabRow[])
    .map((row) => row.labs)
    .filter((l): l is Lab => l !== null);
}
