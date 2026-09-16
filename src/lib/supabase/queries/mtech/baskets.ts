import { supabase } from '@/lib/supabase/client';
import type { MtechBasket, MtechBasketCourseRow } from '@/types/mtech';

// --- Baskets ---

export async function getMtechBaskets(): Promise<MtechBasket[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('mtech_baskets')
    .select('*')
    .order('name', { ascending: true, nullsFirst: false });
  if (error) {
    console.error('Error fetching mtech baskets:', error);
    return [];
  }
  return (data ?? []) as MtechBasket[];
}

export async function createMtechBasket(payload: {
  name: string | null;
}): Promise<MtechBasket | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase.from('mtech_baskets').insert(payload).select().single();

  if (error) {
    console.error('Error creating mtech basket:', error);
    return null;
  }
  return data as MtechBasket;
}

export async function updateMtechBasket(
  id: string,
  payload: { name: string | null }
): Promise<MtechBasket | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('mtech_baskets')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating mtech basket:', error);
    return null;
  }
  return data as MtechBasket;
}

// Deleting a basket cascades (ON DELETE CASCADE) to its mtech_basket_courses
// rows, and to any mtech_specialization_items / mtech_specialization_
// constraint_baskets rows that reference it -- it disappears from every
// specialization's requirement list and constraint sentence that used it.
export async function deleteMtechBasket(id: string): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase.from('mtech_baskets').delete().eq('id', id);

  if (error) {
    console.error('Error deleting mtech basket:', error);
    return false;
  }
  return true;
}

// --- Basket membership (mtech_basket_courses) ---

export async function getAllMtechBasketCourses(): Promise<MtechBasketCourseRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('mtech_basket_courses')
    .select('id, bucket_id, course_id, display_order, course:mtech_courses(*)')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching mtech basket courses:', error);
    return [];
  }
  return (data ?? []) as unknown as MtechBasketCourseRow[];
}

export async function addCourseToBasket(
  bucketId: string,
  courseId: string,
  displayOrder: number | null
): Promise<MtechBasketCourseRow | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('mtech_basket_courses')
    .insert({ bucket_id: bucketId, course_id: courseId, display_order: displayOrder })
    .select('id, bucket_id, course_id, display_order, course:mtech_courses(*)')
    .single();

  if (error) {
    console.error('Error adding course to basket:', error);
    return null;
  }
  return data as unknown as MtechBasketCourseRow;
}

export async function removeCourseFromBasket(rowId: string): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase.from('mtech_basket_courses').delete().eq('id', rowId);

  if (error) {
    console.error('Error removing course from basket:', error);
    return false;
  }
  return true;
}

export async function updateBasketCourseOrder(
  rowId: string,
  displayOrder: number
): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase
    .from('mtech_basket_courses')
    .update({ display_order: displayOrder })
    .eq('id', rowId);

  if (error) {
    console.error('Error reordering basket course:', error);
    return false;
  }
  return true;
}