import { supabase } from '@/lib/supabase/client';
import type { MtechCourse } from '@/types/mtech';

export async function getMtechCourses(): Promise<MtechCourse[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('mtech_courses')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching mtech courses:', error);
    return [];
  }
  return (data ?? []) as MtechCourse[];
}

export async function createMtechCourse(
  payload: Omit<MtechCourse, 'id'>
): Promise<MtechCourse | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase.from('mtech_courses').insert(payload).select().single();

  if (error) {
    console.error('Error creating mtech course:', error);
    return null;
  }
  return data as MtechCourse;
}

export async function updateMtechCourse(
  id: string,
  payload: Partial<Omit<MtechCourse, 'id'>>
): Promise<MtechCourse | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('mtech_courses')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating mtech course:', error);
    return null;
  }
  return data as MtechCourse;
}

export async function deleteMtechCourse(id: string): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase.from('mtech_courses').delete().eq('id', id);

  if (error) {
    console.error('Error deleting mtech course:', error);
    return false;
  }
  return true;
}