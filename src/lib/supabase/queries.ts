import { supabase } from "@/lib/supabase/client";
import type { Person } from "@/types/person";
import type { Lab, LabImage, LabAnnouncement } from "@/types/lab";
import type { AdmissionSection, AdmissionLink } from "@/types/admissions";
import type { Announcement } from "@/types/announcement";

export async function getPeople(): Promise<Person[]> {
  if (!supabase) {
    console.error(
      "Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
    return [];
  }

  const { data, error } = await supabase.from("people").select("*").order("name");

  if (error) {
    console.error("Error fetching people:", error);
    return [];
  }

  return (data ?? []) as Person[];
}

export async function getLabs(): Promise<Lab[]> {
  if (!supabase) {
    console.error(
      "Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
    return [];
  }

  const { data, error } = await supabase.from("labs").select("*").order("name");

  if (error) {
    console.error("Error fetching labs:", error);
    return [];
  }

  return (data ?? []) as Lab[];
}

// Used by generateStaticParams at build time (this is a static export site,
// so every lab detail page's URL must be known when `next build` runs — a
// lab added after the last build/deploy won't have a routable page until
// the next one). Deliberately returns just slugs, not full rows.
export async function getLabSlugs(): Promise<string[]> {
  if (!supabase) {
    console.error(
      "Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
    return [];
  }

  const { data, error } = await supabase.from("labs").select("slug");

  if (error) {
    console.error("Error fetching lab slugs:", error);
    return [];
  }

  return (data ?? []).map((row) => row.slug as string);
}

export async function getLabBySlug(slug: string): Promise<Lab | null> {
  if (!supabase) {
    console.error(
      "Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
    return null;
  }

  const { data, error } = await supabase.from("labs").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    console.error("Error fetching lab:", error);
    return null;
  }

  return data as Lab | null;
}

export async function getLabImages(labId: string): Promise<LabImage[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("lab_images")
    .select("*")
    .eq("lab_id", labId)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching lab images:", error);
    return [];
  }

  return (data ?? []) as LabImage[];
}

export async function getLabAnnouncements(labId: string): Promise<LabAnnouncement[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("lab_announcements")
    .select("*")
    .eq("lab_id", labId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching lab announcements:", error);
    return [];
  }

  return (data ?? []) as LabAnnouncement[];
}

// Faculty linked to a research theme via the theme_faculty junction table --
// sources the real, current `people` row (name, id, etc.) rather than a
// hardcoded name string that can drift out of sync.
type ThemeFacultyRow = { people: Person | null };

export async function getThemeFaculty(themeSlug: string): Promise<Person[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("theme_faculty")
    .select("people(*)")
    .eq("theme_slug", themeSlug);

  if (error) {
    console.error("Error fetching theme faculty:", error);
    return [];
  }

  return ((data ?? []) as unknown as ThemeFacultyRow[])
    .map((row) => row.people)
    .filter((p): p is Person => p !== null);
}

// Labs linked to a research theme via the theme_labs junction table.
type ThemeLabRow = { labs: Lab | null };

export async function getThemeLabs(themeSlug: string): Promise<Lab[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("theme_labs")
    .select("labs(*)")
    .eq("theme_slug", themeSlug);

  if (error) {
    console.error("Error fetching theme labs:", error);
    return [];
  }

  return ((data ?? []) as unknown as ThemeLabRow[])
    .map((row) => row.labs)
    .filter((l): l is Lab => l !== null);
}

export async function getAdmissionSections(): Promise<AdmissionSection[]> {
  if (!supabase) {
    console.error(
      "Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
    return [];
  }

  const { data, error } = await supabase
    .from("admission_sections")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching admission sections:", error);
    return [];
  }

  return (data ?? []) as AdmissionSection[];
}

export async function getAdmissionLinks(): Promise<AdmissionLink[]> {
  if (!supabase) {
    console.error(
      "Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
    return [];
  }

  const { data, error } = await supabase
    .from("admission_links")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching admission links:", error);
    return [];
  }

  return (data ?? []) as AdmissionLink[];
}

export async function getAnnouncementsByType(
  type: Announcement["type"]
): Promise<Announcement[]> {
  if (!supabase) {
    console.error(
      "Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
    return [];
  }

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("type", type)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }

  return (data ?? []) as Announcement[];
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  if (!supabase) {
    console.error(
      "Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
    return [];
  }

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }

  return (data ?? []) as Announcement[];
}