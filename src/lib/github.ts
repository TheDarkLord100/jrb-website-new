import type { ThemeSlug } from '@/lib/researchThemes';
import { slugify } from '@/lib/slugify';

export const GITHUB_ORG = 'iitd-bird-robotics';

// GitHub topics that point a repo at each research theme, used to
// pre-select the theme when importing. Add topics to a theme's list freely
// -- write them as GitHub shows them (lowercase, hyphenated). A repo whose
// topics match more than one theme gets no pre-selection, so prefer
// specific topics over broad ones like `ros` or `robotics`.
export const THEME_TOPICS: Record<ThemeSlug, string[]> = {
  'human-robotics': ['human-robotics', 'bipedal-locomotion'],
  'soft-bio-robotics': ['soft-bio-robotics'],
  'field-robotics': ['field-robotics', 'slam'],
  'cross-cutting': ['cross-cutting'],
};

// Only the fields the import flow uses -- the API returns far more.
export type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string | null;
};

// The unauthenticated API allows 60 requests/hour per IP address, and on a
// shared campus network other people's traffic counts against that too.
export class GitHubRateLimitError extends Error {
  resetAt: Date | null;
  constructor(resetAt: Date | null) {
    super('GitHub API rate limit reached');
    this.name = 'GitHubRateLimitError';
    this.resetAt = resetAt;
  }
}

const PER_PAGE = 100;
const MAX_PAGES = 10; // 1000 repos -- far more than the org will ever have

// Kept for the lifetime of the page, so closing and reopening the import
// modal doesn't spend another request. Pass `force` to refetch.
let cachedRepos: GitHubRepo[] | null = null;

export function getCachedOrgRepos(): GitHubRepo[] | null {
  return cachedRepos;
}

// All public, non-fork, non-archived repos in the org, most recently
// pushed first. Throws GitHubRateLimitError when the limit is used up, and
// a plain Error for anything else.
export async function fetchOrgRepos({ force = false } = {}): Promise<GitHubRepo[]> {
  if (cachedRepos && !force) return cachedRepos;

  const all: GitHubRepo[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(
      `https://api.github.com/orgs/${GITHUB_ORG}/repos?type=public&per_page=${PER_PAGE}&page=${page}`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );

    if (
      (res.status === 403 || res.status === 429) &&
      res.headers.get('x-ratelimit-remaining') === '0'
    ) {
      const reset = res.headers.get('x-ratelimit-reset');
      throw new GitHubRateLimitError(reset ? new Date(Number(reset) * 1000) : null);
    }
    if (!res.ok) {
      throw new Error(`GitHub responded with ${res.status}`);
    }

    const batch = (await res.json()) as GitHubRepo[];
    all.push(...batch);
    if (batch.length < PER_PAGE) break;
  }

  cachedRepos = all
    .filter((repo) => !repo.fork && !repo.archived && repo.name !== '.github')
    .sort((a, b) => (b.pushed_at ?? '').localeCompare(a.pushed_at ?? ''));
  return cachedRepos;
}

// The theme a repo's topics point to, or null when none match -- or when
// they match more than one theme, since guessing would be worse than
// leaving it for the admin to pick.
export function themeFromTopics(topics: string[]): ThemeSlug | null {
  const repoTopics = new Set(topics.map((topic) => topic.toLowerCase()));
  const matches = (Object.keys(THEME_TOPICS) as ThemeSlug[]).filter((theme) =>
    THEME_TOPICS[theme].some((topic) => repoTopics.has(topic.toLowerCase()))
  );
  return matches.length === 1 ? matches[0] : null;
}

// "soft-gripper_v2" -> "Soft Gripper V2". Only a starting point -- the
// admin can edit the title before saving.
export function titleFromRepoName(name: string): string {
  return name
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function slugFromRepoName(name: string): string {
  return slugify(name);
}