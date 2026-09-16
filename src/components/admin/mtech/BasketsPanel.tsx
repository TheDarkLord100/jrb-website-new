'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react';
import { useMtechBaskets } from '@/lib/hooks/useMtechBaskets';
import { useMtechBasketCourses } from '@/lib/hooks/useMtechBasketCourses';
import { useMtechCourses } from '@/lib/hooks/useMtechCourses';
import { deleteMtechBasket } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import BasketFormModal from './BasketFormModal';
import BasketCoursesModal from './BasketCoursesModal';
import type { MtechBasket, MtechBasketCourseRow } from '@/types/mtech';

type SortField = 'name' | 'count';
type SortDirection = 'asc' | 'desc';

function SortableHeader({
  label,
  field,
  sort,
  onSort,
}: {
  label: string;
  field: SortField;
  sort: { field: SortField | null; direction: SortDirection };
  onSort: (field: SortField) => void;
}) {
  const isActive = sort.field === field;
  const Icon = isActive ? (sort.direction === 'asc' ? ChevronUp : ChevronDown) : ChevronsUpDown;

  return (
    <th className="px-4 py-3 text-left font-semibold text-gray-600">
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex items-center gap-1 hover:text-gray-900"
      >
        {label}
        <Icon size={13} className={isActive ? 'text-teal-700' : 'text-gray-400'} />
      </button>
    </th>
  );
}

export default function BasketsPanel() {
  const { items: basketItems, error: basketsError } = useMtechBaskets();
  const { items: basketCourseItems, error: basketCoursesError } = useMtechBasketCourses();
  const { items: courseItems } = useMtechCourses();
  const toast = useToast();

  const [baskets, setBaskets] = useState<MtechBasket[] | null>(null);
  const [basketCourses, setBasketCourses] = useState<MtechBasketCourseRow[] | null>(null);
  const [editingBasket, setEditingBasket] = useState<MtechBasket | null>(null); // null = closed
  const [isCreating, setIsCreating] = useState(false);
  const [managingBasket, setManagingBasket] = useState<MtechBasket | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ field: SortField | null; direction: SortDirection }>({
    field: null,
    direction: 'asc',
  });

  useEffect(() => {
    if (basketItems) setBaskets(basketItems);
  }, [basketItems]);

  useEffect(() => {
    if (basketCourseItems) setBasketCourses(basketCourseItems);
  }, [basketCourseItems]);

  if (basketsError || basketCoursesError) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn&apos;t load baskets right now. Please try again shortly.
      </p>
    );
  }

  if (!baskets || !basketCourses) {
    return (
      <div className="animate-pulse space-y-3 py-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-full rounded bg-gray-100" />
        ))}
      </div>
    );
  }

  const toggleSort = (field: SortField) => {
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'asc' }
    );
  };

  const combined = baskets.map((b) => ({
    ...b,
    courses: basketCourses.filter((bc) => bc.bucket_id === b.id),
  }));

  const query = search.trim().toLowerCase();
  const filtered = query
    ? combined.filter(
        (b) =>
          (b.name ?? '').toLowerCase().includes(query) ||
          b.courses.some((bc) =>
            [bc.course.code, bc.course.title]
              .filter((v): v is string => !!v)
              .some((v) => v.toLowerCase().includes(query))
          )
      )
    : combined;

  const visible = sort.field
    ? [...filtered].sort((a, b) => {
        const cmp =
          sort.field === 'name'
            ? (a.name ?? '').localeCompare(b.name ?? '')
            : a.courses.length - b.courses.length;
        return sort.direction === 'asc' ? cmp : -cmp;
      })
    : filtered;

  const deleteRow = async (row: MtechBasket) => {
    if (
      !confirm(
        `Delete "${row.name ?? 'this untitled basket'}"? It will also be removed from any ` +
          `specialization requirement lists and eligibility constraints it's used in. This can't be undone.`
      )
    )
      return;

    const ok = await deleteMtechBasket(row.id);
    if (!ok) {
      toast.error('Failed to delete the basket. Check the console for details.');
      return;
    }
    setBaskets((prev) => prev!.filter((b) => b.id !== row.id));
    setBasketCourses((prev) => (prev ? prev.filter((bc) => bc.bucket_id !== row.id) : prev));
    toast.success(`"${row.name ?? 'Untitled basket'}" deleted.`);
  };

  const handleSaved = (saved: MtechBasket) => {
    setBaskets((prev) => {
      if (!prev) return prev;
      const exists = prev.some((b) => b.id === saved.id);
      return exists ? prev.map((b) => (b.id === saved.id ? saved : b)) : [...prev, saved];
    });
    setEditingBasket(null);
    setIsCreating(false);
  };

  const handleMembersChanged = (basketId: string, members: MtechBasketCourseRow[]) => {
    setBasketCourses((prev) => {
      if (!prev) return prev;
      const withoutThisBasket = prev.filter((bc) => bc.bucket_id !== basketId);
      return [...withoutThisBasket, ...members];
    });
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="relative w-72">
          <Search size={14} className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by basket name or member course"
            className="w-full rounded border border-gray-300 py-1.5 pr-3 pl-8 text-xs"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
        >
          + Add basket
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader label="Name" field="name" sort={sort} onSort={toggleSort} />
              <SortableHeader label="# Courses" field="count" sort={sort} onSort={toggleSort} />
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Preview</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {baskets.length === 0 && (
              <tr>
                <td colSpan={4} className="py-16 text-center text-gray-400">
                  No baskets yet. Click &quot;Add basket&quot; to create one.
                </td>
              </tr>
            )}

            {baskets.length > 0 && visible.length === 0 && (
              <tr>
                <td colSpan={4} className="py-16 text-center text-gray-400">
                  No baskets match &quot;{search}&quot;.
                </td>
              </tr>
            )}

            {visible.map((row) => {
              const preview = [...row.courses]
                .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
                .map((bc) => bc.course.code ?? bc.course.title);

              return (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-stone-900">
                    {row.name ?? <span className="text-gray-400 italic">Untitled</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.courses.length}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-xs text-gray-500">
                    {preview.length > 0 ? preview.join(' / ') : '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setManagingBasket(row)}
                        className="rounded bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100"
                      >
                        Manage courses
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBasket(row)}
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
              );
            })}
          </tbody>
        </table>
      </div>

      {(editingBasket || isCreating) && (
        <BasketFormModal
          initial={editingBasket ?? undefined}
          onClose={() => {
            setEditingBasket(null);
            setIsCreating(false);
          }}
          onSaved={handleSaved}
        />
      )}

      {managingBasket && (
        <BasketCoursesModal
          basket={managingBasket}
          initialMembers={basketCourses.filter((bc) => bc.bucket_id === managingBasket.id)}
          allCourses={courseItems ?? []}
          onClose={() => setManagingBasket(null)}
          onChange={handleMembersChanged}
        />
      )}
    </div>
  );
}
