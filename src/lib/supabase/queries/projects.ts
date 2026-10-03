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

// Public read: one theme's published projects, in display order. The
// explicit is_published filter matters even though RLS hides unpublished
// rows from visitors -- an admin who's logged in while browsing the public
// site would otherwise see hidden projects too.
export async function getThemeProjects(themeSlug: string): Promise<Project[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('theme_slug', themeSlug)
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('title', { ascending: true });
  if (error) {
    console.error('Error fetching theme projects:', error);
    return [];
  }
  return (data ?? []) as Project[];
}

// Public read: the featured carousel -- published, featured projects that
// have media (a slide without an image or video has nothing to show), in
// featured_order with unordered ones last.
export async function getFeaturedProjects(): Promise<Project[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_featured', true)
    .eq('is_published', true)
    .not('media_url', 'is', null)
    .order('featured_order', { ascending: true, nullsFirst: false })
    .order('title', { ascending: true });
  if (error) {
    console.error('Error fetching featured projects:', error);
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