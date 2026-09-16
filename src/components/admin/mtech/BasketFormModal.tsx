'use client';

import { useState } from 'react';
import { createMtechBasket, updateMtechBasket } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import Modal from '@/components/admin/Modal';
import type { MtechBasket } from '@/types/mtech';

const FORM_ID = 'basket-form';

export default function BasketFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: MtechBasket;
  onClose: () => void;
  onSaved: (row: MtechBasket) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = { name: name.trim() ? name.trim() : null };
    const result = initial
      ? await updateMtechBasket(initial.id, payload)
      : await createMtechBasket(payload);

    setSaving(false);

    if (!result) {
      toast.error('Failed to save the basket. Check the console for details.');
      return;
    }
    toast.success(initial ? 'Basket updated.' : 'Basket created.');
    onSaved(result);
  };

  return (
    <Modal
      title={initial ? 'Edit basket' : 'New basket'}
      onClose={onClose}
      maxWidth="max-w-sm"
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
      <form id={FORM_ID} onSubmit={handleSubmit}>
        <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Advanced Control"
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        />
        <p className="mt-1.5 text-xs text-stone-400">
          Only shown in eligibility-rule sentences and here in the dashboard. Leave blank for
          an in-list &quot;choose one of the following&quot; basket that doesn&apos;t need a
          name.
        </p>
      </form>
    </Modal>
  );
}