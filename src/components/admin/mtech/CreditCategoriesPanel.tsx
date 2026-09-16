'use client';

import { useEffect, useState } from 'react';
import { useMtechCreditCategories } from '@/lib/hooks/useMtechCreditCategories';
import { deleteMtechCreditCategory } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import CreditCategoryFormModal from './CreditCategoryFormModal';
import type { MtechCreditCategory } from '@/types/mtech';

export default function CreditCategoriesPanel() {
  const { items, error } = useMtechCreditCategories();
  const toast = useToast();

  const [rows, setRows] = useState<MtechCreditCategory[] | null>(null);
  const [editingRow, setEditingRow] = useState<MtechCreditCategory | null>(null); // null = closed
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (items) setRows(items);
  }, [items]);

  if (error) {
    return (
      <p className="py-10 text-center text-gray-500">
        Couldn&apos;t load credit categories right now. Please try again shortly.
      </p>
    );
  }

  if (!rows) {
    return (
      <div className="animate-pulse space-y-3 py-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 w-full rounded bg-gray-100" />
        ))}
      </div>
    );
  }

  const sorted = [...rows].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  const total = rows.reduce((sum, r) => sum + r.credits, 0);

  const deleteRow = async (row: MtechCreditCategory) => {
    if (!confirm(`Delete "${row.category}"? This can't be undone.`)) return;

    const ok = await deleteMtechCreditCategory(row.id);
    if (!ok) {
      toast.error('Failed to delete the row. Check the console for details.');
      return;
    }
    setRows((prev) => prev!.filter((r) => r.id !== row.id));
    toast.success(`"${row.category}" deleted.`);
  };

  const handleSaved = (saved: MtechCreditCategory) => {
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
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">Curriculum structure</h3>
          <p className="text-xs text-stone-400">
            The credit-breakdown table under &quot;Curriculum Structure&quot; on the page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
        >
          + Add row
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Credits</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-400">
                  No rows yet. Click &quot;Add row&quot; to create one.
                </td>
              </tr>
            )}

            {sorted.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-stone-900">{row.category}</td>
                <td className="px-4 py-3 text-gray-600">{row.description}</td>
                <td className="px-4 py-3 text-gray-600">{row.credits}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-2">
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
            ))}
            {sorted.length > 0 && (
              <tr className="bg-gray-50 font-semibold text-stone-900">
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3">{total}</td>
                <td className="px-4 py-3"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(editingRow || isCreating) && (
        <CreditCategoryFormModal
          initial={editingRow ?? undefined}
          onClose={() => {
            setEditingRow(null);
            setIsCreating(false);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
