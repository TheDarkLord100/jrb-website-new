'use client';

import { useState } from 'react';
import { createMtechCreditCategory, updateMtechCreditCategory } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import Modal from '@/components/admin/Modal';
import type { MtechCreditCategory } from '@/types/mtech';

const EMPTY_FORM: Omit<MtechCreditCategory, 'id'> = {
  category: '',
  description: '',
  credits: 0,
  display_order: null,
};

const FORM_ID = 'credit-category-form';

export default function CreditCategoryFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: MtechCreditCategory;
  onClose: () => void;
  onSaved: (row: MtechCreditCategory) => void;
}) {
  const [form, setForm] = useState<Omit<MtechCreditCategory, 'id'>>(
    initial ? { ...initial } : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const set = <K extends keyof Omit<MtechCreditCategory, 'id'>>(
    key: K,
    value: Omit<MtechCreditCategory, 'id'>[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const result = initial
      ? await updateMtechCreditCategory(initial.id, form)
      : await createMtechCreditCategory(form);

    setSaving(false);

    if (!result) {
      toast.error('Failed to save. Check the console for details.');
      return;
    }
    toast.success(initial ? 'Credit category updated.' : 'Credit category created.');
    onSaved(result);
  };

  return (
    <Modal
      title={initial ? 'Edit credit category' : 'New credit category'}
      onClose={onClose}
      maxWidth="max-w-md"
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
            Category
          </label>
          <input
            type="text"
            required
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            placeholder="e.g. Programme Core"
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
            Description
          </label>
          <input
            type="text"
            required
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
              Credits
            </label>
            <input
              type="number"
              min={0}
              required
              value={form.credits}
              onChange={(e) => set('credits', Number(e.target.value))}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
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
      </form>
    </Modal>
  );
}