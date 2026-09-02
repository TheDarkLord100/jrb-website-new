'use client';

import { useEffect, useState } from 'react';
import { useAnnouncementsByType } from '@/lib/hooks/useAnnouncementsByType';
import { deleteAnnouncement } from '@/lib/supabase/queries';
import AnnouncementFormModal from './AnnouncementFormModal';
import type { Announcement } from '@/types/announcement';

const VISIBLE_COLUMNS: (keyof Announcement)[] = ['title', 'date', 'type', 'is_visible'];

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
                                    <input
                                        type="checkbox"
                                        checked={row.is_visible}
                                        readOnly
                                        disabled
                                        className="h-4 w-4 accent-teal-700 disabled:opacity-100"
                                    />
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