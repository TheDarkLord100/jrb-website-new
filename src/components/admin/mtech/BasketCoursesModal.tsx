'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { addCourseToBasket, removeCourseFromBasket } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import type { MtechBasket, MtechBasketCourseRow, MtechCourse } from '@/types/mtech';

export default function BasketCoursesModal({
  basket,
  initialMembers,
  allCourses,
  onClose,
  onChange,
}: {
  basket: MtechBasket;
  initialMembers: MtechBasketCourseRow[];
  allCourses: MtechCourse[];
  onClose: () => void;
  // Called after every add/remove/reorder so the parent panel's course
  // counts and preview stay in sync without a full refetch.
  onChange: (basketId: string, members: MtechBasketCourseRow[]) => void;
}) {
  const [members, setMembers] = useState<MtechBasketCourseRow[]>(
    [...initialMembers].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
  );
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const memberCourseIds = new Set(members.map((m) => m.course_id));
  const query = search.trim().toLowerCase();
  const availableCourses = allCourses
    .filter((c) => !memberCourseIds.has(c.id))
    .filter((c) =>
      query
        ? [c.code, c.title]
            .filter((v): v is string => !!v)
            .some((v) => v.toLowerCase().includes(query))
        : true
    );

  const handleAdd = async (course: MtechCourse) => {
    setBusy(true);
    const row = await addCourseToBasket(basket.id, course.id, members.length);
    setBusy(false);

    if (!row) {
      toast.error('Failed to add the course. Check the console for details.');
      return;
    }
    const updated = [...members, row];
    setMembers(updated);
    onChange(basket.id, updated);
    toast.success(`Added "${course.title}" to the basket.`);
  };

  const handleRemove = async (row: MtechBasketCourseRow) => {
    if (!confirm(`Remove "${row.course.title}" from this basket?`)) return;

    setBusy(true);
    const ok = await removeCourseFromBasket(row.id);
    setBusy(false);

    if (!ok) {
      toast.error('Failed to remove the course. Check the console for details.');
      return;
    }
    const updated = members.filter((m) => m.id !== row.id);
    setMembers(updated);
    onChange(basket.id, updated);
    toast.success(`Removed "${row.course.title}" from the basket.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">
              {basket.name ?? 'Untitled basket'}
            </h2>
            <p className="text-xs text-stone-400">Manage which courses count as this basket</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h3 className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
            In this basket ({members.length})
          </h3>
          {members.length === 0 ? (
            <p className="mt-2 text-sm text-stone-400">No courses added yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-stone-100 rounded border border-stone-200">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-3 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-xs text-stone-500">{m.course.code ?? '—'}</span>{' '}
                    <span className="text-sm text-stone-800">{m.course.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(m)}
                    className="rounded p-1 text-stone-400 hover:bg-red-50 hover:text-red-700"
                    aria-label="Remove from basket"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <h3 className="mt-6 text-xs font-semibold tracking-wide text-stone-500 uppercase">
            Add a course
          </h3>
          <div className="relative mt-2">
            <Search
              size={14}
              className="absolute top-1/2 left-2.5 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the course catalog by title or code"
              className="w-full rounded border border-stone-300 py-1.5 pr-3 pl-8 text-sm"
            />
          </div>

          <ul className="mt-2 max-h-56 divide-y divide-stone-100 overflow-y-auto rounded border border-stone-200">
            {availableCourses.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-stone-400">
                {allCourses.length === memberCourseIds.size
                  ? 'Every course in the catalog is already in this basket.'
                  : 'No matching courses.'}
              </li>
            )}
            {availableCourses.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 px-3 py-2">
                <div className="min-w-0">
                  <span className="font-mono text-xs text-stone-500">{c.code ?? '—'}</span>{' '}
                  <span className="text-sm text-stone-800">{c.title}</span>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleAdd(c)}
                  className="shrink-0 rounded bg-teal-700 px-2 py-1 text-xs font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
                >
                  + Add
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end border-t border-stone-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
