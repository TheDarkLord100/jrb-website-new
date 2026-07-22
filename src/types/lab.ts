export type LabCategory = "perception" | "dynamics" | "human" | "manufacturing";

export type Lab = {
  id: string;
  name: string;
  slug: string;
  category: LabCategory;
  location: string | null;
  faculty_lead: string | null;
  coordinator: string | null; // optional -- faculty or student, shown only if present
  research_areas: string[] | null;
  description: string | null;
  external_url: string | null; // if set, link out instead of the internal detail page
  cover_image_url: string | null; // listing-grid thumbnail
  priority: number | null; // lower shows first; null sorts last
};

export type LabImage = {
  id: string;
  lab_id: string;
  image_url: string;
  caption: string | null;
  display_order: number | null;
};

export type LabAnnouncement = {
  id: string;
  lab_id: string;
  title: string;
  description: string | null;
  date: string | null;
  is_important: boolean;
  is_visible: boolean;
};