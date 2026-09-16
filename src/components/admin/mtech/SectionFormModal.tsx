'use client';

import { useState } from 'react';
import { createMtechSection, updateMtechSection } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import type { MtechSection } from '@/types/mtech';

// Kept in sync with the section_key values MtechContent.tsx actually reads
// (bySectionKey(...) calls) -- a typo'd key here means the content block
// silently never shows up on the public page, so this is a dropdown of
// known-good keys rather than free text.
const SECTION_KEYS = [
  { value: 'overview', label: 'Overview' },
  { value: 'outcomes', label: 'Learning Outcomes' },
  { value: 'why-jrb', label: 'Why Choose JRB@IITD (can have multiple blocks)' },
  { value: 'electives-intro', label: 'Programme Electives — intro text' },
  { value: 'projects-intro', label: 'Projects — intro text' },
];

const EMPTY_FORM: Omit<MtechSection, 'id'> = {
  section_key: SECTION_KEYS[0].value,
  title: null,
  body_markdown: '',
  display_order: null,
};

export default function SectionFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: MtechSection;
  onClose: () => void;
  onSaved: (row: MtechSection) => void;
}) {
  const [form, setForm] = useState<Omit<MtechSection, 'id'>>(
    initial ? { ...initial } : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const set = <K extends keyof Omit<MtechSection, 'id'>>(
    key: K,
    value: Omit<MtechSection, 'id'>[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: Omit<MtechSection, 'id'> = {
      ...form,
      title: form.title?.trim() ? form.title.trim() : null,
    };

    const result = initial
      ? await updateMtechSection(initial.id, payload)
      : await createMtechSection(payload);

    setSaving(false);

    if (!result) {
      toast.error('Failed to save the section. Check the console for details.');
      return;
    }
    toast.success(initial ? 'Section updated.' : 'Section created.');
    onSaved(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">
            {initial ? 'Edit section' : 'New section'}
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
            <div>
              <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
                Section
              </label>
              <select
                value={form.section_key}
                onChange={(e) => set('section_key', e.target.value)}
                className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
              >
                {SECTION_KEYS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
                Display order
              </label>
              <input
                type="number"
                value={form.display_order ?? ''}
                onChange={(e) =>
                  set('display_order', e.target.value.trim() === '' ? null : Number(e.target.value))
                }
                placeholder="Lower shows first"
                className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
              Title{' '}
              <span className="text-stone-400 normal-case">
                (optional — only shown for multi-block sections like Why Choose JRB@IITD)
              </span>
            </label>
            <input
              type="text"
              value={form.title ?? ''}
              onChange={(e) => set('title', e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
              Body
            </label>
            <MarkdownEditor
              value={form.body_markdown}
              onChange={(v) => set('body_markdown', v)}
              rows={8}
              placeholder="Write the section content in Markdown…"
            />
          </div>

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
