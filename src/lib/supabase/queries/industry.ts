import { supabase } from '@/lib/supabase/client';
import type { IndustryTier, Collaborator } from '@/types/industry';

export async function getIndustryTiers(): Promise<IndustryTier[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('industry_tiers')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching industry tiers:', error);
    return [];
  }
  return (data ?? []) as IndustryTier[];
}

export async function getCollaborators(): Promise<Collaborator[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('collaborators')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching collaborators:', error);
    return [];
  }
  return (data ?? []) as Collaborator[];
}
