import { supabase } from '@/lib/supabase/client';
import type { Project, ProjectInput } from '@/types/project';

// Admin read: every project, published or hidden. RLS only returns hidden
// rows to an authenticated session, so calling this logged-out quietly
// returns just the published ones.
export async function getAllProjects(): Promise<Project[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('theme_slug', { ascending: true })
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  return (data ?? []) as Project[];
}

export async function createProject(payload: ProjectInput): Promise<Project | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase.from('projects').insert(payload).select().single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }
  return data as Project;
}

export async function updateProject(
  id: string,
  payload: Partial<ProjectInput>
): Promise<Project | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }
  return data as Project;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return false;
  }

  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  return true;
}