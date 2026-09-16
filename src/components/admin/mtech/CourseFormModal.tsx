'use client';

import { useState } from 'react';
import { createMtechCourse, updateMtechCourse } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import type { MtechCourse } from '@/types/mtech';

const CATEGORIES: MtechCourse['category'][] = [
  'core',
  'elective',
  'elective_slot',
  'open_category',
  'project',
];

const SEMESTERS = [
  'Semester I',
  'Winter Break',
  'Semester II',
  'Summer Term',
  'Semester III',
  'Semester IV',
];

// A course's is_break_component is fully determined by its semester -- no
// separate checkbox for it in the form.
const BREAK_SEMESTERS = ['Winter Break', 'Summer Term'];

const EMPTY_FORM: Omit<MtechCourse, 'id'> = {
  code: '',
  title: '',
  category: 'elective',
  semester: null,
  l: null,
  t: null,
  p: null,
  credits: 3,
  is_break_component: false,
  display_order: null,
};

// Text <-> number bridge for the L/T/P/credits/display_order inputs, all of
// which are nullable in the type but need to render as '' rather than
// 'null' in a controlled input.
function toInputValue(n: number | null): string {
  return n === null ? '' : String(n);
}
function fromInputValue(raw: string): number | null {
  if (raw.trim() === '') return null;
  const n = Number(raw);
  return Number.isNaN(n) ? null : n;
}

export default function CourseFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: MtechCourse;
  onClose: () => void;
  onSaved: (row: MtechCourse) => void;
}) {
  const [form, setForm] = useState<Omit<MtechCourse, 'id'>>(
    initial ? { ...initial } : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const set = <K extends keyof Omit<MtechCourse, 'id'>>(
    key: K,
    value: Omit<MtechCourse, 'id'>[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // code, semester, and display_order are optional -- normalize blank
    // strings to null rather than saving them as ''. is_break_component is
    // derived from semester, not user-entered -- it's not a real field on
    // the form, just implied by picking one of the two break semesters.
    const payload: Omit<MtechCourse, 'id'> = {
      ...form,
      code: form.code?.trim() ? form.code.trim() : null,
      is_break_component: BREAK_SEMESTERS.includes(form.semester ?? ''),
    };

    const result = initial
      ? await updateMtechCourse(initial.id, payload)
      : await createMtechCourse(payload);

    setSaving(false);

    if (!result) {
      toast.error('Failed to save the course. Check the console for details.');
      return;
    }
    toast.success(initial ? 'Course updated.' : 'Course created.');
    onSaved(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">
            {initial ? 'Edit course' : 'New course'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Code">
              <input
                type="text"
                value={form.code ?? ''}
                onChange={(e) => set('code', e.target.value)}
                placeholder="e.g. ELL7122"
                className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
              />
            </Field>

            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value as MtechCourse['category'])}
                className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Title">
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Semester">
            <select
              value={form.semester ?? ''}
              onChange={(e) => set('semester', e.target.value || null)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            >
              <option value="">— Not tied to a semester —</option>
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-4 gap-4">
            <Field label="L">
              <input
                type="number"
                min={0}
                value={toInputValue(form.l)}
                onChange={(e) => set('l', fromInputValue(e.target.value))}
                className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="T">
              <input
                type="number"
                min={0}
                value={toInputValue(form.t)}
                onChange={(e) => set('t', fromInputValue(e.target.value))}
                className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="P">
              <input
                type="number"
                min={0}
                value={toInputValue(form.p)}
                onChange={(e) => set('p', fromInputValue(e.target.value))}
                className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Credits">
              <input
                type="number"
                min={0}
                required
                value={form.credits}
                onChange={(e) => set('credits', Number(e.target.value))}
                className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
              />
            </Field>
          </div>

          <Field label="Display order">
            <input
              type="number"
              value={toInputValue(form.display_order)}
              onChange={(e) => set('display_order', fromInputValue(e.target.value))}
              placeholder="Lower shows first"
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </Field>

          <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {saving ? 'Saving…' : initial ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}
