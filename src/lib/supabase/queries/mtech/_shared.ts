import type { MtechCourse } from '@/types/mtech';

// Internal helper shape only -- the result of resolving a basket's member
// courses for the "basket item" branch of a requirement list. Used by both
// specializations.ts (public getMtechSpecializations) and
// specializationItems.ts (admin getSpecializationItemsAdmin), which both
// need this same second-hop resolution. Not the same as the exported
// MtechBasketCourseRow type in types/mtech.ts -- that one carries the join
// row's own id (for admin remove/reorder); this one is purely for grouping
// courses by bucket_id and is discarded once that grouping is built.
export type RawBasketCourseRow = {
  bucket_id: string;
  display_order: number | null;
  course: MtechCourse;
};