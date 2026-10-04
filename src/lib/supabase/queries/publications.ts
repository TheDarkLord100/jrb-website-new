import { supabase } from '@/lib/supabase/client';
import type { Publication, PublicationInput } from '@/types/publication';

const NOT_CONFIGURED =
  'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.';

// Publications come back with their faculty links (and those faculty's
// names) embedded, flattened here to plain lists.
const SELECT = '*, publication_people(person_id, people(name))';

type Row = Omit<Publication, 'person_ids' | 'faculty_names'> & {
  publication_people: { person_id: string; people: { name: string } | null }[] | null;
};

function fromRow({ publication_people, ...rest }: Row): Publication {
  const links = publication_people ?? [];
  return {
    ...rest,
    person_ids: links.map((l) => l.person_id),
    faculty_names: links.map((l) => l.people?.name).filter((n): n is string => !!n),
  };
}

// Admin read: everything, newest first. RLS only returns hidden rows to an
// authenticated session.
export async function getAllPublications(): Promise<Publication[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('publications')
    .select(SELECT)
    .order('year', { ascending: false, nullsFirst: false })
    .order('title', { ascending: true });
  if (error) {
    console.error('Error fetching publications:', error);
    return [];
  }
  return ((data ?? []) as Row[]).map(fromRow);
}

// Public read: one theme's published papers, newest first. The explicit
// is_published filter keeps hidden papers off the page even for an admin
// who's logged in while browsing the site.
export async function getThemePublications(themeSlug: string): Promise<Publication[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('publications')
    .select(SELECT)
    .eq('theme_slug', themeSlug)
    .eq('is_published', true)
    .order('year', { ascending: false, nullsFirst: false })
    .order('title', { ascending: true });
  if (error) {
    console.error('Error fetching theme publications:', error);
    return [];
  }
  return ((data ?? []) as Row[]).map(fromRow);
}

// The research themes a person is linked to -- used to pre-select the theme
// when importing their papers.
export async function getPersonThemes(personId: string): Promise<string[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('theme_faculty')
    .select('theme_slug')
    .eq('person_id', personId);
  if (error) {
    console.error('Error fetching person themes:', error);
    return [];
  }
  return (data ?? []).map((row) => row.theme_slug as string);
}

async function insertLinks(links: { publication_id: string; person_id: string }[]) {
  if (links.length === 0) return true;
  const { error } = await supabase!.from('publication_people').insert(links);
  if (error) {
    console.error('Error linking publications to faculty:', error);
    return false;
  }
  return true;
}

// Inserts several papers at once, each with its faculty links. The papers
// go in as one insert, so either all of them land or none do. Linking runs
// as a second step; if only that fails the papers still exist, and the
// caller is told so it can say so.
export async function createPublications(
  items: { publication: PublicationInput; personIds: string[] }[]
): Promise<{ created: Publication[]; linksFailed: boolean } | null> {
  if (!supabase) {
    console.error(NOT_CONFIGURED);
    return null;
  }
  if (items.length === 0) return { created: [], linksFailed: false };

  const { data, error } = await supabase
    .from('publications')
    .insert(items.map((i) => i.publication))
    .select('*');

  if (error) {
    console.error('Error creating publications:', error);
    return null;
  }

  // Inserted rows come back in the same order they were sent.
  const rows = data as Omit<Publication, 'person_ids' | 'faculty_names'>[];
  const links = rows.flatMap((row, i) =>
    [...new Set(items[i].personIds)].map((person_id) => ({ publication_id: row.id, person_id }))
  );
  const linksOk = await insertLinks(links);

  return {
    // faculty_names is only needed on the public site, which reads fresh
    // from the database, so the admin can leave it empty here.
    created: rows.map((row, i) => ({
      ...row,
      person_ids: linksOk ? [...new Set(items[i].personIds)] : [],
      faculty_names: [],
    })),
    linksFailed: !linksOk,
  };
}

// Updates a paper and replaces its faculty links with `personIds`.
export async function updatePublication(
  id: string,
  payload: Partial<PublicationInput>,
  personIds: string[]
): Promise<Publication | null> {
  if (!supabase) {
    console.error(NOT_CONFIGURED);
    return null;
  }

  const { data, error } = await supabase
    .from('publications')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
  if (error) {
    console.error('Error updating publication:', error);
    return null;
  }

  const { error: clearError } = await supabase
    .from('publication_people')
    .delete()
    .eq('publication_id', id);
  if (clearError) {
    console.error('Error clearing publication links:', clearError);
    return null;
  }
  const unique = [...new Set(personIds)];
  const linksOk = await insertLinks(unique.map((person_id) => ({ publication_id: id, person_id })));
  if (!linksOk) return null;

  return {
    ...(data as Omit<Publication, 'person_ids' | 'faculty_names'>),
    person_ids: unique,
    faculty_names: [],
  };
}

// Its faculty links go with it (the foreign key cascades).
export async function deletePublication(id: string): Promise<boolean> {
  if (!supabase) {
    console.error(NOT_CONFIGURED);
    return false;
  }
  const { error } = await supabase.from('publications').delete().eq('id', id);
  if (error) {
    console.error('Error deleting publication:', error);
    return false;
  }
  return true;
}