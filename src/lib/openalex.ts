import { supabase } from '@/lib/supabase/client';

// Client side of the `openalex-fetch` Edge Function, which holds the
// OpenAlex API key and only accepts calls from a logged-in admin. The shapes
// below are what that function returns -- already trimmed down from
// OpenAlex's own, much larger, responses.

export type OpenAlexAuthor = {
  id: string; // "A5023888391"
  name: string;
  orcid: string | null;
  worksCount: number;
  citedByCount: number;
  institution: string | null;
};

export type OpenAlexWork = {
  id: string; // "W2755968057"
  title: string;
  year: number | null;
  doi: string | null;
  url: string | null;
  venue: string | null;
  type: string | null; // "article", "book-chapter", "preprint", …
  citedByCount: number;
  authors: { id: string; name: string }[];
};

export type OpenAlexWorksPage = {
  works: OpenAlexWork[];
  total: number;
  page: number;
  hasMore: boolean;
};

const FUNCTION_NAME = 'openalex-fetch';

// Turns any failure into an Error with a message worth showing the admin:
// the function's own `{ error }` text when it sent one (e.g. "daily
// allowance is used up"), a generic one otherwise.
async function call<T>(body: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, { body });

  if (error) {
    let message = "Couldn't reach OpenAlex. Try again shortly.";
    // Non-2xx responses carry the function's JSON body on error.context.
    const context = (error as { context?: unknown }).context;
    if (context instanceof Response) {
      try {
        const payload = await context.json();
        if (typeof payload?.error === 'string') message = payload.error;
      } catch {
        // Not JSON -- keep the generic message.
      }
    }
    console.error('OpenAlex function error:', error);
    throw new Error(message);
  }
  if (data?.error) throw new Error(data.error as string);
  return data as T;
}

// Name search, or an exact lookup when given an ORCID.
export async function searchOpenAlexAuthors(query: string): Promise<OpenAlexAuthor[]> {
  const data = await call<{ authors: OpenAlexAuthor[] }>({ action: 'search-authors', query });
  return data.authors;
}

// Every page fetched is kept for the lifetime of the page, so switching
// between faculty in the import modal doesn't spend the daily allowance
// again. Pass `force` to refetch.
const worksCache = new Map<string, OpenAlexWorksPage>();

export async function fetchOpenAlexWorks(
  authorId: string,
  page = 1,
  { force = false } = {}
): Promise<OpenAlexWorksPage> {
  const key = `${authorId}:${page}`;
  const cached = worksCache.get(key);
  if (cached && !force) return cached;

  const data = await call<OpenAlexWorksPage>({ action: 'author-works', authorId, page });
  worksCache.set(key, data);
  return data;
}

// "Kumar, S. Bhasin, …" for the authors column. Long author lists (common
// in big collaborations) are cut short so they don't swamp the page.
export function formatAuthors(names: string[], max = 12): string {
  if (names.length <= max) return names.join(', ');
  return `${names.slice(0, max).join(', ')}, et al.`;
}