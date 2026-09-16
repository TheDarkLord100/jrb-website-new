import { supabase } from '@/lib/supabase/client';
import type { MtechSection, MtechCreditCategory } from '@/types/mtech';

// --- Sections ---

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

export async function createMtechSection(
  payload: Omit<MtechSection, 'id'>
): Promise<MtechSection | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase.from('mtech_sections').insert(payload).select().single();

  if (error) {
    console.error('Error creating mtech section:', error);
    return null;
  }
  return data as MtechSection;
}

export async function updateMtechSection(
  id: string,
  payload: Partial<Omit<MtechSection, 'id'>>
): Promise<MtechSection | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('mtech_sections')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating mtech section:', error);
    return null;
  }
  return data as MtechSection;
}

export async function deleteMtechSection(id: string): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase.from('mtech_sections').delete().eq('id', id);

  if (error) {
    console.error('Error deleting mtech section:', error);
    return false;
  }
  return true;
}

// --- Credit categories ---

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

export async function createMtechCreditCategory(
  payload: Omit<MtechCreditCategory, 'id'>
): Promise<MtechCreditCategory | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('mtech_credit_categories')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error creating mtech credit category:', error);
    return null;
  }
  return data as MtechCreditCategory;
}

export async function updateMtechCreditCategory(
  id: string,
  payload: Partial<Omit<MtechCreditCategory, 'id'>>
): Promise<MtechCreditCategory | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('mtech_credit_categories')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating mtech credit category:', error);
    return null;
  }
  return data as MtechCreditCategory;
}

export async function deleteMtechCreditCategory(id: string): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase.from('mtech_credit_categories').delete().eq('id', id);

  if (error) {
    console.error('Error deleting mtech credit category:', error);
    return false;
  }
  return true;
}