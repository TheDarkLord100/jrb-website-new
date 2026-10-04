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

// ---- Admin: managing the links themselves --------------------------------

export type ThemeFacultyLink = { theme_slug: string; person_id: string };
export type ThemeLabLink = { theme_slug: string; lab_id: string };

const NOT_CONFIGURED =
  'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.';

// Every faculty and lab link across all themes, for the admin grid.
export async function getAllThemeLinks(): Promise<{
  faculty: ThemeFacultyLink[];
  labs: ThemeLabLink[];
}> {
  if (!supabase) return { faculty: [], labs: [] };

  const [faculty, labs] = await Promise.all([
    supabase.from('theme_faculty').select('theme_slug, person_id'),
    supabase.from('theme_labs').select('theme_slug, lab_id'),
  ]);

  if (faculty.error) console.error('Error fetching theme faculty links:', faculty.error);
  if (labs.error) console.error('Error fetching theme lab links:', labs.error);
  if (faculty.error || labs.error) throw new Error('Failed to load theme links');

  return {
    faculty: (faculty.data ?? []) as ThemeFacultyLink[],
    labs: (labs.data ?? []) as ThemeLabLink[],
  };
}

// Inserts or removes one link. A delete that RLS blocks doesn't error -- it
// just removes nothing -- so deletes ask for the removed row back and treat
// "nothing removed" as a failure, rather than reporting success while the
// link quietly stays.
async function setLink(
  table: 'theme_faculty' | 'theme_labs',
  match: Record<string, string>,
  linked: boolean
): Promise<boolean> {
  if (!supabase) {
    console.error(NOT_CONFIGURED);
    return false;
  }

  if (linked) {
    const { error } = await supabase.from(table).insert(match);
    if (error) {
      console.error(`Error linking in ${table}:`, error);
      return false;
    }
    return true;
  }

  const { data, error } = await supabase.from(table).delete().match(match).select('theme_slug');
  if (error) {
    console.error(`Error unlinking in ${table}:`, error);
    return false;
  }
  if (!data || data.length === 0) {
    console.error(`Nothing removed from ${table} -- check its delete policy.`, match);
    return false;
  }
  return true;
}

export function setThemeFacultyLink(link: ThemeFacultyLink, linked: boolean): Promise<boolean> {
  return setLink('theme_faculty', link, linked);
}

export function setThemeLabLink(link: ThemeLabLink, linked: boolean): Promise<boolean> {
  return setLink('theme_labs', link, linked);
}