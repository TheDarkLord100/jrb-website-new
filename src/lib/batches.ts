// M.Tech batches are stored in people.year as "YYYY-YY" -- start year, then
// the last two digits of the graduation year, e.g. "2025-27". The admin
// form only ever offers batches built by makeBatch(), and a check
// constraint on `people` enforces the same shape, so "2026 - 28" or
// "2026-2028" can't get in.

export const BATCH_LENGTH_YEARS = 2;

// How far back and ahead of the current year the admin dropdown reaches.
// Batches already in the data are always offered too, however old.
const YEARS_BACK = 6;
const YEARS_AHEAD = 1;

const BATCH_PATTERN = /^(\d{4})-(\d{2})$/;

export function makeBatch(startYear: number): string {
  const endYY = String((startYear + BATCH_LENGTH_YEARS) % 100).padStart(2, '0');
  return `${startYear}-${endYY}`;
}

// The right shape *and* the right span -- "2025-28" is rejected.
export function isValidBatch(value: string | null | undefined): value is string {
  if (!value) return false;
  const match = BATCH_PATTERN.exec(value);
  if (!match) return false;
  return Number(match[2]) === (Number(match[1]) + BATCH_LENGTH_YEARS) % 100;
}

function startYear(batch: string): number {
  return Number(batch.slice(0, 4));
}

// "2025-27" -> "2025–27" (en dash) for display only; the stored value
// always uses a plain hyphen.
export function formatBatch(batch: string): string {
  return batch.replace('-', '–');
}

export function sortBatches(batches: string[], order: 'asc' | 'desc' = 'asc'): string[] {
  return [...batches].sort((a, b) =>
    order === 'asc' ? startYear(a) - startYear(b) : startYear(b) - startYear(a)
  );
}

// Every batch the admin can assign: a rolling window around the current
// year, plus any valid batch already present in the data. Newest first.
export function batchOptions(existing: (string | null)[], now = new Date()): string[] {
  const year = now.getFullYear();
  const options = new Set<string>();
  for (let y = year - YEARS_BACK; y <= year + YEARS_AHEAD; y++) {
    options.add(makeBatch(y));
  }
  existing.filter(isValidBatch).forEach((b) => options.add(b));
  return sortBatches([...options], 'desc');
}

// The batches that actually have people in a given role, for filter pills
// and the promote dropdown. Derived from the data, so a new intake or a
// promotion shows up without any code change.
export function batchesInUse(
  people: { role: string; year: string | null }[],
  role: string,
  order: 'asc' | 'desc' = 'asc'
): string[] {
  const set = new Set(
    people.filter((p) => p.role === role && isValidBatch(p.year)).map((p) => p.year!)
  );
  return sortBatches([...set], order);
}