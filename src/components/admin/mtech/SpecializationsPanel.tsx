'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { useMtechSpecializationCards } from '@/lib/hooks/useMtechSpecializationCards';
import { useMtechCourses } from '@/lib/hooks/useMtechCourses';
import { useMtechBaskets } from '@/lib/hooks/useMtechBaskets';
import { deleteMtechSpecialization, updateMtechSpecializationOrder } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import { getLucideIcon } from '@/lib/lucideIconMap';
import SpecializationFormModal from './SpecializationFormModal';
import SpecializationRequirementsModal from './SpecializationRequirementsModal';
import type { MtechCard } from '@/types/mtech';

export default function SpecializationsPanel() {
  const { items, error } = useMtechSpecializationCards();
  const { items: courseItems } = useMtechCourses();
  const { items: basketItems } = useMtechBaskets();
  const toast = useToast();

  const [rows, setRows] = useState<MtechCard[] | null>(null);
  const [editingRow, setEditingRow] = useState<MtechCard | null>(null); // null = closed
  const [isCreating, setIsCreating] = useState(false);
  const [managingRow, setManagingRow] = useState<MtechCard | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (items) setRows(items);
  }, [items]);

  if (error) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn&apos;t load specializations right now. Please try again shortly.
      </p>
    );
  }

  if (!rows) {
    return (
      <div className="animate-pulse space-y-3 py-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-full rounded bg-gray-100" />
        ))}
      </div>
    );
  }

  const query = search.trim().toLowerCase();
  const visible = query
    ? rows.filter(
        (r) => r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query)
      )
    : rows;

  // Reordering is disabled while a search filter is active -- swapping two
  // rows only makes sense against the full, unfiltered list.
  const canReorder = !query;

  const persistOrder = async (ordered: MtechCard[]) => {
    const results = await Promise.all(ordered.map((r, i) => updateMtechSpecializationOrder(r.id, i)));
    if (results.every(Boolean)) {
      toast.success('Order updated.');
    } else {
      toast.error('Failed to save the new order. Check the console for details.');
    }
  };

  const moveRow = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;

    const reordered = [...rows];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setRows(reordered);
    persistOrder(reordered);
  };

  const deleteRow = async (row: MtechCard) => {
    if (
      !confirm(
        `Delete "${row.title}"? Its requirement list and eligibility constraints will be deleted too ` +
          `(the courses and baskets it referenced are not affected). This can't be undone.`
      )
    )
      return;

    const ok = await deleteMtechSpecialization(row.id);
    if (!ok) {
      toast.error('Failed to delete the specialization. Check the console for details.');
      return;
    }
    setRows((prev) => prev!.filter((r) => r.id !== row.id));
    toast.success(`"${row.title}" deleted.`);
  };

  const handleSaved = (saved: MtechCard) => {
    setRows((prev) => {
      if (!prev) return prev;
      const exists = prev.some((r) => r.id === saved.id);
      return exists ? prev.map((r) => (r.id === saved.id ? saved : r)) : [...prev, saved];
    });
    setEditingRow(null);
    setIsCreating(false);
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
            placeholder="Search by title or description"
            className="w-full rounded border border-gray-300 py-1.5 pr-3 pl-8 text-xs"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
        >
          + Add specialization
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Order</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Icon</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-gray-400">
                  No specializations yet. Click &quot;Add specialization&quot; to create one.
                </td>
              </tr>
            )}

            {rows.length > 0 && visible.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-gray-400">
                  No specializations match &quot;{search}&quot;.
                </td>
              </tr>
            )}

            {visible.map((row) => {
              const Icon = getLucideIcon(row.icon);
              const index = rows.findIndex((r) => r.id === row.id);
              return (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <button
                        type="button"
                        disabled={!canReorder || index === 0}
                        onClick={() => moveRow(index, -1)}
                        className="text-gray-400 hover:text-gray-700 disabled:opacity-20"
                        aria-label="Move up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={!canReorder || index === rows.length - 1}
                        onClick={() => moveRow(index, 1)}
                        className="text-gray-400 hover:text-gray-700 disabled:opacity-20"
                        aria-label="Move down"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded border border-amber-200 bg-amber-50/60">
                      <Icon size={15} className="text-amber-700" strokeWidth={1.75} />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-stone-900">{row.title}</td>
                  <td className="max-w-sm truncate px-4 py-3 text-gray-500">{row.description}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setManagingRow(row)}
                        className="rounded bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100"
                      >
                        Manage requirements
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingRow(row)}
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

      {(editingRow || isCreating) && (
        <SpecializationFormModal
          initial={editingRow ?? undefined}
          onClose={() => {
            setEditingRow(null);
            setIsCreating(false);
          }}
          onSaved={handleSaved}
        />
      )}

      {managingRow && (
        <SpecializationRequirementsModal
          specialization={managingRow}
          allCourses={courseItems ?? []}
          allBaskets={basketItems ?? []}
          onClose={() => setManagingRow(null)}
        />
      )}
    </div>
  );
}