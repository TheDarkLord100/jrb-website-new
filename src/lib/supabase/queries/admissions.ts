import { supabase } from '@/lib/supabase/client';
import type { AdmissionSection, AdmissionLink } from '@/types/admissions';

export async function getAdmissionSections(): Promise<AdmissionSection[]> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return [];
  }

  const { data, error } = await supabase
    .from('admission_sections')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching admission sections:', error);
    return [];
  }

  return (data ?? []) as AdmissionSection[];
}

export async function getAdmissionLinks(): Promise<AdmissionLink[]> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return [];
  }

  const { data, error } = await supabase
    .from('admission_links')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching admission links:', error);
    return [];
  }

  return (data ?? []) as AdmissionLink[];
}
