import { supabase } from '@/lib/supabase/client';
import type { Lab } from '@/types/lab';

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

export type ThemeLabLink = { theme_slug: string; lab_id: string };

const NOT_CONFIGURED =
  'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.';

// Every lab link across all themes, for the admin grid.
export async function getAllThemeLabLinks(): Promise<ThemeLabLink[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.from('theme_labs').select('theme_slug, lab_id');
  if (error) {
    console.error('Error fetching theme lab links:', error);
    throw new Error('Failed to load theme links');
  }
  return (data ?? []) as ThemeLabLink[];
}

// Inserts or removes one link. A delete that RLS blocks doesn't error -- it
// just removes nothing -- so deletes ask for the removed row back and treat
// "nothing removed" as a failure, rather than reporting success while the
// link quietly stays.
export async function setThemeLabLink(link: ThemeLabLink, linked: boolean): Promise<boolean> {
  if (!supabase) {
    console.error(NOT_CONFIGURED);
    return false;
  }

  if (linked) {
    const { error } = await supabase.from('theme_labs').insert(link);
    if (error) {
      console.error('Error linking lab to theme:', error);
      return false;
    }
    return true;
  }

  const { data, error } = await supabase
    .from('theme_labs')
    .delete()
    .match(link)
    .select('theme_slug');
  if (error) {
    console.error('Error unlinking lab from theme:', error);
    return false;
  }
  if (!data || data.length === 0) {
    console.error('Nothing removed from theme_labs -- check its delete policy.', link);
    return false;
  }
  return true;
}
