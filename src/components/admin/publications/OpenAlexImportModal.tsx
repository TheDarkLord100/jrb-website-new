'use client';

import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import { useToast } from '@/components/admin/Toast';
import { createPublications, getPersonThemes } from '@/lib/supabase/queries';
import { fetchOpenAlexWorks, formatAuthors, type OpenAlexWork } from '@/lib/openalex';
import { RESEARCH_THEMES, getTheme, type ThemeSlug } from '@/lib/researchThemes';
import AuthorLinker from './AuthorLinker';
import type { Person } from '@/types/person';
import type { Publication, PublicationInput } from '@/types/publication';

const doiKey = (doi: string | null) => doi?.toLowerCase() ?? null;

// A work counts as already added when a publication carries its OpenAlex id
// or the same DOI (e.g. it was added by hand before importing existed).
function findExisting(work: OpenAlexWork, publications: Publication[]): Publication | null {
  const doi = doiKey(work.doi);
  return (
    publications.find((p) => p.openalex_id === work.id) ??
    (doi ? publications.find((p) => doiKey(p.doi) === doi) : undefined) ??
    null
  );
}

// OpenAlex sometimes lists one paper twice (e.g. a preprint and the
// published version sharing a DOI). Keep the first of each DOI so a batch
// can't trip the unique-DOI index.
function dedupeByDoi(works: OpenAlexWork[]): OpenAlexWork[] {
  const seen = new Set<string>();
  return works.filter((w) => {
    const key = doiKey(w.doi);
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function OpenAlexImportModal({
  faculty,
  publications,
  onPersonUpdated,
  onAdded,
  onClose,
}: {
  faculty: Person[];
  publications: Publication[];
  onPersonUpdated: (person: Person) => void;
  onAdded: (created: Publication[]) => void;
  onClose: () => void;
}) {
  const toast = useToast();
  const [personId, setPersonId] = useState('');
  const person = faculty.find((p) => p.id === personId) ?? null;
  const [relinking, setRelinking] = useState(false);

  const [works, setWorks] = useState<OpenAlexWork[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [theme, setTheme] = useState<ThemeSlug | ''>('');
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);

  const authorId = person?.openalex_author_id ?? null;
  const showLinker = !!person && (!authorId || relinking);

  // Picking a faculty member resets everything below it.
  const pickPerson = (id: string) => {
    setPersonId(id);
    setRelinking(false);
    setWorks(null);
    setError(null);
    setSelected(new Set());
    setSearch('');
    setTheme('');
    setPage(1);
    setHasMore(false);
  };

  // Pre-select the theme when the faculty member belongs to exactly one.
  useEffect(() => {
    if (!personId) return;
    let cancelled = false;
    getPersonThemes(personId).then((themes) => {
      if (!cancelled && themes.length === 1) setTheme(themes[0] as ThemeSlug);
    });
    return () => {
      cancelled = true;
    };
  }, [personId]);

  // First page of works once a linked person is chosen. Pages are cached,
  // so coming back to the same person costs nothing.
  useEffect(() => {
    if (!authorId || relinking) return;
    let cancelled = false;

    fetchOpenAlexWorks(authorId, 1)
      .then((data) => {
        if (cancelled) return;
        setWorks(data.works);
        setTotal(data.total);
        setPage(1);
        setHasMore(data.hasMore);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to fetch works.');
      });

    return () => {
      cancelled = true;
    };
  }, [authorId, relinking]);

  const loadPage = async (nextPage: number, force = false) => {
    if (!authorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOpenAlexWorks(authorId, nextPage, { force });
      setWorks((prev) => (nextPage === 1 ? data.works : [...(prev ?? []), ...data.works]));
      setTotal(data.total);
      setPage(nextPage);
      setHasMore(data.hasMore);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch works.');
    } finally {
      setLoading(false);
    }
  };

  // Other centre faculty on a paper are linked to it too, matched by their
  // saved OpenAlex id.
  const facultyByAuthorId = useMemo(
    () =>
      new Map(
        faculty
          .filter((p) => p.openalex_author_id)
          .map((p) => [p.openalex_author_id as string, p] as const)
      ),
    [faculty]
  );

  const query = search.trim().toLowerCase();
  const rows = dedupeByDoi(works ?? [])
    .map((work) => ({ work, existing: findExisting(work, publications) }))
    .filter(({ work }) => !query || work.title.toLowerCase().includes(query));
  const newRows = rows.filter((r) => !r.existing);
  const addedRows = rows.filter((r) => r.existing);
  const selectedNew = newRows.filter((r) => selected.has(r.work.id));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleAdd = async () => {
    if (!person || theme === '' || selectedNew.length === 0) return;

    const items = selectedNew.map(({ work }) => {
      const publication: PublicationInput = {
        title: work.title,
        authors: formatAuthors(work.authors.map((a) => a.name)) || null,
        venue: work.venue,
        year: work.year,
        doi: work.doi,
        url: work.url,
        cited_by_count: work.citedByCount,
        theme_slug: theme,
        openalex_id: work.id,
        is_published: true,
      };
      const coFaculty = work.authors
        .map((a) => facultyByAuthorId.get(a.id)?.id)
        .filter((id): id is string => !!id);
      return { publication, personIds: [person.id, ...coFaculty] };
    });

    setAdding(true);
    const result = await createPublications(items);
    setAdding(false);

    if (!result) {
      toast.error("Couldn't add the papers. Nothing was saved. Check the console for details.");
      return;
    }
    if (result.linksFailed) {
      toast.error('Papers added, but linking them to faculty failed. Fix links by editing them.');
    } else {
      toast.success(
        `${result.created.length} paper${result.created.length === 1 ? '' : 's'} added.`
      );
    }
    setSelected(new Set());
    onAdded(result.created);
  };

  return (
    <Modal
      title="Import from OpenAlex"
      subtitle="Pick a faculty member, tick the papers to add, choose a theme"
      onClose={onClose}
      maxWidth="max-w-4xl"
      footer={
        person && !showLinker && works ? (
          <>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeSlug | '')}
              className="mr-auto rounded border border-stone-300 px-2 py-2 text-sm"
            >
              <option value="">— Theme for these papers —</option>
              {RESEARCH_THEMES.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100"
            >
              Done
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding || selectedNew.length === 0 || theme === ''}
              className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {adding
                ? 'Adding…'
                : `Add ${selectedNew.length} paper${selectedNew.length === 1 ? '' : 's'}`}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100"
          >
            Close
          </button>
        )
      }
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <select
            value={personId}
            onChange={(e) => pickPerson(e.target.value)}
            className="w-80 rounded border border-stone-300 px-3 py-2 text-sm"
          >
            <option value="">— Select a faculty member —</option>
            {faculty.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.openalex_author_id ? '' : ' (not linked yet)'}
              </option>
            ))}
          </select>
          {person && authorId && !relinking && (
            <span className="text-xs text-stone-500">
              OpenAlex <span className="font-mono">{authorId}</span> ·{' '}
              <button
                type="button"
                onClick={() => setRelinking(true)}
                className="font-semibold text-teal-700 hover:underline"
              >
                Change profile
              </button>
            </span>
          )}
        </div>

        {showLinker && (
          <AuthorLinker
            key={person.id}
            person={person}
            onLinked={(updated) => {
              onPersonUpdated(updated);
              setRelinking(false);
              setWorks(null);
            }}
            onCancel={relinking ? () => setRelinking(false) : undefined}
          />
        )}

        {person && !showLinker && (
          <>
            {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            {!works && !error && (
              <div className="animate-pulse space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 w-full rounded bg-gray-100" />
                ))}
              </div>
            )}

            {works && (
              <>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search
                      size={14}
                      className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Filter by title"
                      className="w-full rounded border border-gray-300 py-1.5 pr-3 pl-8 text-xs"
                    />
                  </div>
                  <span className="text-xs text-stone-500">
                    {works.length} of {total} loaded
                  </span>
                  <button
                    type="button"
                    onClick={() => loadPage(1, true)}
                    disabled={loading}
                    title="Fetch again from OpenAlex"
                    className="flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-50"
                  >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : undefined} />
                    Refresh
                  </button>
                </div>

                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
                      New ({newRows.length})
                    </h3>
                    {newRows.length > 0 && (
                      <div className="flex gap-3 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() =>
                            setSelected(
                              (prev) => new Set([...prev, ...newRows.map((r) => r.work.id)])
                            )
                          }
                          className="text-teal-700 hover:underline"
                        >
                          Select all
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelected(new Set())}
                          className="text-stone-500 hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {newRows.length === 0 ? (
                    <p className="py-4 text-sm text-stone-400">
                      {query ? 'No new papers match.' : 'Every loaded paper has been added.'}
                    </p>
                  ) : (
                    <ul className="max-h-[22rem] divide-y divide-stone-100 overflow-y-auto rounded border border-stone-200">
                      {newRows.map(({ work }) => {
                        const coFaculty = work.authors
                          .map((a) => facultyByAuthorId.get(a.id))
                          .filter((p): p is Person => !!p && p.id !== person.id);
                        return (
                          <li key={work.id}>
                            <label className="flex cursor-pointer gap-3 px-4 py-2.5 hover:bg-stone-50">
                              <input
                                type="checkbox"
                                checked={selected.has(work.id)}
                                onChange={() => toggle(work.id)}
                                className="mt-1 accent-teal-700"
                              />
                              <div className="min-w-0">
                                <div className="text-sm text-stone-900">{work.title}</div>
                                <div className="mt-0.5 text-xs text-stone-500">
                                  {[work.venue, work.year, work.type, `${work.citedByCount} cited`]
                                    .filter(Boolean)
                                    .join(' · ')}
                                </div>
                                {coFaculty.length > 0 && (
                                  <div className="mt-0.5 text-xs text-teal-700">
                                    Also by {coFaculty.map((p) => p.name).join(', ')}
                                  </div>
                                )}
                              </div>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>

                {hasMore && (
                  <button
                    type="button"
                    onClick={() => loadPage(page + 1)}
                    disabled={loading}
                    className="w-full rounded border border-dashed border-stone-300 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                  >
                    {loading ? 'Loading…' : `Load more (${total - works.length} remaining)`}
                  </button>
                )}

                {addedRows.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
                      Already added ({addedRows.length})
                    </h3>
                    <ul className="max-h-48 divide-y divide-stone-100 overflow-y-auto rounded border border-stone-200 bg-stone-50">
                      {addedRows.map(({ work, existing }) => (
                        <li
                          key={work.id}
                          className="flex items-center justify-between gap-4 px-4 py-2"
                        >
                          <span className="truncate text-sm text-stone-400">{work.title}</span>
                          <span className="shrink-0 text-xs text-stone-400">
                            {getTheme(existing!.theme_slug)?.shortLabel}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}