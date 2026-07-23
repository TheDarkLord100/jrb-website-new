// Mirrors the `announcements` table described in docs/DATABASE.md.
export type Announcement = {
  id: string;
  title: string;
  description: string; // markdown
  link_text: string | null;
  hyperlink: string | null;
  date: string;
  is_important: boolean;
  image_urls: string[] | null;
  type: "news" | "event" | "admission";
  is_visible: boolean;
};