import { supabase } from '@/lib/supabase/client';
import type { IdsrSection, IdsrCurriculumRow, IdsrCoreCourse, IdsrElective } from '@/types/idsr';

export async function getIdsrSections(): Promise<IdsrSection[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('idsr_sections')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching IDSR sections:', error);
    return [];
  }
  return (data ?? []) as IdsrSection[];
}

export async function getIdsrCurriculumStructure(): Promise<IdsrCurriculumRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('idsr_curriculum_structure')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching IDSR curriculum structure:', error);
    return [];
  }
  return (data ?? []) as IdsrCurriculumRow[];
}

export async function getIdsrCoreCourses(): Promise<IdsrCoreCourse[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('idsr_core_courses')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching IDSR core courses:', error);
    return [];
  }
  return (data ?? []) as IdsrCoreCourse[];
}

export async function getIdsrElectives(): Promise<IdsrElective[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('idsr_electives')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching IDSR electives:', error);
    return [];
  }
  return (data ?? []) as IdsrElective[];
}
