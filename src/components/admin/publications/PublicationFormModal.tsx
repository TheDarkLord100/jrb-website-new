'use client';

import { useState } from 'react';
import { createPublications, updatePublication } from '@/lib/supabase/queries';
import { RESEARCH_THEMES, type ThemeSlug } from '@/lib/researchThemes';
import { useToast } from '@/components/admin/Toast';
import Modal from '@/components/admin/Modal';
import FacultyCheckboxes from './FacultyCheckboxes';
import type { Person } from '@/types/person';
import type { Publication, PublicationInput } from '@/types/publication';

type FormState = Omit<PublicationInput, 'theme_slug'> & { theme_slug: ThemeSlug | '' };

const EMPTY_FORM: FormState = {
  title: '',
  authors: '',
  venue: '',
  year: null,
  doi: '',
  url: '',
  cited_by_count: null,
  theme_slug: '',
  openalex_id: null,
  is_published: true,
};

function blankToNull(s: string | null): string | null {
  const trimmed = s?.trim() ?? '';
  return trimmed === '' ? null : trimmed;
}

// Accepts a DOI however it's pasted -- bare, "doi:…" or as a doi.org link --
// and stores the bare form, which is what the duplicate check compares.
function normalizeDoi(raw: string | null): string | null {
  const doi = blankToNull(raw);
  if (!doi) return null;
  return doi.replace(/^(https?:\/\/(dx\.)?doi\.org\/|doi:)/i, '');
}

function toNumber(raw: string): number | null {
  if (raw.trim() === '') return null;
  const n = Number(raw);
  return Number.isNaN(n) ? null : n;
}

const FORM_ID = 'publication-form';

// Edits one paper, or adds one by hand for anything OpenAlex doesn't have.
export default function PublicationFormModal({
  initial,
  faculty,
  onClose,
  onSaved,
}: {
  initial?: Publication;
  faculty: Person[];
  onClose: () => void;
  onSaved: (publication: Publication) => void;
}) {
  const [form, setForm] = useState<FormState>(() => {
    if (!initial) return { ...EMPTY_FORM };
    // Everything that isn't a writable column stays out of the form state,
    // since the form state is what gets sent back on save.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, updated_at, person_ids, faculty_names, ...rest } = initial;
    return { ...rest };
  });
  const [personIds, setPersonIds] = useState<string[]>(initial?.person_ids ?? []);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.theme_slug === '') {
      toast.error('Pick a theme.');
      return;
    }

    const doi = normalizeDoi(form.doi);
    const payload: PublicationInput = {
      ...form,
      theme_slug: form.theme_slug,
      title: form.title.trim(),
      authors: blankToNull(form.authors),
      venue: blankToNull(form.venue),
      doi,
      // With no link given, a DOI is the most stable thing to point at.
      url: blankToNull(form.url) ?? (doi ? `https://doi.org/${doi}` : null),
    };

    setSaving(true);
    let saved: Publication | null = null;
    if (initial) {
      saved = await updatePublication(initial.id, payload, personIds);
    } else {
      const result = await createPublications([{ publication: payload, personIds }]);
      saved = result?.created[0] ?? null;
      if (result?.linksFailed) toast.error('Paper saved, but linking it to faculty failed.');
    }
    setSaving(false);

    if (!saved) {
      toast.error(
        'Failed to save. If this paper is already listed (same DOI), edit that one instead.'
      );
      return;
    }
    toast.success(initial ? 'Publication updated.' : 'Publication added.');
    onSaved(saved);
  };

  return (
    <Modal
      title={initial ? 'Edit publication' : 'New publication'}
      subtitle={
        initial
          ? initial.openalex_id
            ? `Imported from OpenAlex (${initial.openalex_id})`
            : 'Added manually'
          : 'For papers OpenAlex doesn’t have'
      }
      onClose={onClose}
      maxWidth="max-w-2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            form={FORM_ID}
            disabled={saving}
            className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {saving ? 'Saving…' : initial ? 'Save changes' : 'Create'}
          </button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title">
          <textarea
            required
            rows={2}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Authors" hint="As they should appear, e.g. “A. Kumar, S. Bhasin”.">
          <textarea
            rows={2}
            value={form.authors ?? ''}
            onChange={(e) => set('authors', e.target.value)}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </Field>

        <div className="grid grid-cols-[1fr_8rem] gap-4">
          <Field label="Venue" hint="Journal or conference.">
            <input
              type="text"
              value={form.venue ?? ''}
              onChange={(e) => set('venue', e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Year">
            <input
              type="number"
              min={1950}
              max={2100}
              value={form.year ?? ''}
              onChange={(e) => set('year', toNumber(e.target.value))}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="DOI" hint="Bare or as a doi.org link.">
            <input
              type="text"
              value={form.doi ?? ''}
              onChange={(e) => set('doi', e.target.value)}
              placeholder="10.1109/…"
              className="w-full rounded border border-stone-300 px-3 py-2 font-mono text-sm"
            />
          </Field>
          <Field label="Link" hint="Defaults to the DOI link if left empty.">
            <input
              type="url"
              value={form.url ?? ''}
              onChange={(e) => set('url', e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </Field>
        </div>

        <Field label="Theme">
          <select
            required
            value={form.theme_slug}
            onChange={(e) => set('theme_slug', e.target.value as ThemeSlug | '')}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          >
            <option value="">— Select a theme —</option>
            {RESEARCH_THEMES.map((theme) => (
              <option key={theme.slug} value={theme.slug}>
                {theme.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Centre faculty" hint="The CoE-BIRD faculty who authored this paper.">
          <FacultyCheckboxes faculty={faculty} value={personIds} onChange={setPersonIds} />
        </Field>

        <label className="flex cursor-pointer items-center gap-2 border-t border-stone-100 pt-4 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => set('is_published', e.target.checked)}
            className="accent-teal-700"
          />
          Published
          {!form.is_published && (
            <span className="text-xs text-amber-700">Hidden from the public site.</span>
          )}
        </label>
      </form>
    </Modal>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-stone-400">{hint}</p>}
    </div>
  );
}