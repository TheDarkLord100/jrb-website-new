'use client';

import { useState } from 'react';
import { createMtechSpecialization, updateMtechSpecialization } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import Modal from '@/components/admin/Modal';
import { getLucideIcon } from '@/lib/lucideIconMap';
import type { MtechCard } from '@/types/mtech';

// Kept in sync with the ICONS map in lib/lucideIconMap.ts -- that map
// silently falls back to a plain circle for any name it doesn't recognize,
// so the admin field is a dropdown of known-good names rather than free
// text (a typo there would otherwise be invisible until checking the live
// page).
const ICON_NAMES = [
  'Users',
  'Leaf',
  'Factory',
  'HeartPulse',
  'Car',
  'Briefcase',
  'FlaskConical',
  'Lightbulb',
  'GraduationCap',
  'Compass',
  'Puzzle',
  'Target',
  'TrendingUp',
];

const EMPTY_FORM: Omit<MtechCard, 'id'> = {
  title: '',
  description: '',
  icon: ICON_NAMES[0],
  display_order: null,
};

const FORM_ID = 'specialization-form';

export default function SpecializationFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: MtechCard;
  onClose: () => void;
  onSaved: (row: MtechCard) => void;
}) {
  const [form, setForm] = useState<Omit<MtechCard, 'id'>>(
    initial ? { ...initial } : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const set = <K extends keyof Omit<MtechCard, 'id'>>(key: K, value: Omit<MtechCard, 'id'>[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const result = initial
      ? await updateMtechSpecialization(initial.id, form)
      : await createMtechSpecialization(form);

    setSaving(false);

    if (!result) {
      toast.error('Failed to save the specialization. Check the console for details.');
      return;
    }
    toast.success(initial ? 'Specialization updated.' : 'Specialization created.');
    onSaved(result);
  };

  const PreviewIcon = getLucideIcon(form.icon);

  return (
    <Modal
      title={initial ? 'Edit specialization' : 'New specialization'}
      onClose={onClose}
      maxWidth="max-w-lg"
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
            Title
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
            Description
          </label>
          <textarea
            required
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-[1fr_auto] items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
              Icon
            </label>
            <select
              value={form.icon}
              onChange={(e) => set('icon', e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            >
              {ICON_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded border border-stone-200 bg-stone-50">
            <PreviewIcon size={18} className="text-teal-700" strokeWidth={1.75} />
          </div>
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
      </form>
    </Modal>
  );
}