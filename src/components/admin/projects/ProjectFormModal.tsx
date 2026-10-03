'use client';

import { useState } from 'react';
import { createProject, updateProject } from '@/lib/supabase/queries';
import { RESEARCH_THEMES, type ThemeSlug } from '@/lib/researchThemes';
import { slugify } from '@/lib/slugify';
import { useToast } from '@/components/admin/Toast';
import Modal from '@/components/admin/Modal';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import MediaField from '@/components/admin/media/MediaField';
import type { Project, ProjectInput } from '@/types/project';

// Form state differs from ProjectInput in one place: a new project starts
// with no theme picked ('') so the admin has to choose one deliberately
// rather than silently inheriting the first option.
export type ProjectFormState = Omit<ProjectInput, 'theme_slug'> & { theme_slug: ThemeSlug | '' };

const EMPTY_FORM: ProjectFormState = {
  slug: '',
  title: '',
  short_description: '',
  description: '',
  theme_slug: '',
  media_url: null,
  media_type: null,
  media_alt: null,
  github_repo_id: null,
  github_url: '',
  is_featured: false,
  featured_order: null,
  display_order: 0,
  is_published: true,
};

function toInputValue(n: number | null): string {
  return n === null ? '' : String(n);
}
function fromInputValue(raw: string): number | null {
  if (raw.trim() === '') return null;
  const n = Number(raw);
  return Number.isNaN(n) ? null : n;
}
function blankToNull(s: string | null): string | null {
  const trimmed = s?.trim() ?? '';
  return trimmed === '' ? null : trimmed;
}

const FORM_ID = 'project-form';

// `initial` edits an existing project. `prefill` starts a new one with
// some fields already filled in -- used by the GitHub import.
export default function ProjectFormModal({
  initial,
  prefill,
  onClose,
  onSaved,
}: {
  initial?: Project;
  prefill?: Partial<ProjectFormState>;
  onClose: () => void;
  onSaved: (row: Project) => void;
}) {
  const [form, setForm] = useState<ProjectFormState>(() => {
    if (!initial) return { ...EMPTY_FORM, ...prefill };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, updated_at, ...rest } = initial;
    return { ...rest };
  });
  // New projects: the slug follows the title until the admin edits the slug
  // field themselves. Existing projects never auto-change their slug, and
  // neither do imports -- their slug comes from the repo name, which is
  // usually a better slug than the prettified title.
  const [slugTouched, setSlugTouched] = useState(!!initial || !!prefill?.slug);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const set = <K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({ ...prev, title, slug: slugTouched ? prev.slug : slugify(title) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // The <select> is `required`, so this only guards the type narrowing.
    if (form.theme_slug === '') {
      toast.error('Pick a theme for this project.');
      return;
    }

    setSaving(true);

    // Optional text fields go to the database as null rather than ''.
    // featured_order only means something for featured projects, so it's
    // cleared when a project is un-featured.
    const payload: ProjectInput = {
      ...form,
      theme_slug: form.theme_slug,
      title: form.title.trim(),
      slug: form.slug.trim(),
      short_description: blankToNull(form.short_description),
      description: blankToNull(form.description),
      github_url: blankToNull(form.github_url),
      media_alt: form.media_url ? blankToNull(form.media_alt) : null,
      featured_order: form.is_featured ? form.featured_order : null,
    };

    const result = initial
      ? await updateProject(initial.id, payload)
      : await createProject(payload);

    setSaving(false);

    if (!result) {
      toast.error(
        'Failed to save the project. If the slug is already used by another project, change it and try again.'
      );
      return;
    }
    toast.success(initial ? 'Project updated.' : 'Project created.');
    onSaved(result);
  };

  return (
    <Modal
      title={initial ? 'Edit project' : 'New project'}
      subtitle={
        initial
          ? initial.github_repo_id
            ? 'Imported from GitHub'
            : 'Added manually'
          : prefill?.github_repo_id
            ? 'Importing from GitHub'
            : undefined
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
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Slug" hint="Lowercase letters, numbers and hyphens.">
            <input
              type="text"
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set('slug', e.target.value);
              }}
              className="w-full rounded border border-stone-300 px-3 py-2 font-mono text-sm"
            />
          </Field>

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
        </div>

        <Field label="Short description" hint="Shown in the featured carousel and list views.">
          <textarea
            rows={2}
            value={form.short_description ?? ''}
            onChange={(e) => set('short_description', e.target.value)}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Description" hint="Full write-up shown on the theme page.">
          <MarkdownEditor
            value={form.description ?? ''}
            onChange={(value) => set('description', value)}
            rows={6}
          />
        </Field>

        <Field label="GitHub URL">
          <input
            type="url"
            value={form.github_url ?? ''}
            onChange={(e) => set('github_url', e.target.value)}
            placeholder="https://github.com/iitd-bird-robotics/…"
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Media" hint="Shown in the featured carousel and on the theme page.">
          <MediaField
            folder="projects"
            allowVideo
            value={
              form.media_url && form.media_type
                ? { url: form.media_url, type: form.media_type }
                : null
            }
            onChange={(media) =>
              setForm((prev) => ({
                ...prev,
                media_url: media?.url ?? null,
                media_type: media?.type ?? null,
                // Alt text describes one specific image, so it goes with it.
                media_alt: media ? prev.media_alt : null,
              }))
            }
            alt={form.media_alt}
            onAltChange={(alt) => set('media_alt', alt)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Display order" hint="Order within its theme. Lower shows first.">
            <input
              type="number"
              required
              value={form.display_order}
              onChange={(e) => set('display_order', fromInputValue(e.target.value) ?? 0)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </Field>

          {form.is_featured && (
            <Field label="Featured order" hint="Position in the carousel. Lower shows first.">
              <input
                type="number"
                value={toInputValue(form.featured_order)}
                onChange={(e) => set('featured_order', fromInputValue(e.target.value))}
                className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
              />
            </Field>
          )}
        </div>

        <div className="space-y-2 border-t border-stone-100 pt-4">
          <Checkbox
            label="Featured in the carousel"
            hint={
              form.is_featured && !form.media_url
                ? 'Needs media before it can appear in the carousel.'
                : undefined
            }
            checked={form.is_featured}
            onChange={(checked) => set('is_featured', checked)}
          />
          <Checkbox
            label="Published"
            hint={form.is_published ? undefined : 'Hidden from the public site.'}
            checked={form.is_published}
            onChange={(checked) => set('is_published', checked)}
          />
        </div>
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

function Checkbox({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-stone-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 accent-teal-700"
      />
      <span>
        {label}
        {hint && <span className="ml-2 text-xs text-amber-700">{hint}</span>}
      </span>
    </label>
  );
}