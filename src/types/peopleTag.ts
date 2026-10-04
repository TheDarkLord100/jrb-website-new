// Mirrors the `people_tags` table: the filter pills on the People page's
// Faculty tab. A tag matches a faculty member when its keyword appears
// anywhere in their focus keywords (case-insensitive substring match).
export type PeopleTag = {
  id: string;
  keyword: string; // stored lowercase
  label: string;
  display_order: number;
  created_at: string;
};

export type PeopleTagInput = Pick<PeopleTag, 'keyword' | 'label' | 'display_order'>;