// Mirrors the `admission_sections` and `admission_links` tables.
export type AdmissionSection = {
  id: string;
  title: string;
  body_markdown: string;
  display_order: number | null;
  is_visible: boolean;
  updated_at: string;
};

export type AdmissionLink = {
  id: string;
  label: string;
  href: string;
  display_order: number | null;
  is_visible: boolean;
  updated_at: string;
};