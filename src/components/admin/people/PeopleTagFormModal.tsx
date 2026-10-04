'use client';

import { useState } from 'react';
import { createPeopleTag, updatePeopleTag } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import Modal from '@/components/admin/Modal';
import type { PeopleTag, PeopleTagInput } from '@/types/peopleTag';

const FORM_ID = 'people-tag-form';

export default function PeopleTagFormModal({
  initial,
  prefill,
  onClose,
  onSaved,
}: {
  initial?: PeopleTag;
  prefill?: Partial<PeopleTagInput>;
  onClose: () => void;
  onSaved: (tag: PeopleTag) => void;
}) {
  const [form, setForm] = useState<PeopleTagInput>(() => ({
    keyword: initial?.keyword ?? prefill?.keyword ?? '',
    label: initial?.label ?? prefill?.label ?? '',
    display_order: initial?.display_order ?? prefill?.display_order ?? 0,
  }));
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: PeopleTagInput = {
      keyword: form.keyword.trim().toLowerCase().replace(/\s+/g, ' '),
      label: form.label.trim(),
      display_order: form.display_order,
    };
    const result = initial
      ? await updatePeopleTag(initial.id, payload)
      : await createPeopleTag(payload);
    setSaving(false);

    if (!result) {
      toast.error('Failed to save. If a tag with this keyword already exists, edit that one.');
      return;
    }
    toast.success(initial ? 'Tag updated.' : `"${result.label}" added.`);
    onSaved(result);
  };

  return (
    <Modal
      title={initial ? 'Edit filter tag' : 'New filter tag'}
      subtitle="Shown as a filter pill on the People page's Faculty tab"
      onClose={onClose}
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
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
            Label
          </label>
          <input
            type="text"
            required
            value={form.label}
            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
            placeholder="Computer Vision"
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
            Keyword
          </label>
          <input
            type="text"
            required
            value={form.keyword}
            onChange={(e) => setForm((prev) => ({ ...prev, keyword: e.target.value }))}
            placeholder="vision"
            className="w-full rounded border border-stone-300 px-3 py-2 font-mono text-sm"
          />
          <p className="mt-1 text-xs text-stone-400">
            Matches faculty whose focus keywords contain this text anywhere. Saved in lowercase.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
            Order
          </label>
          <input
            type="number"
            required
            value={form.display_order}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, display_order: Number(e.target.value) || 0 }))
            }
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-stone-400">Lower shows first.</p>
        </div>
      </form>
    </Modal>
  );
}