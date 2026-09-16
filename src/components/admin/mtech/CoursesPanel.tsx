'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react';
import { useMtechCourses } from '@/lib/hooks/useMtechCourses';
import { deleteMtechCourse } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import CourseFormModal from './CourseFormModal';
import type { MtechCourse } from '@/types/mtech';

// Same order the public Semester-wise Plan groups courses by -- used to
// rank semesters for sorting rather than alphabetically.
const SEMESTER_ORDER = [
  'Semester I',
  'Winter Break',
  'Semester II',
  'Summer Term',
  'Semester III',
  'Semester IV',
];

type SortField = 'category' | 'semester';
type SortDirection = 'asc' | 'desc';

function semesterRank(semester: string | null): number {
  if (!semester) return SEMESTER_ORDER.length;
  const idx = SEMESTER_ORDER.indexOf(semester);
  return idx === -1 ? SEMESTER_ORDER.length : idx;
}

function formatLTP(row: MtechCourse): string {
  return `${row.l ?? '—'}-${row.t ?? '—'}-${row.p ?? '—'}`;
}

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

export default function CoursesPanel() {
  const { items, error } = useMtechCourses();
  const toast = useToast();
  const [rows, setRows] = useState<MtechCourse[] | null>(null);
  const [editingRow, setEditingRow] = useState<MtechCourse | null>(null); // null = closed
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ field: SortField | null; direction: SortDirection }>({
    field: null,
    direction: 'asc',
  });

  useEffect(() => {
    if (items) setRows(items);
  }, [items]);

  if (error) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn&apos;t load courses right now. Please try again shortly.
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

  const toggleSort = (field: SortField) => {
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'asc' }
    );
  };

  const query = search.trim().toLowerCase();
  const filteredRows = query
    ? rows.filter((r) =>
        [r.title, r.code, r.category, r.semester]
          .filter((v): v is string => !!v)
          .some((v) => v.toLowerCase().includes(query))
      )
    : rows;

  const visibleRows = sort.field
    ? [...filteredRows].sort((a, b) => {
        const cmp =
          sort.field === 'category'
            ? a.category.localeCompare(b.category)
            : semesterRank(a.semester) - semesterRank(b.semester);
        return sort.direction === 'asc' ? cmp : -cmp;
      })
    : filteredRows;

  const deleteRow = async (row: MtechCourse) => {
    if (
      !confirm(
        `Delete "${row.title}"? This will also remove it from any baskets or specialization course lists it's part of. This can't be undone.`
      )
    )
      return;

    const ok = await deleteMtechCourse(row.id);
    if (!ok) {
      toast.error('Failed to delete the course. Check the console for details.');
      return;
    }
    setRows((prev) => prev!.filter((r) => r.id !== row.id));
    toast.success(`"${row.title}" deleted.`);
  };

  const handleSaved = (saved: MtechCourse) => {
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
            placeholder="Search by title, code, category, or semester"
            className="w-full rounded border border-gray-300 py-1.5 pr-3 pl-8 text-xs"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
        >
          + Add course
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Code</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
              <SortableHeader label="Category" field="category" sort={sort} onSort={toggleSort} />
              <SortableHeader label="Semester" field="semester" sort={sort} onSort={toggleSort} />
              <th className="px-4 py-3 text-left font-semibold text-gray-600">L-T-P</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Credits</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center text-gray-400">
                  No courses yet. Click &quot;Add course&quot; to create one.
                </td>
              </tr>
            )}

            {rows.length > 0 && visibleRows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center text-gray-400">
                  No courses match &quot;{search}&quot;.
                </td>
              </tr>
            )}

            {visibleRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-gray-500">
                  {row.code ?? '—'}
                </td>
                <td className="px-4 py-3 font-semibold text-stone-900">{row.title}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">
                  {row.category.replace(/_/g, ' ')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.semester ?? '—'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatLTP(row)}</td>
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
          </tbody>
        </table>
      </div>

      {(editingRow || isCreating) && (
        <CourseFormModal
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
