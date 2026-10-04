'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { RESEARCH_THEMES } from '@/lib/researchThemes';

export type GridRow = {
  id: string;
  name: string;
  note?: string; // shown under the name, e.g. a role mismatch warning
};

// A rows-by-themes checkbox grid. Each tick is saved immediately by
// `onToggle`; the box is disabled while that save is in flight, and the
// caller reverts its own state if the save fails.
export default function ThemeLinkGrid({
  rows,
  isLinked,
  onToggle,
  pending,
  itemLabel,
}: {
  rows: GridRow[];
  isLinked: (rowId: string, themeSlug: string) => boolean;
  onToggle: (rowId: string, themeSlug: string) => void;
  pending: Set<string>; // `${rowId}:${themeSlug}` keys currently saving
  itemLabel: string; // "faculty" / "labs", for the empty and filter text
}) {
  const [search, setSearch] = useState('');
  const [onlyUnassigned, setOnlyUnassigned] = useState(false);

  const query = search.trim().toLowerCase();
  const themeCount = (rowId: string) =>
    RESEARCH_THEMES.filter((t) => isLinked(rowId, t.slug)).length;

  const visibleRows = rows
    .filter((r) => !query || r.name.toLowerCase().includes(query))
    .filter((r) => !onlyUnassigned || themeCount(r.id) === 0);

  const columnCount = (themeSlug: string) => rows.filter((r) => isLinked(r.id, themeSlug)).length;
  const unassigned = rows.filter((r) => themeCount(r.id) === 0).length;

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="relative w-72">
          <Search size={14} className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${itemLabel}`}
            className="w-full rounded border border-gray-300 py-1.5 pr-3 pl-8 text-xs"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-stone-600">
          <input
            type="checkbox"
            checked={onlyUnassigned}
            onChange={(e) => setOnlyUnassigned(e.target.checked)}
            className="accent-teal-700"
          />
          Only show {itemLabel} with no theme ({unassigned})
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
              {RESEARCH_THEMES.map((theme) => (
                <th
                  key={theme.slug}
                  title={theme.label}
                  className="w-36 px-3 py-3 text-center font-semibold text-gray-600"
                >
                  {theme.shortLabel}
                  <div className="text-xs font-normal text-stone-400">
                    {columnCount(theme.slug)} linked
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={RESEARCH_THEMES.length + 1} className="py-16 text-center text-gray-400">
                  {rows.length === 0
                    ? `No ${itemLabel} yet.`
                    : `No ${itemLabel} match the current search or filter.`}
                </td>
              </tr>
            )}

            {visibleRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-2.5">
                  <div className="font-semibold text-stone-900">{row.name}</div>
                  {row.note && <div className="text-xs text-amber-700">{row.note}</div>}
                </td>
                {RESEARCH_THEMES.map((theme) => {
                  const key = `${row.id}:${theme.slug}`;
                  return (
                    <td key={theme.slug} className="px-3 py-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={isLinked(row.id, theme.slug)}
                        disabled={pending.has(key)}
                        onChange={() => onToggle(row.id, theme.slug)}
                        aria-label={`${row.name} in ${theme.label}`}
                        className="h-4 w-4 cursor-pointer accent-teal-700 disabled:cursor-wait disabled:opacity-40"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}