import { supabase } from '@/lib/supabase/client';
import type { Announcement } from '@/types/announcement';


export async function getAnnouncementsByType(type: Announcement['type']): Promise<Announcement[]> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return [];
  }

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('type', type)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }

  return (data ?? []) as Announcement[];
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return [];
  }

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }

  return (data ?? []) as Announcement[];
}
