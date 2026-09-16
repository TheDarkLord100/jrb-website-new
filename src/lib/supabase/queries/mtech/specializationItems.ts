import { supabase } from '@/lib/supabase/client';
import type { RawBasketCourseRow } from './_shared';
import type { MtechCourse, MtechBasket, MtechSpecializationItemRow } from '@/types/mtech';

type RawSpecializationItemAdminRow = {
  id: string;
  bucket_id: string | null;
  course_id: string | null;
  course: MtechCourse | null;
  basket: MtechBasket | null;
};

// Fully resolved, including each basket item's own member courses (a
// second hop, same as the public getMtechSpecializations() needs) --
// so the admin UI never has to piece this together from separately
// loaded catalogs.
export async function getSpecializationItemsAdmin(
  specializationId: string
): Promise<MtechSpecializationItemRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('mtech_specialization_items')
    .select(
      'id, bucket_id, course_id, display_order, course:mtech_courses(*), basket:mtech_baskets(*)'
    )
    .eq('specialization_id', specializationId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching specialization items:', error);
    return [];
  }

  const rows = (data ?? []) as unknown as RawSpecializationItemAdminRow[];
  const bucketIds = [...new Set(rows.map((r) => r.bucket_id).filter((id): id is string => !!id))];

  let coursesByBucket: Record<string, MtechCourse[]> = {};
  if (bucketIds.length > 0) {
    const { data: basketCourseRows, error: basketCoursesError } = await supabase
      .from('mtech_basket_courses')
      .select('bucket_id, display_order, course:mtech_courses(*)')
      .in('bucket_id', bucketIds)
      .order('display_order', { ascending: true });

    if (basketCoursesError) {
      console.error('Error fetching basket courses for specialization items:', basketCoursesError);
    }

    coursesByBucket = ((basketCourseRows ?? []) as unknown as RawBasketCourseRow[]).reduce(
      (acc, row) => {
        (acc[row.bucket_id] ??= []).push(row.course);
        return acc;
      },
      {} as Record<string, MtechCourse[]>
    );
  }

  return rows.reduce<MtechSpecializationItemRow[]>((acc, row) => {
    if (row.course_id && row.course) {
      acc.push({ id: row.id, kind: 'course', course: row.course });
    } else if (row.bucket_id && row.basket) {
      acc.push({
        id: row.id,
        kind: 'basket',
        basket: row.basket,
        courses: coursesByBucket[row.bucket_id] ?? [],
      });
    }
    return acc;
  }, []);
}

export async function addSpecializationCourseItem(
  specializationId: string,
  courseId: string,
  displayOrder: number
): Promise<{ id: string } | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('mtech_specialization_items')
    .insert({ specialization_id: specializationId, course_id: courseId, display_order: displayOrder })
    .select('id')
    .single();

  if (error) {
    console.error('Error adding course to specialization:', error);
    return null;
  }
  return data as { id: string };
}

export async function addSpecializationBasketItem(
  specializationId: string,
  bucketId: string,
  displayOrder: number
): Promise<{ id: string } | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('mtech_specialization_items')
    .insert({ specialization_id: specializationId, bucket_id: bucketId, display_order: displayOrder })
    .select('id')
    .single();

  if (error) {
    console.error('Error adding basket to specialization:', error);
    return null;
  }
  return data as { id: string };
}

export async function removeSpecializationItem(itemId: string): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase.from('mtech_specialization_items').delete().eq('id', itemId);

  if (error) {
    console.error('Error removing specialization item:', error);
    return false;
  }
  return true;
}

export async function updateSpecializationItemOrder(
  itemId: string,
  displayOrder: number
): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase
    .from('mtech_specialization_items')
    .update({ display_order: displayOrder })
    .eq('id', itemId);

  if (error) {
    console.error('Error reordering specialization item:', error);
    return false;
  }
  return true;
}