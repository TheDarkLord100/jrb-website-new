'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { searchOpenAlexAuthors, type OpenAlexAuthor } from '@/lib/openalex';
import { updatePerson } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import type { Person } from '@/types/person';

// Finds a faculty member's OpenAlex profile and saves its id on their
// `people` row, once. Name searches can return namesakes, so the admin
// picks the right one by institution and paper count; an ORCID gives an
// exact match (and doesn't use up the daily allowance).
export default function AuthorLinker({
  person,
  onLinked,
  onCancel,
}: {
  person: Person;
  onLinked: (updated: Person) => void;
  onCancel?: () => void; // shown when re-linking an already linked person
}) {
  const [query, setQuery] = useState(person.name);
  const [results, setResults] = useState<OpenAlexAuthor[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const search = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    try {
      setResults(await searchOpenAlexAuthors(query));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed.');
    } finally {
      setSearching(false);
    }
  };

  const link = async (author: OpenAlexAuthor) => {
    setSaving(author.id);
    const updated = await updatePerson(person.id, { openalex_author_id: author.id });
    setSaving(null);
    if (!updated) {
      toast.error('Failed to save the OpenAlex profile. Check the console for details.');
      return;
    }
    toast.success(`${person.name} linked to OpenAlex.`);
    onLinked(updated);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-600">
        <strong>{person.name}</strong> isn&apos;t linked to an OpenAlex profile yet. Search by name,
        or paste their ORCID for an exact match.
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                search();
              }
            }}
            placeholder="Name or ORCID (0000-0002-…)"
            className="w-full rounded border border-stone-300 py-2 pr-3 pl-8 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={search}
          disabled={searching}
          className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {searching ? 'Searching…' : 'Search'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded px-3 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100"
          >
            Cancel
          </button>
        )}
      </div>

      {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {results && results.length === 0 && (
        <p className="py-6 text-center text-sm text-stone-400">
          No OpenAlex profiles found. Try a shorter name, or their ORCID.
        </p>
      )}

      {results && results.length > 0 && (
        <ul className="divide-y divide-stone-100 rounded border border-stone-200">
          {results.map((author) => (
            <li key={author.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <div className="font-semibold text-stone-900">{author.name}</div>
                <div className="text-xs text-stone-500">
                  {author.institution ?? 'Institution unknown'} · {author.worksCount} works ·{' '}
                  {author.citedByCount} citations
                  {author.orcid && <> · ORCID {author.orcid}</>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => link(author)}
                disabled={saving !== null}
                className="shrink-0 rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
              >
                {saving === author.id ? 'Saving…' : 'This is them'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}