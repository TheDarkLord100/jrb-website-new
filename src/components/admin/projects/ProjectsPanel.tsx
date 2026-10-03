'use client';

import { useState } from 'react';
import { Search, Star } from 'lucide-react';
import GitHubIcon from '@/components/ui/GitHubIcon';
import { useAllProjects } from '@/lib/hooks/useAllProjects';
import { deleteProject } from '@/lib/supabase/queries';
import { RESEARCH_THEMES, getTheme, themeRank, type ThemeSlug } from '@/lib/researchThemes';
import { useToast } from '@/components/admin/Toast';
import {
  slugFromRepoName,
  themeFromTopics,
  titleFromRepoName,
  type GitHubRepo,
} from '@/lib/github';
import ProjectFormModal, { type ProjectFormState } from './ProjectFormModal';
import GitHubImportModal from './GitHubImportModal';
import type { Project } from '@/types/project';

// The new-project form, pre-filled from a GitHub repo. The theme stays
// empty ('') when the repo's topics don't point to exactly one theme.
function prefillFromRepo(repo: GitHubRepo): Partial<ProjectFormState> {
  return {
    title: titleFromRepoName(repo.name),
    slug: slugFromRepoName(repo.name),
    short_description: repo.description ?? '',
    github_url: repo.html_url,
    github_repo_id: repo.id,
    theme_slug: themeFromTopics(repo.topics) ?? '',
  };
}

// Site order: by theme (in RESEARCH_THEMES order), then display_order, then
// title as a tiebreak -- the same order the theme pages will show them in.
function compareProjects(a: Project, b: Project): number {
  return (
    themeRank(a.theme_slug) - themeRank(b.theme_slug) ||
    a.display_order - b.display_order ||
    a.title.localeCompare(b.title)
  );
}

export default function ProjectsPanel() {
  const { items: rows, setItems: setRows, error } = useAllProjects();
  const toast = useToast();
  const [editingRow, setEditingRow] = useState<Project | null>(null); // null = closed
  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  // Set while the form is open for a repo picked in the import modal.
  const [importingRepo, setImportingRepo] = useState<GitHubRepo | null>(null);
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState<ThemeSlug | 'all'>('all');

  if (error) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn&apos;t load projects right now. Please try again shortly.
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
  const visibleRows = rows
    .filter((r) => themeFilter === 'all' || r.theme_slug === themeFilter)
    .filter(
      (r) =>
        !query ||
        [r.title, r.slug, r.short_description]
          .filter((v): v is string => !!v)
          .some((v) => v.toLowerCase().includes(query))
    )
    .sort(compareProjects);

  const deleteRow = async (row: Project) => {
    if (!confirm(`Delete "${row.title}"? This can't be undone.`)) return;

    const ok = await deleteProject(row.id);
    if (!ok) {
      toast.error('Failed to delete the project. Check the console for details.');
      return;
    }
    setRows((prev) => prev!.filter((r) => r.id !== row.id));
    toast.success(`"${row.title}" deleted.`);
  };

  const handleSaved = (saved: Project) => {
    setRows((prev) => {
      if (!prev) return prev;
      const exists = prev.some((r) => r.id === saved.id);
      return exists ? prev.map((r) => (r.id === saved.id ? saved : r)) : [...prev, saved];
    });
    setEditingRow(null);
    setIsCreating(false);
    setImportingRepo(null);
  };

  const isFiltered = themeFilter !== 'all' || query !== '';

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
              placeholder="Search by title, slug, or description"
              className="w-full rounded border border-gray-300 py-1.5 pr-3 pl-8 text-xs"
            />
          </div>

          <select
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value as ThemeSlug | 'all')}
            className="rounded border border-gray-300 px-2 py-1.5 text-xs"
          >
            <option value="all">All themes</option>
            {RESEARCH_THEMES.map((theme) => (
              <option key={theme.slug} value={theme.slug}>
                {theme.shortLabel}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsImporting(true)}
            className="flex items-center gap-1.5 rounded bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
          >
            <GitHubIcon size={13} />
            Fetch from GitHub
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
          >
            + Add project
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Theme</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Order</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Featured</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Source</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center text-gray-400">
                  No projects yet. Click &quot;Add project&quot; to create one.
                </td>
              </tr>
            )}

            {rows.length > 0 && visibleRows.length === 0 && isFiltered && (
              <tr>
                <td colSpan={7} className="py-16 text-center text-gray-400">
                  No projects match the current search or theme filter.
                </td>
              </tr>
            )}

            {visibleRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-stone-900">{row.title}</div>
                  <div className="font-mono text-xs text-gray-400">{row.slug}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {getTheme(row.theme_slug)?.shortLabel ?? row.theme_slug}
                </td>
                <td className="px-4 py-3 text-gray-600">{row.display_order}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {row.is_featured ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                      <Star size={13} className="fill-amber-400 text-amber-500" />
                      {row.featured_order ?? '—'}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      row.is_published ? 'bg-teal-50 text-teal-700' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {row.is_published ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs whitespace-nowrap text-gray-500">
                  {row.github_repo_id ? (
                    <span className="flex items-center gap-1">
                      <GitHubIcon size={13} />
                      GitHub
                    </span>
                  ) : (
                    'Manual'
                  )}
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

      {/* Rendered before the form so that, when both are open, the form
          stacks on top and the import list is still there after saving. */}
      {isImporting && (
        <GitHubImportModal
          projects={rows}
          onAdd={(repo) => setImportingRepo(repo)}
          onClose={() => setIsImporting(false)}
        />
      )}

      {(editingRow || isCreating || importingRepo) && (
        <ProjectFormModal
          // Keyed so picking a different repo starts a fresh form.
          key={importingRepo?.id ?? editingRow?.id ?? 'new'}
          initial={editingRow ?? undefined}
          prefill={importingRepo ? prefillFromRepo(importingRepo) : undefined}
          onClose={() => {
            setEditingRow(null);
            setIsCreating(false);
            setImportingRepo(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}