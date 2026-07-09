// Mirrors the `announcements` table described in docs/DATABASE.md.
// Once Supabase is wired up, `src/lib/supabase/queries.ts` should return
// data in this exact shape so components never need to change.
export type Announcement = {
  id: string;
  title: string;
  description: string;
  link_text: string | null;
  hyperlink: string | null;
  date: string;
  is_important: boolean;
  type: "news" | "event";
  is_visible: boolean;
};
