'use client';

import { useState } from 'react';
import { createPerson, updatePerson } from '@/lib/supabase/queries';
import { batchOptions, formatBatch, isValidBatch } from '@/lib/batches';
import { DEPARTMENTS } from '@/lib/departments';
import { useToast } from '@/components/admin/Toast';
import Modal from '@/components/admin/Modal';
import MediaField from '@/components/admin/media/MediaField';
import FocusKeywordsInput from './FocusKeywordsInput';
import type { Person, PersonInput, PersonRole } from '@/types/person';

export const ROLE_LABELS: Record<PersonRole, string> = {
  faculty: 'Faculty',
  student: 'Student',
  postdoc: 'Post Doc',
  alumni: 'Alumni',
};

const usesBatch = (role: PersonRole) => role === 'student' || role === 'alumni';

function toForm(person: Person | undefined, role: PersonRole): PersonInput {
  return {
    name: person?.name ?? '',
    image_url: person?.image_url ?? '',
    webmail: person?.webmail ?? '',
    link: person?.link ?? '',
    google_scholar_url: person?.google_scholar_url ?? '',
    openalex_author_id: person?.openalex_author_id ?? '',
    role: person?.role ?? role,
    year: person?.year ?? '',
    department: person?.department ?? '',
    office_contact: person?.office_contact ?? '',
    research_interest: person?.research_interest ?? '',
    focus: person?.focus ?? [],
    priority: person?.priority ?? null,
    special_designation: person?.special_designation ?? '',
  };
}

function blankToNull(s: string | null): string | null {
  const trimmed = s?.trim() ?? '';
  return trimmed === '' ? null : trimmed;
}

// Fields that don't apply to the chosen role are cleared on save, so
// switching someone from faculty to student (say) doesn't leave stale
// faculty-only values sitting in the row.
function toPayload(form: PersonInput): PersonInput {
  const isFaculty = form.role === 'faculty';
  return {
    name: form.name.trim(),
    image_url: form.image_url.trim(),
    webmail: blankToNull(form.webmail),
    link: blankToNull(form.link),
    google_scholar_url: blankToNull(form.google_scholar_url),
    openalex_author_id: blankToNull(form.openalex_author_id),
    role: form.role,
    year: isFaculty ? null : blankToNull(form.year),
    department: isFaculty ? blankToNull(form.department) : null,
    office_contact: isFaculty ? blankToNull(form.office_contact) : null,
    research_interest: isFaculty ? blankToNull(form.research_interest) : null,
    focus: isFaculty ? form.focus : [],
    priority: form.priority,
    special_designation: blankToNull(form.special_designation),
  };
}

const FORM_ID = 'person-form';

export default function PersonFormModal({
  initial,
  defaultRole,
  people,
  onClose,
  onSaved,
}: {
  initial?: Person;
  defaultRole: PersonRole;
  // Everyone, for batch options and focus-keyword suggestions.
  people: Person[];
  onClose: () => void;
  onSaved: (row: Person) => void;
}) {
  const [form, setForm] = useState<PersonInput>(() => toForm(initial, defaultRole));
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const set = <K extends keyof PersonInput>(key: K, value: PersonInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const batches = batchOptions(people.map((p) => p.year));
  const focusSuggestions = [
    ...new Set(people.filter((p) => p.role === 'faculty').flatMap((p) => p.focus)),
  ].sort();
  // Keep a department that's no longer in the list selectable, so editing
  // an older row doesn't silently blank it.
  const departmentKnown = DEPARTMENTS.some((d) => d.value === form.department);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.image_url.trim()) {
      toast.error('Choose a photo.');
      return;
    }
    if (usesBatch(form.role) && !isValidBatch(form.year)) {
      toast.error('Pick a batch.');
      return;
    }

    setSaving(true);
    const payload = toPayload(form);
    const result = initial ? await updatePerson(initial.id, payload) : await createPerson(payload);
    setSaving(false);

    if (!result) {
      toast.error('Failed to save. Check the console for details.');
      return;
    }
    toast.success(initial ? `${result.name} updated.` : `${result.name} added.`);
    onSaved(result);
  };

  return (
    <Modal
      title={initial ? `Edit ${initial.name}` : `New ${ROLE_LABELS[form.role].toLowerCase()}`}
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
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name">
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Role">
            <select
              value={form.role}
              onChange={(e) => set('role', e.target.value as PersonRole)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            >
              {(Object.keys(ROLE_LABELS) as PersonRole[]).map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Photo">
          <MediaField
            folder="people"
            value={form.image_url ? { url: form.image_url, type: 'image' } : null}
            onChange={(media) => set('image_url', media?.url ?? '')}
          />
        </Field>

        {usesBatch(form.role) && (
          <Field label="Batch" hint="Start year – graduation year.">
            <select
              required
              value={form.year ?? ''}
              onChange={(e) => set('year', e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            >
              <option value="">— Select a batch —</option>
              {batches.map((b) => (
                <option key={b} value={b}>
                  {formatBatch(b)}
                </option>
              ))}
            </select>
          </Field>
        )}

        {form.role === 'postdoc' && (
          <Field label="Year" hint="Shown as-is on their card.">
            <input
              type="text"
              value={form.year ?? ''}
              onChange={(e) => set('year', e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </Field>
        )}

        {form.role === 'faculty' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Department">
                <select
                  value={form.department ?? ''}
                  onChange={(e) => set('department', e.target.value)}
                  className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
                >
                  <option value="">— None —</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.value}
                    </option>
                  ))}
                  {form.department && !departmentKnown && (
                    <option value={form.department}>{form.department}</option>
                  )}
                </select>
              </Field>

              <Field label="Office phone">
                <input
                  type="text"
                  value={form.office_contact ?? ''}
                  onChange={(e) => set('office_contact', e.target.value)}
                  className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
                />
              </Field>
            </div>

            <Field label="Research interest" hint="Shown on their card.">
              <textarea
                rows={3}
                value={form.research_interest ?? ''}
                onChange={(e) => set('research_interest', e.target.value)}
                className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
              />
            </Field>

            <Field
              label="Focus keywords"
              hint="Not shown publicly. Used by search and the filter tags."
            >
              <FocusKeywordsInput
                value={form.focus}
                onChange={(focus) => set('focus', focus)}
                suggestions={focusSuggestions}
              />
            </Field>
                        <Field
              label="OpenAlex author ID"
              hint="Set by the publications import. Edit only to fix a wrong match."
            >
              <input
                type="text"
                pattern="A[0-9]+"
                value={form.openalex_author_id ?? ''}
                onChange={(e) => set('openalex_author_id', e.target.value.trim())}
                placeholder="A5023888391"
                className="w-full rounded border border-stone-300 px-3 py-2 font-mono text-sm"
              />
            </Field>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Email">
            <input
              type="email"
              value={form.webmail ?? ''}
              onChange={(e) => set('webmail', e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Personal / profile link">
            <input
              type="url"
              value={form.link ?? ''}
              onChange={(e) => set('link', e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </Field>
        </div>

        <Field label="Google Scholar">
          <input
            type="url"
            value={form.google_scholar_url ?? ''}
            onChange={(e) => set('google_scholar_url', e.target.value)}
            placeholder="https://scholar.google.com/citations?user=…"
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Special designation" hint='e.g. "Coordinator, CoE-BIRD"'>
            <input
              type="text"
              value={form.special_designation ?? ''}
              onChange={(e) => set('special_designation', e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Priority" hint="Lower shows first. Leave empty to sort by name.">
            <input
              type="number"
              value={form.priority ?? ''}
              onChange={(e) =>
                set('priority', e.target.value.trim() === '' ? null : Number(e.target.value))
              }
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </Field>
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