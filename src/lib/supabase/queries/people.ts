import { supabase } from '@/lib/supabase/client';
import type { Person, PersonInput } from '@/types/person';

export async function getPeople(): Promise<Person[]> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return [];
  }

  const { data, error } = await supabase.from('people').select('*').order('name');

  if (error) {
    console.error('Error fetching people:', error);
    return [];
  }

  return (data ?? []) as Person[];
}

const NOT_CONFIGURED =
  'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.';

export async function createPerson(payload: PersonInput): Promise<Person | null> {
  if (!supabase) {
    console.error(NOT_CONFIGURED);
    return null;
  }

  const { data, error } = await supabase.from('people').insert(payload).select().single();

  if (error) {
    console.error('Error creating person:', error);
    return null;
  }
  return data as Person;
}

export async function updatePerson(
  id: string,
  payload: Partial<PersonInput>
): Promise<Person | null> {
  if (!supabase) {
    console.error(NOT_CONFIGURED);
    return null;
  }

  const { data, error } = await supabase
    .from('people')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating person:', error);
    return null;
  }
  return data as Person;
}

// Deleting a faculty member also removes their theme_faculty rows (the
// foreign key cascades), so they drop off every research theme page.
export async function deletePerson(id: string): Promise<boolean> {
  if (!supabase) {
    console.error(NOT_CONFIGURED);
    return false;
  }

  const { error } = await supabase.from('people').delete().eq('id', id);

  if (error) {
    console.error('Error deleting person:', error);
    return false;
  }
  return true;
}

// Moves every student in a batch to alumni in one UPDATE statement, so it
// either moves the whole batch or none of it. Their `year` is untouched,
// which is what files them under the same batch on the Alumni tab.
// Returns the ids that moved, or null on failure.
export async function promoteBatchToAlumni(batch: string): Promise<string[] | null> {
  if (!supabase) {
    console.error(NOT_CONFIGURED);
    return null;
  }

  const { data, error } = await supabase
    .from('people')
    .update({ role: 'alumni' })
    .eq('role', 'student')
    .eq('year', batch)
    .select('id');

  if (error) {
    console.error('Error promoting batch to alumni:', error);
    return null;
  }
  return (data ?? []).map((row) => row.id as string);
}