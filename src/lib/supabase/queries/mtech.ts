import { supabase } from '@/lib/supabase/client';
import type { MtechSection, MtechCreditCategory, MtechCourse, MtechCard } from '@/types/mtech';


export async function getMtechSections(): Promise<MtechSection[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('mtech_sections')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching mtech sections:', error);
    return [];
  }
  return (data ?? []) as MtechSection[];
}

export async function getMtechCreditCategories(): Promise<MtechCreditCategory[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('mtech_credit_categories')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching mtech credit categories:', error);
    return [];
  }
  return (data ?? []) as MtechCreditCategory[];
}

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

export async function getMtechSpecializations(): Promise<MtechCard[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('mtech_specializations')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching mtech specializations:', error);
    return [];
  }
  return (data ?? []) as MtechCard[];
}
