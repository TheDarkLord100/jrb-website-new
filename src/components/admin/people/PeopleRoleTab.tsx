'use client';

import Image from 'next/image';
import { useState } from 'react';
import { GraduationCap, Search } from 'lucide-react';
import { batchesInUse, formatBatch } from '@/lib/batches';
import { DEPARTMENTS } from '@/lib/departments';
import type { Person, PersonRole } from '@/types/person';

const usesBatch = (role: PersonRole) => role === 'student' || role === 'alumni';

// Same order the public People page uses: priority first (null last),
// then name.
function comparePeople(a: Person, b: Person): number {
  const pa = a.priority ?? Infinity;
  const pb = b.priority ?? Infinity;
  if (pa !== pb) return pa - pb;
  return a.name.localeCompare(b.name);
}

function departmentLabel(value: string | null): string {
  if (!value) return '—';
  return DEPARTMENTS.find((d) => d.value === value)?.label ?? value;
}

// One role's table: search, a batch or department filter, and the rows.
// Columns change with the role, since each role uses different fields.
export default function PeopleRoleTab({
  role,
  people,
  onAdd,
  onEdit,
  onDelete,
  onPromote,
}: {
  role: PersonRole;
  people: Person[]; // everyone -- this tab filters to its own role
  onAdd: () => void;
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
  onPromote?: () => void; // students tab only
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const rows = people.filter((p) => p.role === role);
  const batches = usesBatch(role) ? batchesInUse(people, role, 'desc') : [];

  const query = search.trim().toLowerCase();
  const visibleRows = rows
    .filter((p) => {
      if (filter === 'all') return true;
      return role === 'faculty' ? p.department === filter : p.year === filter;
    })
    .filter(
      (p) =>
        !query ||
        [p.name, p.special_designation, p.research_interest, ...p.focus]
          .filter((v): v is string => !!v)
          .some((v) => v.toLowerCase().includes(query))
    )
    .sort(comparePeople);

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
              placeholder={
                role === 'faculty' ? 'Search by name, interest or keyword' : 'Search by name'
              }
              className="w-full rounded border border-gray-300 py-1.5 pr-3 pl-8 text-xs"
            />
          </div>

          {role === 'faculty' && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1.5 text-xs"
            >
              <option value="all">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          )}

          {usesBatch(role) && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1.5 text-xs"
            >
              <option value="all">All batches</option>
              {batches.map((b) => (
                <option key={b} value={b}>
                  {formatBatch(b)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-2">
          {onPromote && (
            <button
              type="button"
              onClick={onPromote}
              className="rounded bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
            >
              Move batch to alumni
            </button>
          )}
          <button
            type="button"
            onClick={onAdd}
            className="rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
              {role === 'faculty' && (
                <>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Department</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Keywords</th>
                </>
              )}
              {usesBatch(role) && (
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Batch</th>
              )}
              {role === 'postdoc' && (
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Year</th>
              )}
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Priority</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center text-gray-400">
                  {rows.length === 0
                    ? 'Nobody here yet. Click "+ Add" to create an entry.'
                    : 'No one matches the current search or filter.'}
                </td>
              </tr>
            )}

            {visibleRows.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-stone-100">
                      {p.image_url && (
                        <Image
                          src={p.image_url}
                          alt=""
                          fill
                          sizes="2.25rem"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                        {p.name}
                        {p.google_scholar_url && (
                          <GraduationCap
                            size={13}
                            className="text-stone-400"
                            aria-label="Has Google Scholar link"
                          />
                        )}
                      </div>
                      {p.special_designation && (
                        <div className="text-xs text-amber-700">{p.special_designation}</div>
                      )}
                    </div>
                  </div>
                </td>
                {role === 'faculty' && (
                  <>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {departmentLabel(p.department)}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-xs text-gray-500">
                      <span className="line-clamp-2">{p.focus.join(', ') || '—'}</span>
                    </td>
                  </>
                )}
                {usesBatch(role) && (
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {p.year ? formatBatch(p.year) : '—'}
                  </td>
                )}
                {role === 'postdoc' && (
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{p.year ?? '—'}</td>
                )}
                <td className="px-4 py-3 text-gray-600">{p.priority ?? '—'}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(p)}
                      className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(p)}
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
    </div>
  );
}