import { supabase } from '@/lib/supabase/client';
import type {
  MtechSection,
  MtechCreditCategory,
  MtechCourse,
  MtechCard,
  MtechBasket,
  MtechBasketCourseRow,
  MtechSpecializationItem,
  MtechSpecializationItemRow,
  MtechSpecializationConstraint,
  MtechSpecializationConstraintRow,
  MtechSpecializationFull,
} from '@/types/mtech';

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

// Raw shapes returned by the nested Supabase selects below, before assembly.
type RawSpecializationItemRow = {
  id: string;
  specialization_id: string;
  bucket_id: string | null;
  course_id: string | null;
  display_order: number | null;
  course: MtechCourse | null;
  basket: MtechBasket | null;
};

type RawBasketCourseRow = {
  bucket_id: string;
  display_order: number | null;
  course: MtechCourse;
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

// --- Specialization requirement items (admin) ---

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

// --- Specialization eligibility constraints (admin) ---

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