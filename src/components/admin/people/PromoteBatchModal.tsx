'use client';

import { useState } from 'react';
import { promoteBatchToAlumni } from '@/lib/supabase/queries';
import { batchesInUse, formatBatch } from '@/lib/batches';
import { useToast } from '@/components/admin/Toast';
import Modal from '@/components/admin/Modal';
import type { Person } from '@/types/person';

// Moves a whole batch of students to Alumni in one go. Only batches that
// currently have students are offered, oldest first -- that's almost always
// the one being promoted.
export default function PromoteBatchModal({
  people,
  onClose,
  onPromoted,
}: {
  people: Person[];
  onClose: () => void;
  onPromoted: (ids: string[]) => void;
}) {
  const batches = batchesInUse(people, 'student', 'asc');
  const [batch, setBatch] = useState(batches[0] ?? '');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const count = people.filter((p) => p.role === 'student' && p.year === batch).length;

  const handlePromote = async () => {
    if (!batch || count === 0) return;

    setSaving(true);
    const ids = await promoteBatchToAlumni(batch);
    setSaving(false);

    if (!ids) {
      toast.error('Failed to move the batch. Nothing was changed.');
      return;
    }
    toast.success(
      `${ids.length} student${ids.length === 1 ? '' : 's'} from ${formatBatch(batch)} moved to Alumni.`
    );
    onPromoted(ids);
  };

  return (
    <Modal
      title="Move batch to alumni"
      subtitle="Every student in the batch becomes an alumnus at once"
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
            type="button"
            onClick={handlePromote}
            disabled={saving || count === 0}
            className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {saving ? 'Moving…' : `Move ${count} to Alumni`}
          </button>
        </>
      }
    >
      {batches.length === 0 ? (
        <p className="text-sm text-stone-500">There are no students with a batch to move.</p>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase">
              Batch
            </label>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            >
              {batches.map((b) => (
                <option key={b} value={b}>
                  {formatBatch(b)} (
                  {people.filter((p) => p.role === 'student' && p.year === b).length} students)
                </option>
              ))}
            </select>
          </div>

          <p className="rounded bg-amber-50 px-3 py-2 text-sm text-amber-800">
            This will move <strong>{count}</strong> student{count === 1 ? '' : 's'} in{' '}
            <strong>{formatBatch(batch)}</strong> to the Alumni tab, under the same batch.
            There&apos;s no undo button here.
          </p>
        </div>
      )}
    </Modal>
  );
}