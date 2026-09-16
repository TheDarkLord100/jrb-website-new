export type MtechSection = {
  id: string;
  section_key: string;
  title: string | null;
  body_markdown: string;
  display_order: number | null;
};

export type MtechCreditCategory = {
  id: string;
  category: string;
  description: string;
  credits: number;
  display_order: number | null;
};

export type MtechCourse = {
  id: string;
  code: string | null;
  title: string;
  category: 'core' | 'project' | 'elective_slot' | 'open_category' | 'elective';
  semester: string | null;
  l: number | null;
  t: number | null;
  p: number | null;
  credits: number;
  is_break_component: boolean;
  display_order: number | null;
};

export type MtechCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number | null;
};

// --- Specialization course requirements (baskets + constraints) ---

export type MtechBasket = {
  id: string;
  name: string | null;
};

// Admin-only: a basket's member course, keeping the join row's own id
// (needed to remove/reorder that specific membership) alongside the
// resolved course. The public-facing MtechSpecializationItem/-Constraint
// types only need the resolved MtechCourse[], not this row identity.
export type MtechBasketCourseRow = {
  id: string;
  bucket_id: string;
  course_id: string;
  display_order: number | null;
  course: MtechCourse;
};

// Admin-only: one row of a specialization's requirement list, keeping the
// join row's own id (needed to remove/reorder that specific entry) --
// mirrors MtechSpecializationItem but with `id` attached.
export type MtechSpecializationItemRow =
  | { id: string; kind: 'course'; course: MtechCourse }
  | { id: string; kind: 'basket'; basket: MtechBasket; courses: MtechCourse[] };

// Admin-only: one eligibility constraint, with each attached basket's own
// link-row id (needed to detach one basket from the constraint without
// touching the others).
export type MtechSpecializationConstraintRow = {
  id: string;
  max_courses: number;
  baskets: { linkId: string; basket: MtechBasket }[];
};

// A single row in a specialization's required-course list. Either a
// standalone course, or a basket of interchangeable alternatives (with its
// member courses already resolved and attached).
export type MtechSpecializationItem =
  | { kind: 'course'; course: MtechCourse }
  | { kind: 'basket'; basket: MtechBasket; courses: MtechCourse[] };

// A single "at most N courses from these baskets" eligibility rule.
// `baskets` carries the resolved basket + its member courses (for the
// clickable pill/modal in the UI), already in display order.
export type MtechSpecializationConstraint = {
  id: string;
  max_courses: number;
  baskets: { basket: MtechBasket; courses: MtechCourse[] }[];
};

// What getMtechSpecializations() now returns — the base card fields plus
// the fully-assembled requirement list and constraints for the dialog.
export type MtechSpecializationFull = MtechCard & {
  items: MtechSpecializationItem[];
  constraints: MtechSpecializationConstraint[];
};