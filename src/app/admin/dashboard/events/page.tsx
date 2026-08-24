'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAnnouncementsByType } from '@/lib/hooks/useAnnouncementsByType';
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '@/lib/supabase/queries';
import type { Announcement } from '@/types/announcement';

const VISIBLE_COLUMNS: (keyof Announcement)[] = ['title', 'date', 'type', 'is_visible'];

const EMPTY_FORM: Omit<Announcement, 'id'> = {
  title: '',
  description: '',
  link_text: null,
  hyperlink: null,
  date: '',
  is_important: false,
  image_urls: null,
  type: 'event',
  is_visible: true,
};

export default function EventsTable() {
  const { items, error } = useAnnouncementsByType('event');
  const [rows, setRows] = useState<Announcement[] | null>(null);
  const [editingRow, setEditingRow] = useState<Announcement | null>(null); // null = closed
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (items) setRows(items);
  }, [items]);

  if (error) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn&apos;t load events right now. Please try again shortly.
      </p>
    );
  }

  if (!rows) {
    return (
      <div className="animate-pulse space-y-3 py-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-full rounded bg-gray-100" />
        ))}
      </div>
    );
  }

  const deleteRow = async (row: Announcement) => {
    if (!confirm(`Delete "${row.title}"? This can't be undone.`)) return;

    const ok = await deleteAnnouncement(row.id);
    if (!ok) {
      alert('Failed to delete row. Check the console for details.');
      return;
    }
    setRows((prev) => prev!.filter((r) => r.id !== row.id));
  };

  const handleSaved = (saved: Announcement) => {
    setRows((prev) => {
      if (!prev) return prev;
      const exists = prev.some((r) => r.id === saved.id);
      return exists ? prev.map((r) => (r.id === saved.id ? saved : r)) : [saved, ...prev];
    });
    setEditingRow(null);
    setIsCreating(false);
  };

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
        >
          + Add row
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              {VISIBLE_COLUMNS.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-4 py-3 text-left font-semibold capitalize text-gray-600"
                >
                  {col.replace(/_/g, ' ')}
                </th>
              ))}
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={VISIBLE_COLUMNS.length + 1} className="py-16 text-center text-gray-400">
                  No rows yet. Click &quot;Add row&quot; to create one.
                </td>
              </tr>
            )}

            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-serif font-semibold text-[#001A23]">{row.title}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.date}</td>
                <td className="px-4 py-3 capitalize text-gray-600">{row.type}</td>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={row.is_visible} readOnly disabled className="h-4 w-4 accent-teal-700 disabled:opacity-100" />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingRow(row)}
                      className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRow(row)}
                      className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editingRow || isCreating) && (
        <AnnouncementFormModal
          initial={editingRow ?? undefined}
          onClose={() => {
            setEditingRow(null);
            setIsCreating(false);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

function AnnouncementFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: Announcement;
  onClose: () => void;
  onSaved: (row: Announcement) => void;
}) {
  const [form, setForm] = useState<Omit<Announcement, 'id'>>(
    initial ? { ...initial } : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Omit<Announcement, 'id'>>(key: K, value: Omit<Announcement, 'id'>[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const result = initial
      ? await updateAnnouncement(initial.id, form)
      : await createAnnouncement(form);

    setSaving(false);

    if (!result) {
      alert('Failed to save. Check the console for details.');
      return;
    }
    onSaved(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-[#001A23]">
            {initial ? 'Edit event' : 'New event'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Title">
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={4}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Date">
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Type">
            <select
              value={form.type}
              onChange={(e) => set('type', e.target.value as Announcement['type'])}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="news">news</option>
              <option value="event">event</option>
              <option value="admission">admission</option>
            </select>
          </Field>

          <Field label="Link text">
            <input
              type="text"
              value={form.link_text ?? ''}
              onChange={(e) => set('link_text', e.target.value || null)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Hyperlink">
            <input
              type="text"
              value={form.hyperlink ?? ''}
              onChange={(e) => set('hyperlink', e.target.value || null)}
              placeholder="https://…"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Image URLs (comma-separated)">
            <input
              type="text"
              value={(form.image_urls ?? []).join(', ')}
              onChange={(e) =>
                set(
                  'image_urls',
                  e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                )
              }
              placeholder="url1, url2, ..."
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
            {form.image_urls && form.image_urls.length > 0 && (
              <div className="mt-2 flex gap-2">
                {form.image_urls.slice(0, 4).map((url, i) => (
                  <div key={i} className="relative h-12 w-12 overflow-hidden rounded bg-gray-100">
                    <Image src={url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </Field>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_important}
                onChange={(e) => set('is_important', e.target.checked)}
                className="h-4 w-4 accent-teal-700"
              />
              Important
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(e) => set('is_visible', e.target.checked)}
                className="h-4 w-4 accent-teal-700"
              />
              Visible
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
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
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </label>
      {children}
    </div>
  );
}