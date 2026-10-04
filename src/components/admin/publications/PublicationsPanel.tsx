'use client';

import { useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { useAllPublications } from '@/lib/hooks/useAllPublications';
import { usePeople } from '@/lib/hooks/usePeople';
import { deletePublication } from '@/lib/supabase/queries';
import { RESEARCH_THEMES, getTheme, type ThemeSlug } from '@/lib/researchThemes';
import { useToast } from '@/components/admin/Toast';
import PublicationFormModal from './PublicationFormModal';
import OpenAlexImportModal from './OpenAlexImportModal';
import type { Person } from '@/types/person';
import type { Publication } from '@/types/publication';

// Newest first, then by title.
function comparePublications(a: Publication, b: Publication): number {
  return (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title);
}

export default function PublicationsPanel() {
  const { items: rows, setItems: setRows, error } = useAllPublications();
  const { people, setPeople } = usePeople();
  const toast = useToast();

  const [editing, setEditing] = useState<Publication | null>(null);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState<ThemeSlug | 'all'>('all');
  const [facultyFilter, setFacultyFilter] = useState('all');

  if (error) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn't load publications right now. Please try again shortly.
      </p>
    );
  }

  if (!rows || !people) {
    return (
      <div className="animate-pulse space-y-3 py-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full rounded bg-gray-100" />
        ))}
      </div>
    );
  }

  const faculty = people
    .filter((p) => p.role === 'faculty')
    .sort((a, b) => a.name.localeCompare(b.name));
  const nameById = new Map(people.map((p) => [p.id, p.name]));

  const query = search.trim().toLowerCase();
  const visibleRows = rows
    .filter((r) => themeFilter === 'all' || r.theme_slug === themeFilter)
    .filter((r) => facultyFilter === 'all' || r.person_ids.includes(facultyFilter))
    .filter(
      (r) =>
        !query ||
        [r.title, r.authors, r.venue, r.doi]
          .filter((v): v is string => !!v)
          .some((v) => v.toLowerCase().includes(query))
    )
    .sort(comparePublications);

  const upsertRows = (saved: Publication[]) =>
    setRows((prev) => {
      const next = [...(prev ?? [])];
      for (const pub of saved) {
        const i = next.findIndex((r) => r.id === pub.id);
        if (i === -1) next.push(pub);
        else next[i] = pub;
      }
      return next;
    });

  const handlePersonUpdated = (updated: Person) =>
    setPeople((prev) => prev?.map((p) => (p.id === updated.id ? updated : p)) ?? prev);

  const deleteRow = async (row: Publication) => {
    if (!confirm(`Delete "${row.title}"? This can't be undone.`)) return;
    const ok = await deletePublication(row.id);
    if (!ok) {
      toast.error('Failed to delete. Check the console for details.');
      return;
    }
    setRows((prev) => prev?.filter((r) => r.id !== row.id) ?? prev);
    toast.success('Publication deleted.');
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative w-72">
            <Search
              size={14}
              className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, authors, venue or DOI"
              className="w-full rounded border border-gray-300 py-1.5 pr-3 pl-8 text-xs"
            />
          </div>

          <select
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value as ThemeSlug | 'all')}
            className="rounded border border-gray-300 px-2 py-1.5 text-xs"
          >
            <option value="all">All themes</option>
            {RESEARCH_THEMES.map((theme) => (
              <option key={theme.slug} value={theme.slug}>
                {theme.shortLabel}
              </option>
            ))}
          </select>

          <select
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="max-w-48 rounded border border-gray-300 px-2 py-1.5 text-xs"
          >
            <option value="all">All faculty</option>
            {faculty.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setImporting(true)}
            className="rounded bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
          >
            Import from OpenAlex
          </button>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
          >
            + Add publication
          </button>
        </div>
      </div>

      <p className="mb-3 text-xs text-stone-500">
        {visibleRows.length} of {rows.length} publications
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Publication</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Theme</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Faculty</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Cited</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center text-gray-400">
                  {rows.length === 0
                    ? 'No publications yet. Import from OpenAlex or add one by hand.'
                    : 'No publications match the current search or filters.'}
                </td>
              </tr>
            )}

            {visibleRows.map((row) => (
              <tr key={row.id} className="align-top hover:bg-gray-50">
                <td className="max-w-xl px-4 py-3">
                  <div className="flex items-start gap-1.5 font-semibold text-stone-900">
                    <span>{row.title}</span>
                    {row.url && (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open publication"
                        className="mt-0.5 shrink-0 text-stone-400 hover:text-teal-700"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    {[row.venue, row.year].filter(Boolean).join(' · ') || '—'}
                    {!row.openalex_id && <span className="ml-2 text-stone-400">(manual)</span>}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {getTheme(row.theme_slug)?.shortLabel ?? row.theme_slug}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {row.person_ids.length === 0 ? (
                    <span className="text-amber-700">None linked</span>
                  ) : (
                    row.person_ids.map((id) => nameById.get(id) ?? 'Unknown').join(', ')
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{row.cited_by_count ?? '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      row.is_published ? 'bg-teal-50 text-teal-700' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {row.is_published ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(row)}
                      className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRow(row)}
                      className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {importing && (
        <OpenAlexImportModal
          faculty={faculty}
          publications={rows}
          onPersonUpdated={handlePersonUpdated}
          onAdded={upsertRows}
          onClose={() => setImporting(false)}
        />
      )}

      {(editing || creating) && (
        <PublicationFormModal
          key={editing?.id ?? 'new'}
          initial={editing ?? undefined}
          faculty={faculty}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={(saved) => {
            upsertRows([saved]);
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}