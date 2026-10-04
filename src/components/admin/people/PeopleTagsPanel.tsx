'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { deletePeopleTag } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import PeopleTagFormModal from './PeopleTagFormModal';
import type { Person } from '@/types/person';
import type { PeopleTag, PeopleTagInput } from '@/types/peopleTag';

const RECOMMENDATION_COUNT = 10;

// How many faculty a tag would match -- the same case-insensitive
// substring test the public People page uses.
function matchCount(keyword: string, faculty: Person[]): number {
  const k = keyword.toLowerCase();
  return faculty.filter((p) => p.focus.join(' ').toLowerCase().includes(k)).length;
}

// The most-used focus keywords across faculty that aren't tags yet, each
// with how many faculty use it.
function recommendTags(faculty: Person[], tags: PeopleTag[]) {
  const existing = new Set(tags.map((t) => t.keyword.toLowerCase()));
  const counts = new Map<string, number>();
  for (const person of faculty) {
    // Count each keyword once per person, however they spelled its case.
    for (const keyword of new Set(person.focus.map((k) => k.trim().toLowerCase()))) {
      if (keyword && !existing.has(keyword)) counts.set(keyword, (counts.get(keyword) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, RECOMMENDATION_COUNT)
    .map(([keyword, count]) => ({ keyword, count }));
}

function titleCase(text: string): string {
  return text.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PeopleTagsPanel({
  tags,
  setTags,
  people,
}: {
  tags: PeopleTag[];
  setTags: React.Dispatch<React.SetStateAction<PeopleTag[]>>;
  people: Person[];
}) {
  const toast = useToast();
  const [editing, setEditing] = useState<PeopleTag | null>(null);
  const [creating, setCreating] = useState<Partial<PeopleTagInput> | null>(null);
  const [showRecommended, setShowRecommended] = useState(false);

  const faculty = people.filter((p) => p.role === 'faculty');
  const sortedTags = [...tags].sort(
    (a, b) => a.display_order - b.display_order || a.label.localeCompare(b.label)
  );
  const recommended = recommendTags(faculty, tags);
  const nextOrder = tags.reduce((max, t) => Math.max(max, t.display_order), -1) + 1;

  const handleSaved = (saved: PeopleTag) => {
    setTags((prev) =>
      prev.some((t) => t.id === saved.id)
        ? prev.map((t) => (t.id === saved.id ? saved : t))
        : [...prev, saved]
    );
    setEditing(null);
    setCreating(null);
  };

  const handleDelete = async (tag: PeopleTag) => {
    if (!confirm(`Delete the "${tag.label}" filter tag?`)) return;
    const ok = await deletePeopleTag(tag.id);
    if (!ok) {
      toast.error('Failed to delete the tag. Check the console for details.');
      return;
    }
    setTags((prev) => prev.filter((t) => t.id !== tag.id));
    toast.success(`"${tag.label}" deleted.`);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs text-stone-500">
          Filter pills on the public Faculty tab. A tag matches faculty whose focus keywords contain
          its keyword.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setShowRecommended((v) => !v)}
            className="flex items-center gap-1.5 rounded bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
          >
            <Sparkles size={13} />
            {showRecommended ? 'Hide recommendations' : 'Recommended tags'}
          </button>
          <button
            type="button"
            onClick={() => setCreating({ display_order: nextOrder })}
            className="rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
          >
            + Add tag
          </button>
        </div>
      </div>

      {showRecommended && (
        <div className="mb-4 rounded border border-amber-200 bg-amber-50/50 p-4">
          <h3 className="text-xs font-semibold tracking-wide text-amber-800 uppercase">
            Most-used focus keywords that aren&apos;t tags yet
          </h3>
          {recommended.length === 0 ? (
            <p className="mt-2 text-sm text-stone-500">
              No recommendations. Every focus keyword in use is already a tag.
            </p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {recommended.map(({ keyword, count }) => (
                <li
                  key={keyword}
                  className="flex items-center gap-2 rounded border border-stone-200 bg-white py-1 pr-1 pl-3 text-sm"
                >
                  <span className="text-stone-800">{keyword}</span>
                  <span className="text-xs text-stone-400">{count} faculty</span>
                  <button
                    type="button"
                    onClick={() =>
                      setCreating({ keyword, label: titleCase(keyword), display_order: nextOrder })
                    }
                    className="rounded bg-teal-700 px-2 py-0.5 text-xs font-semibold text-white hover:bg-teal-800"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Label</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Keyword</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Matches</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Order</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedTags.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-gray-400">
                  No filter tags yet. Add one, or start from the recommendations.
                </td>
              </tr>
            )}
            {sortedTags.map((tag) => {
              const matches = matchCount(tag.keyword, faculty);
              return (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-stone-900">{tag.label}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{tag.keyword}</td>
                  <td
                    className={`px-4 py-3 text-xs ${matches === 0 ? 'text-amber-700' : 'text-gray-600'}`}
                  >
                    {matches === 0 ? 'No faculty' : `${matches} faculty`}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{tag.display_order}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(tag)}
                        className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(tag)}
                        className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <PeopleTagFormModal
          key={editing?.id ?? creating?.keyword ?? 'new'}
          initial={editing ?? undefined}
          prefill={creating ?? undefined}
          onClose={() => {
            setEditing(null);
            setCreating(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}