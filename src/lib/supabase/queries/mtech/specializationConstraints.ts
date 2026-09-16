import { supabase } from '@/lib/supabase/client';
import type { MtechBasket, MtechSpecializationConstraintRow } from '@/types/mtech';

type RawConstraintBasketAdminRow = {
  id: string;
  constraint_id: string;
  basket: MtechBasket | null;
};
export async function getSpecializationConstraintsAdmin(
  specializationId: string
): Promise<MtechSpecializationConstraintRow[]> {
  if (!supabase) return [];

  const { data: constraints, error: constraintsError } = await supabase
    .from('mtech_specialization_constraints')
    .select('id, max_courses')
    .eq('specialization_id', specializationId);

  if (constraintsError) {
    console.error('Error fetching specialization constraints:', constraintsError);
    return [];
  }
  if (!constraints || constraints.length === 0) return [];

  const constraintIds = constraints.map((c) => c.id);
  const { data: basketLinks, error: basketLinksError } = await supabase
    .from('mtech_specialization_constraint_baskets')
    .select('id, constraint_id, display_order, basket:mtech_baskets(*)')
    .in('constraint_id', constraintIds)
    .order('display_order', { ascending: true });

  if (basketLinksError) {
    console.error('Error fetching specialization constraint baskets:', basketLinksError);
  }

  const basketsByConstraint = (
    (basketLinks ?? []) as unknown as RawConstraintBasketAdminRow[]
  ).reduce(
    (acc, row) => {
      if (!row.basket) return acc;
      (acc[row.constraint_id] ??= []).push({ linkId: row.id, basket: row.basket });
      return acc;
    },
    {} as Record<string, { linkId: string; basket: MtechBasket }[]>
  );

  return constraints.map((c) => ({
    id: c.id,
    max_courses: c.max_courses,
    baskets: basketsByConstraint[c.id] ?? [],
  }));
}

export async function createSpecializationConstraint(
  specializationId: string,
  maxCourses: number
): Promise<{ id: string; max_courses: number } | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('mtech_specialization_constraints')
    .insert({ specialization_id: specializationId, max_courses: maxCourses })
    .select('id, max_courses')
    .single();

  if (error) {
    console.error('Error creating specialization constraint:', error);
    return null;
  }
  return data as { id: string; max_courses: number };
}

export async function updateSpecializationConstraintMaxCourses(
  constraintId: string,
  maxCourses: number
): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase
    .from('mtech_specialization_constraints')
    .update({ max_courses: maxCourses })
    .eq('id', constraintId);

  if (error) {
    console.error('Error updating specialization constraint:', error);
    return false;
  }
  return true;
}


// Cascades (ON DELETE CASCADE) to its own constraint_baskets rows.
export async function deleteSpecializationConstraint(constraintId: string): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase
    .from('mtech_specialization_constraints')
    .delete()
    .eq('id', constraintId);

  if (error) {
    console.error('Error deleting specialization constraint:', error);
    return false;
  }
  return true;
}

export async function addBasketToConstraint(
  constraintId: string,
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
    .from('mtech_specialization_constraint_baskets')
    .insert({ constraint_id: constraintId, bucket_id: bucketId, display_order: displayOrder })
    .select('id')
    .single();

  if (error) {
    console.error('Error adding basket to constraint:', error);
    return null;
  }
  return data as { id: string };
}

export async function removeBasketFromConstraint(linkId: string): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase
    .from('mtech_specialization_constraint_baskets')
    .delete()
    .eq('id', linkId);

  if (error) {
    console.error('Error removing basket from constraint:', error);
    return false;
  }
  return true;
}