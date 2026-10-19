import { supabase } from '@/lib/supabase/client';
import type { ThemeSlug } from '@/lib/researchThemes';
import type { OpenAlexWork } from '@/lib/openalex';

// Client side of the `paper-triage` Edge Function: AI recommendations for
// which imported papers belong on the site, and under which theme. These
// are suggestions only -- the admin reviews and confirms every paper.

export type TriageVerdict = 'recommended' | 'maybe' | 'not_relevant';

export type TriageResult = {
  id: string; // OpenAlex work id
  verdict: TriageVerdict;
  theme: ThemeSlug;
  reason: string;
};

// Must match the deployed Edge Function's name in Supabase.
const FUNCTION_NAME = 'super-service';
// Small enough for the model to handle reliably and for one failed batch to
// cost little; the function itself accepts up to 60.
const BATCH_SIZE = 40;

async function triageBatch(works: OpenAlexWork[]): Promise<TriageResult[]> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const papers = works.map((w) => ({
    id: w.id,
    title: w.title,
    venue: w.venue,
    year: w.year,
    type: w.type,
    topics: w.topics,
  }));
  const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, { body: { papers } });

  if (error) {
    let message = "Couldn't get AI recommendations. Try again shortly.";
    const context = (error as { context?: unknown }).context;
    if (context instanceof Response) {
      try {
        const payload = await context.json();
        if (typeof payload?.error === 'string') message = payload.error;
      } catch {
        // Not JSON -- keep the generic message.
      }
    }
    console.error('Paper triage error:', error);
    throw new Error(message);
  }
  if (data?.error) throw new Error(data.error as string);
  return data.results as TriageResult[];
}

// Results are kept for the lifetime of the page, so re-opening the modal or
// switching between faculty never sends the same paper twice.
const cache = new Map<string, TriageResult>();

export function getCachedTriage(workIds: string[]): Map<string, TriageResult> {
  const found = new Map<string, TriageResult>();
  for (const id of workIds) {
    const hit = cache.get(id);
    if (hit) found.set(id, hit);
  }
  return found;
}

// Sends the papers in batches, one after another (the free tier allows only
// a few requests a minute), reporting each finished batch as it lands. If a
// batch fails, what's done so far is kept and the error is thrown -- running
// it again only sends the papers still missing.
export async function triagePapers(
  works: OpenAlexWork[],
  onBatch: (results: TriageResult[], done: number, total: number) => void
): Promise<void> {
  const todo = works.filter((w) => !cache.has(w.id));
  let done = works.length - todo.length;

  for (let i = 0; i < todo.length; i += BATCH_SIZE) {
    const results = await triageBatch(todo.slice(i, i + BATCH_SIZE));
    results.forEach((r) => cache.set(r.id, r));
    done += results.length;
    onBatch(results, done, works.length);
  }
}