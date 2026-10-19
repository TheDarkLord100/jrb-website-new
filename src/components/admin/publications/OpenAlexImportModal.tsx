'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, RefreshCw, Search, Sparkles } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import { useToast } from '@/components/admin/Toast';
import { createPublications, markPublicationsReviewed } from '@/lib/supabase/queries';
import { fetchOpenAlexWorks, formatAuthors, type OpenAlexWork } from '@/lib/openalex';
import {
  getCachedTriage,
  triagePapers,
  type TriageResult,
  type TriageVerdict,
} from '@/lib/paperTriage';
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

// How each AI verdict group is titled and coloured. "Not relevant" starts
// collapsed, since it's usually the longest and least interesting group.
const GROUPS: { verdict: TriageVerdict | 'unreviewed'; title: string; tone: string }[] = [
  { verdict: 'recommended', title: 'Recommended', tone: 'text-teal-700' },
  { verdict: 'maybe', title: 'Maybe', tone: 'text-amber-700' },
  { verdict: 'not_relevant', title: 'Not relevant', tone: 'text-stone-500' },
  { verdict: 'unreviewed', title: 'Not reviewed by AI yet', tone: 'text-stone-500' },
];

type Row = { work: OpenAlexWork; existing: Publication | null };

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// "Needs review" order: never-reviewed faculty first, then the oldest
// reviews; ties (and the never-reviewed group) go alphabetically.
function byReviewDate(a: Person, b: Person): number {
  const at = a.publications_reviewed_at;
  const bt = b.publications_reviewed_at;
  if (at !== bt) {
    if (!at) return -1;
    if (!bt) return 1;
    const diff = Date.parse(at) - Date.parse(bt);
    if (diff !== 0) return diff;
  }
  return a.name.localeCompare(b.name);
}

type FacultyOrder = 'needs-review' | 'name';

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
  const [facultyOrder, setFacultyOrder] = useState<FacultyOrder>('needs-review');
  const [marking, setMarking] = useState(false);

  const sortedFaculty = useMemo(
    () =>
      [...faculty].sort(
        facultyOrder === 'name' ? (a, b) => a.name.localeCompare(b.name) : byReviewDate
      ),
    [faculty, facultyOrder]
  );

  const [works, setWorks] = useState<OpenAlexWork[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);

  // Themes: each paper uses the admin's own choice for it, or else the AI's
  // suggestion. Papers with neither have no theme until one is picked.
  const [themeOverrides, setThemeOverrides] = useState<Record<string, ThemeSlug>>({});

  // AI triage results by work id, plus progress while a run is going.
  const [triage, setTriage] = useState<Map<string, TriageResult>>(new Map());
  const [triaging, setTriaging] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [triageError, setTriageError] = useState<string | null>(null);
  const [showNotRelevant, setShowNotRelevant] = useState(false);

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
    setThemeOverrides({});
    setTriage(new Map());
    setTriageError(null);
    setProgress(null);
    setShowNotRelevant(false);
    setPage(1);
    setHasMore(false);
  };

  // Adds any triage results already fetched this session for these works.
  const mergeCachedTriage = (loaded: OpenAlexWork[]) => {
    const cached = getCachedTriage(loaded.map((w) => w.id));
    if (cached.size > 0) setTriage((prev) => new Map([...prev, ...cached]));
  };

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
        const cached = getCachedTriage(data.works.map((w) => w.id));
        if (cached.size > 0) setTriage((prev) => new Map([...prev, ...cached]));
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
      mergeCachedTriage(data.works);
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

  const allRows: Row[] = dedupeByDoi(works ?? []).map((work) => ({
    work,
    existing: findExisting(work, publications),
  }));
  const allNew = allRows.filter((r) => !r.existing);
  const untriagedNew = allNew.filter((r) => !triage.has(r.work.id));
  const hasTriage = allNew.some((r) => triage.has(r.work.id));

  const query = search.trim().toLowerCase();
  const matches = (r: Row) => !query || r.work.title.toLowerCase().includes(query);
  const newRows = allNew.filter(matches);
  const addedRows = allRows.filter((r) => r.existing).filter(matches);

  const themeFor = (workId: string): ThemeSlug | '' =>
    themeOverrides[workId] ?? triage.get(workId)?.theme ?? '';

  const selectedNew = allNew.filter((r) => selected.has(r.work.id));
  const missingTheme = selectedNew.filter((r) => themeFor(r.work.id) === '').length;

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selectRows = (rows: Row[]) =>
    setSelected((prev) => new Set([...prev, ...rows.map((r) => r.work.id)]));

  const setThemeForSelected = (theme: ThemeSlug) =>
    setThemeOverrides((prev) => {
      const next = { ...prev };
      selectedNew.forEach((r) => (next[r.work.id] = theme));
      return next;
    });

  // Sends every new paper the AI hasn't seen yet. Results arrive batch by
  // batch; recommended papers are ticked as they land (the admin can untick
  // them), nothing else is.
  const runTriage = async () => {
    const targets = untriagedNew.map((r) => r.work);
    if (targets.length === 0) return;

    setTriaging(true);
    setTriageError(null);
    setProgress({ done: 0, total: targets.length });
    try {
      await triagePapers(targets, (results, done, totalCount) => {
        setTriage((prev) => {
          const next = new Map(prev);
          results.forEach((r) => next.set(r.id, r));
          return next;
        });
        setSelected((prev) => {
          const next = new Set(prev);
          results.filter((r) => r.verdict === 'recommended').forEach((r) => next.add(r.id));
          return next;
        });
        setProgress({ done, total: totalCount });
      });
    } catch (e) {
      setTriageError(
        `${e instanceof Error ? e.message : 'AI review failed.'} Papers reviewed so far are kept — run it again to finish the rest.`
      );
    } finally {
      setTriaging(false);
    }
  };

  // Records that this person's papers have been gone through. If some pages
  // were never loaded, check first -- those papers haven't been seen.
  const handleMarkReviewed = async () => {
    if (!person) return;
    if (
      hasMore &&
      !window.confirm(
        `Only ${works?.length ?? 0} of ${total} papers have been loaded. Mark ${person.name} as reviewed anyway?`
      )
    ) {
      return;
    }
    setMarking(true);
    const updated = await markPublicationsReviewed(person.id);
    setMarking(false);
    if (!updated) {
      toast.error("Couldn't save the review date. Check the console for details.");
      return;
    }
    onPersonUpdated(updated);
    toast.success(`${person.name} marked as reviewed.`);
  };

  const handleAdd = async () => {
    if (!person || selectedNew.length === 0 || missingTheme > 0) return;

    const items = selectedNew.map(({ work }) => {
      const publication: PublicationInput = {
        title: work.title,
        authors: formatAuthors(work.authors.map((a) => a.name)) || null,
        venue: work.venue,
        year: work.year,
        doi: work.doi,
        url: work.url,
        cited_by_count: work.citedByCount,
        theme_slug: themeFor(work.id) as ThemeSlug,
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

  const renderRow = ({ work }: Row) => {
    const coFaculty = work.authors
      .map((a) => facultyByAuthorId.get(a.id))
      .filter((p): p is Person => !!p && p.id !== person?.id);
    const result = triage.get(work.id);
    const theme = themeFor(work.id);
    const isSelected = selected.has(work.id);

    return (
      <li key={work.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-stone-50">
        <label className="flex min-w-0 flex-1 cursor-pointer gap-3">
          <input
            type="checkbox"
            checked={isSelected}
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
            {result && <div className="mt-0.5 text-xs text-stone-600 italic">{result.reason}</div>}
            {coFaculty.length > 0 && (
              <div className="mt-0.5 text-xs text-teal-700">
                Also by {coFaculty.map((p) => p.name).join(', ')}
              </div>
            )}
          </div>
        </label>
        <select
          value={theme}
          onChange={(e) =>
            setThemeOverrides((prev) => ({ ...prev, [work.id]: e.target.value as ThemeSlug }))
          }
          aria-label={`Theme for ${work.title}`}
          className={`w-40 shrink-0 rounded border px-1.5 py-1 text-xs ${
            isSelected && theme === '' ? 'border-red-400' : 'border-stone-300'
          }`}
        >
          <option value="" disabled>
            Theme…
          </option>
          {RESEARCH_THEMES.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.shortLabel}
            </option>
          ))}
        </select>
      </li>
    );
  };

  const renderGroup = (title: string, tone: string, rows: Row[], collapsible = false) => {
    if (rows.length === 0) return null;
    const open = !collapsible || showNotRelevant;
    return (
      <section key={title}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className={`text-xs font-semibold tracking-wide uppercase ${tone}`}>
            {collapsible ? (
              <button
                type="button"
                onClick={() => setShowNotRelevant((v) => !v)}
                className="flex items-center gap-1 uppercase hover:underline"
              >
                {title} ({rows.length})
                <ChevronDown size={13} className={open ? 'rotate-180' : ''} />
              </button>
            ) : (
              `${title} (${rows.length})`
            )}
          </h3>
          {open && (
            <button
              type="button"
              onClick={() => selectRows(rows)}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Tick all
            </button>
          )}
        </div>
        {open && (
          <ul className="max-h-[22rem] divide-y divide-stone-100 overflow-y-auto rounded border border-stone-200">
            {rows.map(renderRow)}
          </ul>
        )}
      </section>
    );
  };

  const verdictCount = (v: TriageVerdict) =>
    allNew.filter((r) => triage.get(r.work.id)?.verdict === v).length;

  return (
    <Modal
      title="Import from OpenAlex"
      subtitle="Pick a faculty member, review their papers, and add the ones that belong here"
      onClose={onClose}
      maxWidth="max-w-5xl"
      footer={
        person && !showLinker && works ? (
          <>
            <select
              value=""
              disabled={selectedNew.length === 0}
              onChange={(e) => setThemeForSelected(e.target.value as ThemeSlug)}
              className="mr-auto rounded border border-stone-300 px-2 py-2 text-sm disabled:opacity-50"
            >
              <option value="" disabled>
                Set theme for all ticked…
              </option>
              {RESEARCH_THEMES.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.label}
                </option>
              ))}
            </select>
            {missingTheme > 0 && (
              <span className="text-xs text-red-600">
                {missingTheme} ticked paper{missingTheme === 1 ? ' needs' : 's need'} a theme
              </span>
            )}
            <button
              type="button"
              onClick={handleMarkReviewed}
              disabled={marking || triaging || adding}
              title="Record that you've gone through this person's papers"
              className="rounded border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              {marking
                ? 'Saving…'
                : person.publications_reviewed_at
                  ? 'Mark reviewed again'
                  : 'Mark as reviewed'}
            </button>
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
              disabled={adding || triaging || selectedNew.length === 0 || missingTheme > 0}
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
            disabled={triaging}
            className="w-80 rounded border border-stone-300 px-3 py-2 text-sm"
          >
            <option value="">— Select a faculty member —</option>
            {sortedFaculty.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ·{' '}
                {p.publications_reviewed_at
                  ? `reviewed ${formatDate(p.publications_reviewed_at)}`
                  : 'not reviewed'}
                {p.openalex_author_id ? '' : ' (not linked yet)'}
              </option>
            ))}
          </select>
          <select
            value={facultyOrder}
            onChange={(e) => setFacultyOrder(e.target.value as FacultyOrder)}
            aria-label="Order faculty by"
            className="rounded border border-stone-300 px-2 py-2 text-xs text-stone-600"
          >
            <option value="needs-review">Needs review first</option>
            <option value="name">A–Z</option>
          </select>
          {person && authorId && !relinking && (
            <span className="text-xs text-stone-500">
              {person.publications_reviewed_at
                ? `Last reviewed ${formatDate(person.publications_reviewed_at)}`
                : 'Not reviewed yet'}{' '}
              · OpenAlex <span className="font-mono">{authorId}</span> ·{' '}
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
                <div className="flex items-center gap-3 rounded border border-teal-100 bg-teal-50/50 px-4 py-3">
                  <Sparkles size={16} className="shrink-0 text-teal-700" />
                  <div className="min-w-0 flex-1 text-xs text-stone-600">
                    {triaging && progress
                      ? `Reviewing papers… ${progress.done} of ${progress.total}`
                      : hasTriage
                        ? `AI review: ${verdictCount('recommended')} recommended · ${verdictCount('maybe')} maybe · ${verdictCount('not_relevant')} not relevant. These are suggestions — check them before adding.`
                        : 'Let AI sort these papers into recommended, maybe and not relevant, with a suggested theme for each. Nothing is added until you confirm.'}
                  </div>
                  {untriagedNew.length > 0 && (
                    <button
                      type="button"
                      onClick={runTriage}
                      disabled={triaging}
                      className="shrink-0 rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
                    >
                      {triaging
                        ? 'Reviewing…'
                        : hasTriage
                          ? `Review ${untriagedNew.length} more`
                          : `Get AI recommendations (${untriagedNew.length})`}
                    </button>
                  )}
                </div>
                {triageError && (
                  <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{triageError}</p>
                )}

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
                    {works.length} of {total} loaded · {selectedNew.length} ticked
                  </span>
                  {selectedNew.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelected(new Set())}
                      className="text-xs font-semibold text-stone-500 hover:underline"
                    >
                      Clear ticks
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => loadPage(1, true)}
                    disabled={loading || triaging}
                    title="Fetch again from OpenAlex"
                    className="flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-50"
                  >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : undefined} />
                    Refresh
                  </button>
                </div>

                {newRows.length === 0 ? (
                  <p className="py-4 text-sm text-stone-400">
                    {query ? 'No new papers match.' : 'Every loaded paper has been added.'}
                  </p>
                ) : hasTriage ? (
                  GROUPS.map((g) =>
                    renderGroup(
                      g.title,
                      g.tone,
                      newRows.filter((r) =>
                        g.verdict === 'unreviewed'
                          ? !triage.has(r.work.id)
                          : triage.get(r.work.id)?.verdict === g.verdict
                      ),
                      g.verdict === 'not_relevant'
                    )
                  )
                ) : (
                  renderGroup('New', 'text-stone-500', newRows)
                )}

                {hasMore && (
                  <button
                    type="button"
                    onClick={() => loadPage(page + 1)}
                    disabled={loading || triaging}
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
