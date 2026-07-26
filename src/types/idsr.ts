export type IdsrSection = {
  id: string;
  section_key: string;
  body_markdown: string;
  display_order: number | null;
};

export type IdsrCurriculumRow = {
  id: string;
  component: string;
  description: string;
  is_highlighted: boolean;
  display_order: number | null;
};

export type IdsrCoreCourse = {
  id: string;
  course: string;
  code: string | null;
  ltp: string | null;
  credits: number | null;
  display_order: number | null;
};

export type IdsrElective = {
  id: string;
  label: string;
  display_order: number | null;
};
