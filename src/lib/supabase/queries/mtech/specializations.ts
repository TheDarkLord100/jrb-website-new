import { supabase } from '@/lib/supabase/client';
import type { RawBasketCourseRow } from './_shared';
import type {
  MtechCourse,
  MtechCard,
  MtechBasket,
  MtechSpecializationItem,
  MtechSpecializationConstraint,
  MtechSpecializationFull,
} from '@/types/mtech';

type RawSpecializationItemRow = {
  id: string;
  specialization_id: string;
  bucket_id: string | null;
  course_id: string | null;
  display_order: number | null;
  course: MtechCourse | null;
  basket: MtechBasket | null;
};


type RawConstraintRow = {
  id: string;
  specialization_id: string;
  max_courses: number;
};

type RawConstraintBasketRow = {
  constraint_id: string;
  display_order: number | null;
  basket: MtechBasket;
};
export async function getMtechSpecializations(): Promise<MtechSpecializationFull[]> {
  if (!supabase) return [];

  const { data: cards, error: cardsError } = await supabase
    .from('mtech_specializations')
    .select('*')
    .order('display_order', { ascending: true });
  if (cardsError) {
    console.error('Error fetching mtech specializations:', cardsError);
    return [];
  }
  if (!cards || cards.length === 0) return [];

  const specializationIds = cards.map((c) => c.id);

  const [itemsRes, constraintsRes] = await Promise.all([
    supabase
      .from('mtech_specialization_items')
      .select('id, specialization_id, bucket_id, course_id, display_order, course:mtech_courses(*), basket:mtech_baskets(*)')
      .in('specialization_id', specializationIds)
      .order('display_order', { ascending: true }),
    supabase
      .from('mtech_specialization_constraints')
      .select('id, specialization_id, max_courses')
      .in('specialization_id', specializationIds),
  ]);

  if (itemsRes.error) {
    console.error('Error fetching mtech specialization items:', itemsRes.error);
  }
  if (constraintsRes.error) {
    console.error('Error fetching mtech specialization constraints:', constraintsRes.error);
  }

  const items = (itemsRes.data ?? []) as unknown as RawSpecializationItemRow[];
  const constraints = (constraintsRes.data ?? []) as unknown as RawConstraintRow[];

  // Constraint baskets (fetched next) need constraint ids from the fetch
  // above; their own bucket ids then feed into the combined basket-courses
  // fetch below alongside the items' bucket ids.
  const constraintIds = constraints.map((c) => c.id);

  let constraintBasketRows: RawConstraintBasketRow[] = [];
  if (constraintIds.length > 0) {
    const { data, error: constraintBasketsError } = await supabase
      .from('mtech_specialization_constraint_baskets')
      .select('constraint_id, display_order, basket:mtech_baskets(*)')
      .in('constraint_id', constraintIds)
      .order('display_order', { ascending: true });

    if (constraintBasketsError) {
      console.error('Error fetching mtech specialization constraint baskets:', constraintBasketsError);
    }
    constraintBasketRows = (data ?? []) as unknown as RawConstraintBasketRow[];
  }

  // Every basket referenced anywhere -- as a requirement-list item, or as
  // part of a constraint's eligible-basket set -- needs its member courses
  // resolved in one combined second hop; a basket's courses aren't
  // reachable directly from either mtech_specialization_items or
  // mtech_specialization_constraint_baskets.
  const bucketIds = [
    ...new Set([
      ...items.map((i) => i.bucket_id).filter((id): id is string => !!id),
      ...constraintBasketRows.map((r) => r.basket?.id).filter((id): id is string => !!id),
    ]),
  ];

  let basketCoursesByBucket: Record<string, MtechCourse[]> = {};
  if (bucketIds.length > 0) {
    const { data: basketCourseRows, error: basketCoursesError } = await supabase
      .from('mtech_basket_courses')
      .select('bucket_id, display_order, course:mtech_courses(*)')
      .in('bucket_id', bucketIds)
      .order('display_order', { ascending: true });

    if (basketCoursesError) {
      console.error('Error fetching mtech basket courses:', basketCoursesError);
    }

    basketCoursesByBucket = ((basketCourseRows ?? []) as unknown as RawBasketCourseRow[]).reduce(
      (acc, row) => {
        (acc[row.bucket_id] ??= []).push(row.course);
        return acc;
      },
      {} as Record<string, MtechCourse[]>
    );
  }

  const constraintBasketsByConstraint = constraintBasketRows.reduce(
    (acc, row) => {
      if (!row.basket) return acc;
      (acc[row.constraint_id] ??= []).push({
        basket: row.basket,
        courses: basketCoursesByBucket[row.basket.id] ?? [],
      });
      return acc;
    },
    {} as Record<string, { basket: MtechBasket; courses: MtechCourse[] }[]>
  );

  const itemsBySpecialization = items.reduce(
    (acc, row) => {
      let item: MtechSpecializationItem | null = null;
      if (row.course_id && row.course) {
        item = { kind: 'course', course: row.course };
      } else if (row.bucket_id && row.basket) {
        item = {
          kind: 'basket',
          basket: row.basket,
          courses: basketCoursesByBucket[row.bucket_id] ?? [],
        };
      }
      if (item) (acc[row.specialization_id] ??= []).push(item);
      return acc;
    },
    {} as Record<string, MtechSpecializationItem[]>
  );

  const constraintsBySpecialization = constraints.reduce(
    (acc, row) => {
      const constraint: MtechSpecializationConstraint = {
        id: row.id,
        max_courses: row.max_courses,
        baskets: constraintBasketsByConstraint[row.id] ?? [],
      };
      (acc[row.specialization_id] ??= []).push(constraint);
      return acc;
    },
    {} as Record<string, MtechSpecializationConstraint[]>
  );

  return (cards as MtechCard[]).map((card) => ({
    ...card,
    items: itemsBySpecialization[card.id] ?? [],
    constraints: constraintsBySpecialization[card.id] ?? [],
  }));
}

// --- Specializations (admin CRUD) ---

export async function getMtechSpecializationCards(): Promise<MtechCard[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('mtech_specializations')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching mtech specialization cards:', error);
    return [];
  }
  return (data ?? []) as MtechCard[];
}

export async function createMtechSpecialization(
  payload: Omit<MtechCard, 'id'>
): Promise<MtechCard | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('mtech_specializations')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error creating mtech specialization:', error);
    return null;
  }
  return data as MtechCard;
}

export async function updateMtechSpecialization(
  id: string,
  payload: Partial<Omit<MtechCard, 'id'>>
): Promise<MtechCard | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('mtech_specializations')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating mtech specialization:', error);
    return null;
  }
  return data as MtechCard;
}

// Deleting a specialization cascades (ON DELETE CASCADE) to its own
// mtech_specialization_items and mtech_specialization_constraints rows
// (and, transitively, those constraints' constraint_baskets rows) -- but
// never touches the courses or baskets it referenced, which are shared,
// independent catalog entries.

export async function deleteMtechSpecialization(id: string): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase.from('mtech_specializations').delete().eq('id', id);

  if (error) {
    console.error('Error deleting mtech specialization:', error);
    return false;
  }
  return true;
}

export async function updateMtechSpecializationOrder(
  id: string,
  displayOrder: number
): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase
    .from('mtech_specializations')
    .update({ display_order: displayOrder })
    .eq('id', id);

  if (error) {
    console.error('Error reordering mtech specialization:', error);
    return false;
  }
  return true;
}