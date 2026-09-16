'use client';

import { useEffect, useState } from 'react';
import { useMtechSections } from '@/lib/hooks/useMtechSections';
import { deleteMtechSection } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import SectionFormModal from './SectionFormModal';
import type { MtechSection } from '@/types/mtech';

// Strips Markdown syntax down to plain text for the table's preview column
// -- doesn't need to be perfect, just readable at a glance.
function plainPreview(markdown: string): string {
  return markdown
    .replace(/\*\*|__|\*|_|~~|`/g, '')
    .replace(/#+\s*/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();
}

export default function SectionsPanel() {
  const { items, error } = useMtechSections();
  const toast = useToast();

  const [rows, setRows] = useState<MtechSection[] | null>(null);
  const [editingRow, setEditingRow] = useState<MtechSection | null>(null); // null = closed
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (items) setRows(items);
  }, [items]);

  if (error) {
    return (
      <p className="py-10 text-center text-gray-500">
        Couldn&apos;t load sections right now. Please try again shortly.
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

  // display_order is one flat sequence across the whole table, spanning
  // every section_key -- not scoped per key -- so sort by it alone.
  const sorted = [...rows].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const deleteRow = async (row: MtechSection) => {
    if (!confirm(`Delete this "${row.section_key}" block? This can't be undone.`)) return;

    const ok = await deleteMtechSection(row.id);
    if (!ok) {
      toast.error('Failed to delete the section. Check the console for details.');
      return;
    }
    setRows((prev) => prev!.filter((r) => r.id !== row.id));
    toast.success('Section deleted.');
  };

  const handleSaved = (saved: MtechSection) => {
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
          <h3 className="text-sm font-semibold text-stone-800">Content sections</h3>
          <p className="text-xs text-stone-400">
            Overview, Learning Outcomes, and the other Markdown text blocks on the page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
        >
          + Add section
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Section</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Preview</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-400">
                  No sections yet. Click &quot;Add section&quot; to create one.
                </td>
              </tr>
            )}

            {sorted.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-gray-500">
                  {row.section_key}
                </td>
                <td className="px-4 py-3 text-gray-700">{row.title ?? '—'}</td>
                <td className="max-w-xs truncate px-4 py-3 text-xs text-gray-500">
                  {plainPreview(row.body_markdown) || '—'}
                </td>
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
          </tbody>
        </table>
      </div>

      {(editingRow || isCreating) && (
        <SectionFormModal
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
