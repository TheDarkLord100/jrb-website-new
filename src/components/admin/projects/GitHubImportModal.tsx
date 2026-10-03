'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import {
  GITHUB_ORG,
  GitHubRateLimitError,
  fetchOrgRepos,
  getCachedOrgRepos,
  themeFromTopics,
  type GitHubRepo,
} from '@/lib/github';
import { getTheme } from '@/lib/researchThemes';
import type { Project } from '@/types/project';

function describeError(e: unknown): string {
  if (e instanceof GitHubRateLimitError) {
    const when = e.resetAt
      ? e.resetAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      : 'a while';
    return `GitHub's hourly request limit for this network is used up. Try again after ${when}.`;
  }
  return "Couldn't reach GitHub right now. Check your connection and try again.";
}

// A repo counts as already added if a project carries its repo id, or --
// for projects added manually before importing existed -- links to the
// same URL.
function findLinkedProject(repo: GitHubRepo, projects: Project[]): Project | null {
  const url = repo.html_url.toLowerCase();
  return (
    projects.find((p) => p.github_repo_id === repo.id) ??
    projects.find((p) => p.github_url?.toLowerCase().replace(/\/+$/, '') === url) ??
    null
  );
}

export default function GitHubImportModal({
  projects,
  onAdd,
  onClose,
}: {
  projects: Project[];
  onAdd: (repo: GitHubRepo) => void;
  onClose: () => void;
}) {
  // Seeded from the page-lifetime cache, so reopening the modal is instant
  // and doesn't spend a request against the rate limit.
  const [repos, setRepos] = useState<GitHubRepo[] | null>(() => getCachedOrgRepos());
  const [loading, setLoading] = useState(repos === null);
  const [error, setError] = useState<string | null>(null);

  const load = async (force: boolean) => {
    setLoading(true);
    setError(null);
    try {
      setRepos(await fetchOrgRepos({ force }));
    } catch (e) {
      console.error('Error fetching GitHub repos:', e);
      setError(describeError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getCachedOrgRepos()) return;
    let cancelled = false;

    fetchOrgRepos()
      .then((data) => {
        if (!cancelled) setRepos(data);
      })
      .catch((e) => {
        console.error('Error fetching GitHub repos:', e);
        if (!cancelled) setError(describeError(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const withLinks = (repos ?? []).map((repo) => ({
    repo,
    linked: findLinkedProject(repo, projects),
  }));
  const newRepos = withLinks.filter((r) => !r.linked);
  const addedRepos = withLinks.filter((r) => r.linked);

  return (
    <Modal
      title="Import from GitHub"
      subtitle={`Public repositories in ${GITHUB_ORG}, excluding forks and archived repos`}
      onClose={onClose}
      maxWidth="max-w-3xl"
      footer={
        <>
          <button
            type="button"
            onClick={() => load(true)}
            disabled={loading}
            className="mr-auto flex items-center gap-1.5 rounded px-3 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : undefined} />
            Refresh
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Done
          </button>
        </>
      }
    >
      {error && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading && !repos && (
        <div className="animate-pulse space-y-3 py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 w-full rounded bg-gray-100" />
          ))}
        </div>
      )}

      {repos && (
        <div className="space-y-6">
          <section>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
              New ({newRepos.length})
            </h3>
            {newRepos.length === 0 ? (
              <p className="py-4 text-sm text-stone-400">Every repository has been added.</p>
            ) : (
              <ul className="divide-y divide-stone-100 rounded border border-stone-200">
                {newRepos.map(({ repo }) => {
                  const theme = getTheme(themeFromTopics(repo.topics) ?? '');
                  return (
                    <li key={repo.id} className="flex items-start justify-between gap-4 px-4 py-3">
                      <div className="min-w-0">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm font-semibold text-stone-900 hover:text-teal-700"
                        >
                          {repo.name}
                        </a>
                        {repo.description && (
                          <p className="mt-0.5 text-xs text-stone-500">{repo.description}</p>
                        )}
                        <p className="mt-1 text-xs text-stone-400">
                          {theme ? (
                            <>
                              Theme from topics:{' '}
                              <span className="font-semibold text-amber-700">
                                {theme.shortLabel}
                              </span>
                            </>
                          ) : (
                            'No theme topic — pick one when adding.'
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onAdd(repo)}
                        className="shrink-0 rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
                      >
                        Add
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {addedRepos.length > 0 && (
            <section>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
                Already added ({addedRepos.length})
              </h3>
              <ul className="divide-y divide-stone-100 rounded border border-stone-200 bg-stone-50">
                {addedRepos.map(({ repo, linked }) => (
                  <li key={repo.id} className="flex items-center justify-between gap-4 px-4 py-2.5">
                    <span className="font-mono text-sm text-stone-400">{repo.name}</span>
                    <span className="truncate text-xs text-stone-400">→ {linked!.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </Modal>
  );
}