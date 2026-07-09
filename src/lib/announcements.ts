import type { Announcement } from "@/types/announcement";

// TODO(supabase): replace this with a call into src/lib/supabase/queries.ts
// once the `announcements` table is live, e.g.:
//   export async function getAnnouncements() {
//     const { data } = await supabase.from("announcements").select("*").eq("is_visible", true);
//     return data as Announcement[];
//   }
//
// For now this reads the same public Gist JSON the previous version of the
// site used, and adapts it into the `announcements` table shape so nothing
// else in the app needs to change when Supabase is connected.

const LEGACY_ANNOUNCEMENT_URL =
  "https://gist.githubusercontent.com/TheDarkLord100/0420eeb41a0efc0002ce4d12ffca4ad2/raw/announcement.json";

type LegacyAnnouncement = {
  title: string;
  description: string;
  date: string;
  important?: boolean;
  link?: string;
};

export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const response = await fetch(`${LEGACY_ANNOUNCEMENT_URL}?t=${Date.now()}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data: LegacyAnnouncement[] = await response.json();

    const adapted: Announcement[] = data.map((item, i) => ({
      id: String(i),
      title: item.title,
      description: item.description,
      link_text: item.link ? "Open Link" : null,
      hyperlink: item.link ?? null,
      date: item.date,
      is_important: !!item.important,
      type: "news",
      is_visible: true,
    }));

    adapted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return adapted;
  } catch (error) {
    console.error("Error loading announcements:", error);
    return [];
  }
}

export function formatAnnouncementDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
