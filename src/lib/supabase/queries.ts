import { supabase } from "@/lib/supabase/client";
import type { Person } from "@/types/person";

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