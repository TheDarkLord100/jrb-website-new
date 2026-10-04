import { supabase } from '@/lib/supabase/client';
import type { PeopleTag, PeopleTagInput } from '@/types/peopleTag';

const NOT_CONFIGURED =
  'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.';

export async function getPeopleTags(): Promise<PeopleTag[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('people_tags')
    .select('*')
    .order('display_order', { ascending: true })
    .order('label', { ascending: true });
  if (error) {
    console.error('Error fetching people tags:', error);
    return [];
  }
  return (data ?? []) as PeopleTag[];
}

export async function createPeopleTag(payload: PeopleTagInput): Promise<PeopleTag | null> {
  if (!supabase) {
    console.error(NOT_CONFIGURED);
    return null;
  }

  const { data, error } = await supabase.from('people_tags').insert(payload).select().single();

  if (error) {
    console.error('Error creating people tag:', error);
    return null;
  }
  return data as PeopleTag;
}

export async function updatePeopleTag(
  id: string,
  payload: Partial<PeopleTagInput>
): Promise<PeopleTag | null> {
  if (!supabase) {
    console.error(NOT_CONFIGURED);
    return null;
  }

  const { data, error } = await supabase
    .from('people_tags')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating people tag:', error);
    return null;
  }
  return data as PeopleTag;
}

export async function deletePeopleTag(id: string): Promise<boolean> {
  if (!supabase) {
    console.error(NOT_CONFIGURED);
    return false;
  }

  const { error } = await supabase.from('people_tags').delete().eq('id', id);

  if (error) {
    console.error('Error deleting people tag:', error);
    return false;
  }
  return true;
}