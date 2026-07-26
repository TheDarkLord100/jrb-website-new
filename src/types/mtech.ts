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
  category: 'core' | 'project' | 'elective_slot' | 'open_category';
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
