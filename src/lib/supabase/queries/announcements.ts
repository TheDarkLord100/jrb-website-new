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





export async function createAnnouncement(
  payload: Omit<Announcement, 'id'>
): Promise<Announcement | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('announcements')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error creating announcement:', error);
    return null;
  }

  return data as Announcement;
}

export async function updateAnnouncement(
  id: string,
  payload: Partial<Omit<Announcement, 'id'>>
): Promise<Announcement | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('announcements')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating announcement:', error);
    return null;
  }

  return data as Announcement;
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase.from('announcements').delete().eq('id', id);

  if (error) {
    console.error('Error deleting announcement:', error);
    return false;
  }

  return true;
}
